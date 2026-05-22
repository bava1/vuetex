<template>
  <div class="assistant-renderer">
    <template v-for="(block, blockIndex) in blocks" :key="`${block.type}-${blockIndex}`">
      <h1 v-if="block.type === 'h1'" class="md-h1">
        <InlineMarkdown :text="block.text" />
      </h1>

      <h2 v-else-if="block.type === 'h2'" class="md-h2">
        <InlineMarkdown :text="block.text" />
      </h2>

      <ul v-else-if="block.type === 'list'" class="md-list">
        <li v-for="(item, itemIndex) in block.items" :key="itemIndex">
          <InlineMarkdown :text="item" />
        </li>
      </ul>

      <div v-else-if="block.type === 'code'" class="code-wrap">
        <div class="code-head row items-center justify-between">
          <span>{{ normalizeLangLabel(block.lang) }}</span>
          <q-btn
            dense
            flat
            no-caps
            color="green-4"
            class="copy-btn"
            :label="copiedKey === block.key ? '✓ COPIED' : 'COPY'"
            @click="copyCode(block.code, block.key)"
          />
        </div>
        <pre class="code-pre"><code v-html="highlightCode(block.code, block.lang)" /></pre>
      </div>

      <p v-else class="md-p">
        <InlineMarkdown :text="block.text" />
      </p>
    </template>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, ref } from "vue";

const props = defineProps({
  content: {
    type: String,
    default: "",
  },
});

const copiedKey = ref("");

const InlineMarkdown = defineComponent({
  name: "InlineMarkdown",
  props: {
    text: {
      type: String,
      default: "",
    },
  },
  setup(inlineProps) {
    const parseInline = (text) => {
      const parts = [];
      const pattern = /(`[^`]+`|\*\*[^*]+\*\*)/g;
      let last = 0;
      let match;

      while ((match = pattern.exec(text)) !== null) {
        if (match.index > last) {
          parts.push({ type: "text", value: text.slice(last, match.index) });
        }
        const token = match[0];
        if (token.startsWith("`")) {
          parts.push({ type: "code", value: token.slice(1, -1) });
        } else {
          parts.push({ type: "bold", value: token.slice(2, -2) });
        }
        last = pattern.lastIndex;
      }

      if (last < text.length) {
        parts.push({ type: "text", value: text.slice(last) });
      }

      return parts;
    };

    return () =>
      h(
        "span",
        parseInline(inlineProps.text).map((part, index) => {
          if (part.type === "code") {
            return h("code", { class: "inline-code", key: index }, part.value);
          }
          if (part.type === "bold") {
            return h("strong", { key: index }, part.value);
          }
          return h("span", { key: index }, part.value);
        })
      );
  },
});

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const highlightMarkup = (code) => {
  let out = escapeHtml(code);
  out = out.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="tok-comment">$1</span>');
  out = out.replace(/(&lt;\/?)([a-zA-Z0-9-]+)(.*?&gt;)/g, (_, p1, p2, p3) => {
    const attrs = p3.replace(
      /([:@a-zA-Z0-9-]+)(=)("[^"]*"|'[^']*')/g,
      '<span class="tok-attr">$1</span>$2<span class="tok-string">$3</span>'
    );
    return `<span class="tok-punc">${p1}</span><span class="tok-tag">${p2}</span>${attrs}`;
  });
  return out;
};

const highlightScript = (code) => {
  let out = escapeHtml(code);
  out = out.replace(/(\/\/.*$)/gm, '<span class="tok-comment">$1</span>');
  out = out.replace(/(".*?"|'.*?'|`[\s\S]*?`)/g, '<span class="tok-string">$1</span>');
  out = out.replace(
    /\b(const|let|var|return|if|else|for|while|switch|case|break|continue|function|async|await|import|from|export|default|new|class|extends|try|catch|finally|throw|true|false|null|undefined|typeof|instanceof)\b/g,
    '<span class="tok-key">$1</span>'
  );
  out = out.replace(/\b(ref|reactive|computed|watch|onMounted|defineProps|defineEmits|defineStore)\b/g, '<span class="tok-fn">$1</span>');
  return out;
};

const highlightStyle = (code) => {
  let out = escapeHtml(code);
  out = out.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-comment">$1</span>');
  out = out.replace(/([a-zA-Z-]+)(\s*:)/g, '<span class="tok-attr">$1</span>$2');
  out = out.replace(/(#(?:[0-9a-fA-F]{3}){1,2}\b|rgba?\(.*?\)|\b\d+(px|rem|em|%)\b)/g, '<span class="tok-string">$1</span>');
  return out;
};

const highlightCode = (code, lang) => {
  const normalized = (lang || "").toLowerCase();
  if (["html", "xml"].includes(normalized)) return highlightMarkup(code);
  if (["css", "scss", "sass"].includes(normalized)) return highlightStyle(code);
  if (["js", "javascript", "ts", "typescript", "vue"].includes(normalized)) {
    if (normalized === "vue") return highlightMarkup(code);
    return highlightScript(code);
  }
  return escapeHtml(code);
};

const normalizeLangLabel = (lang) => {
  const value = (lang || "").trim().toLowerCase();
  if (!value) return "CODE";
  if (["javascript", "js"].includes(value)) return "JS";
  if (["typescript", "ts"].includes(value)) return "TS";
  if (["html", "xml"].includes(value)) return "HTML";
  if (["css", "scss", "sass"].includes(value)) return "CSS";
  if (value === "vue") return "VUE";
  return value.toUpperCase();
};

const parseMarkdown = (rawText) => {
  const text = (rawText || "").replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  const result = [];

  let inCode = false;
  let codeLang = "";
  let codeLines = [];
  let listItems = [];
  let paragraphLines = [];

  const flushList = () => {
    if (listItems.length) {
      result.push({ type: "list", items: [...listItems] });
      listItems = [];
    }
  };

  const flushParagraph = () => {
    if (paragraphLines.length) {
      result.push({ type: "p", text: paragraphLines.join(" ") });
      paragraphLines = [];
    }
  };

  lines.forEach((line, index) => {
    if (line.trim().startsWith("```")) {
      if (!inCode) {
        flushList();
        flushParagraph();
        inCode = true;
        codeLang = line.trim().slice(3).trim();
        codeLines = [];
      } else {
        result.push({
          type: "code",
          lang: codeLang,
          code: codeLines.join("\n"),
          key: `code-${index}-${codeLang || "plain"}`,
        });
        inCode = false;
        codeLang = "";
        codeLines = [];
      }
      return;
    }

    if (inCode) {
      codeLines.push(line);
      return;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      flushParagraph();
      return;
    }

    const heading2 = trimmed.match(/^##\s+(.+)/);
    if (heading2) {
      flushList();
      flushParagraph();
      result.push({ type: "h2", text: heading2[1] });
      return;
    }

    const heading1 = trimmed.match(/^#\s+(.+)/);
    if (heading1) {
      flushList();
      flushParagraph();
      result.push({ type: "h1", text: heading1[1] });
      return;
    }

    const listItem = trimmed.match(/^-\s+(.+)/);
    if (listItem) {
      flushParagraph();
      listItems.push(listItem[1]);
      return;
    }

    flushList();
    paragraphLines.push(trimmed);
  });

  flushList();
  flushParagraph();
  if (inCode) {
    result.push({
      type: "code",
      lang: codeLang,
      code: codeLines.join("\n"),
      key: `code-tail-${codeLang || "plain"}`,
    });
  }

  return result;
};

const blocks = computed(() => parseMarkdown(props.content));

const copyCode = async (text, key) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const input = document.createElement("textarea");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
  }

  copiedKey.value = key;
  setTimeout(() => {
    if (copiedKey.value === key) copiedKey.value = "";
  }, 1000);
};
</script>

<style scoped lang="scss">
.assistant-renderer {
  width: 100%;
}

.md-h1,
.md-h2,
.md-p {
  margin: 0 0 8px;
  word-break: break-word;
}

.md-h1 {
  color: #9bffca;
  font-size: 18px;
}

.md-h2 {
  color: #8effbe;
  font-size: 16px;
}

.md-p {
  color: #c5ffe0;
}

.md-list {
  margin: 0 0 8px 18px;
  padding: 0;
}

.md-list li {
  margin-bottom: 4px;
}

:deep(.inline-code) {
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(46, 207, 109, 0.45);
  border-radius: 4px;
  padding: 1px 6px;
  color: #82ffbc;
  font-family: Consolas, "Courier New", monospace;
  font-size: 0.92em;
}

.code-wrap {
  margin: 8px 0 10px;
  border: 1px solid #2ecf6d;
  border-radius: 9px;
  background: rgba(0, 0, 0, 0.8);
  overflow: hidden;
  box-shadow: 0 0 8px rgba(46, 207, 109, 0.25);
}

.code-head {
  padding: 6px 10px;
  border-bottom: 1px solid rgba(46, 207, 109, 0.4);
  background: rgba(0, 20, 10, 0.95);
  color: #8effbe;
  font-family: Consolas, "Courier New", monospace;
  font-size: 12px;
  letter-spacing: 0.04rem;
}

.copy-btn {
  font-family: Consolas, "Courier New", monospace;
}

.code-pre {
  margin: 0;
  padding: 12px;
  overflow-x: auto;
  max-width: 100%;
}

.code-pre code {
  display: block;
  white-space: pre;
  min-width: max-content;
  color: #dbffed;
  font-family: Consolas, "Courier New", monospace;
  font-size: 12px;
  line-height: 1.45;
}

:deep(.tok-key) {
  color: #68e9ff;
}

:deep(.tok-string) {
  color: #ffd37e;
}

:deep(.tok-comment) {
  color: #7cab8f;
  font-style: italic;
}

:deep(.tok-tag) {
  color: #ff9d76;
}

:deep(.tok-attr) {
  color: #8bc6ff;
}

:deep(.tok-punc) {
  color: #90f5b6;
}

:deep(.tok-fn) {
  color: #a6ff85;
}
</style>
