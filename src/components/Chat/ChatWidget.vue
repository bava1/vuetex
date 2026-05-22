<template>
  <div class="chat-widget">
    <button
      v-show="!isOpen"
      class="chat-launcher"
      type="button"
      @click="isOpen = true"
    >
      <div class="chat-launcher-main">
        <span>VX://AI</span><span class="cursor">_</span>
      </div>
      <div class="chat-launcher-sub">
        <span class="status-dot"></span>
        <span class="status-default">ONLINE</span>
        <span class="status-hover">OPEN TERMINAL</span>
      </div>
      <q-tooltip
        content-class="chat-launcher-tooltip"
        anchor="top middle"
        self="bottom middle"
        :offset="[0, 10]"
        transition-show="fade"
        transition-hide="fade"
        :delay="200"
      >
        <div>AI Assistant for Vue &amp; Quasar</div>
      </q-tooltip>
    </button>

    <q-dialog
      v-model="isOpen"
      :maximized="$q.screen.lt.md"
      :position="$q.screen.lt.md ? 'standard' : 'right'"
    >
        <q-card class="chat-panel">
          <q-card-section class="chat-header row items-center justify-between">
          <div class="chat-header-left">
            <div class="chat-title-row">
              <span class="header-dot"></span>
              <div class="chat-title">VX://AI TERMINAL</div>
              <span class="chat-header-status">ONLINE</span>
            </div>
            <div class="chat-subtitle">Vue / Quasar Developer Console</div>
          </div>
          <q-btn flat round dense icon="close" color="green-4" @click="isOpen = false" />
        </q-card-section>

        <q-separator dark color="green-9" />

        <q-card-section class="chat-body">
          <div v-if="isLoading" class="chat-overlay">
            <div class="chat-overlay-text">
              {{ loadingOverlayText }}
            </div>
          </div>

          <div ref="chatScrollRef" class="chat-scroll">
            <div v-if="messages.length === 0" class="chat-welcome">
              Hi! I'm an AI assistant focused on Vue, Quasar, frontend development, and more. Ask anything.
            </div>

            <div v-else class="chat-messages">
            <div
              v-for="(message, index) in messages"
              :key="`${message.role}-${index}`"
              class="chat-message"
              :class="`chat-message--${message.role}`"
              >
                <div class="chat-message-role">
                  {{ message.role === 'user' ? 'INPUT SIGNAL' : 'MATRIX RECOMMENDS:' }}
                </div>
                <div v-if="message.role === 'assistant' && message.displayPrefix" class="chat-message-prefix">
                  {{ message.displayPrefix }}
                </div>
                <div v-if="message.role === 'assistant'" class="chat-message-content">
                  <AssistantMessageRenderer :content="message.content" />
                </div>
                <div v-else class="chat-message-content">{{ message.content }}</div>

                <div v-if="message.role === 'assistant'" class="assistant-actions">
                  <q-btn
                    flat
                    dense
                    round
                    size="sm"
                    color="green-5"
                    :icon="copiedAssistantIndex === index ? 'check' : 'content_copy'"
                    @click="copyAssistantAnswer(message.content, index)"
                  >
                    <q-tooltip class="bg-black text-green-4">
                      {{ copiedAssistantIndex === index ? 'Copied' : 'Copy answer' }}
                    </q-tooltip>
                  </q-btn>

                  <q-btn
                    flat
                    dense
                    round
                    size="sm"
                    color="green-5"
                    icon="refresh"
                    :disable="isLoading"
                    @click="regenerateFrom(index)"
                  >
                    <q-tooltip class="bg-black text-green-4">Regenerate answer</q-tooltip>
                  </q-btn>

                  <q-btn
                    flat
                    dense
                    round
                    size="sm"
                    :color="message.reaction === 'like' ? 'green-3' : 'green-5'"
                    icon="thumb_up"
                    @click="toggleReaction(index, 'like')"
                  >
                    <q-tooltip class="bg-black text-green-4">Like</q-tooltip>
                  </q-btn>

                  <q-btn
                    flat
                    dense
                    round
                    size="sm"
                    :color="message.reaction === 'dislike' ? 'green-3' : 'green-5'"
                    icon="thumb_down"
                    @click="toggleReaction(index, 'dislike')"
                  >
                    <q-tooltip class="bg-black text-green-4">Dislike</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator dark color="green-9" />

        <q-card-section class="chat-input-section">
          <q-input
            v-model="currentMessage"
            type="textarea"
            autogrow
            outlined
            dark
            color="green-6"
            label-color="green-5"
            input-class="text-green-2"
            label="Ask anything..."
            :disable="isLoading"
            @keyup.enter.exact.prevent="sendMessage"
          />

          <div class="chat-actions">
            <q-btn
              no-caps
              outline
              color="green-6"
              label="Export chat"
              @click="exportChat"
            />
            <q-btn
              no-caps
              outline
              color="green-6"
              label="Clear chat"
              @click="showClearDialog = true"
            />
            <q-btn
              no-caps
              unelevated
              color="green-8"
              label="Send"
              :disable="isLoading || !currentMessage.trim()"
              @click="sendMessage"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showClearDialog">
      <q-card class="confirm-card">
        <q-card-section class="text-h6 text-green-4">Clear chat?</q-card-section>
        <q-card-section class="text-green-2">
          This will remove the current chat history.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat no-caps color="green-5" label="Cancel" v-close-popup />
          <q-btn flat no-caps color="green-3" label="Clear" @click="clearChat" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { AI_CONFIG } from "src/config/aiConfig";
import AssistantMessageRenderer from "src/components/Chat/AssistantMessageRenderer.vue";

const $q = useQuasar();
const isOpen = ref(false);
const showClearDialog = ref(false);
const isLoading = ref(false);
const currentMessage = ref("");
const messages = ref([]);
const loadingOverlayText = ref("> Incoming transmission...");
const chatScrollRef = ref(null);
const copiedAssistantIndex = ref(null);
let overlayPhraseTimer = null;

const systemPrompt = `You are an AI assistant focused primarily on Vue.js, Quasar Framework, frontend engineering and modern web development.

The interface has a Matrix-inspired cyber-terminal style. You may keep a subtle hacker-terminal tone when appropriate, but your answers must remain useful, clear and technically accurate.

Prefer helping with:
- Vue.js
- Quasar Framework
- Composition API
- Pinia
- Vue Router
- TypeScript
- Components
- State management
- Frontend architecture
- API integration
- UI/UX
- Performance
- Deployment

When questions relate to frontend, answer with deeper technical detail.

For general topics answer normally.

Do not overuse Matrix jokes. Do not repeatedly mention your specialization.`;

const errorText = "AI connection is temporarily unavailable. Please try again later.";
const errorPrefix = "Signal interrupted:";
const loadingPhrases = [
  "> Incoming transmission...",
  "> Decrypting green code...",
  "> Parsing hidden patterns...",
  "> Analyzing Vue structures...",
  "> Mapping component tree...",
  "> Compiling response...",
  "> Decoding transmission...",
  "> Reading system fragments...",
  "> Building possible routes...",
  "> Scanning frontend architecture...",
  "> Inspecting reactive state...",
  "> Tracing hidden dependencies...",
  "> Processing signal...",
  "> Interpreting code patterns...",
  "> Synchronizing context...",
  "> Resolving component logic...",
];
const assistantPrefixes = [
  "Matrix suggests examining this approach:",
  "Oracle detected a possible solution:",
  "The green code indicates:",
  "Signal translated successfully:",
  "Hidden patterns recommend:",
  "Decoded response:",
  "System analysis completed:",
  "The Oracle recommends:",
  "A possible route through the code:",
  "Transmission processed:",
];

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];
const toApiMessage = ({ role, content }) => ({ role, content });

const scrollChatToBottom = async () => {
  await nextTick();
  const el = chatScrollRef.value?.$el || chatScrollRef.value;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
};

const extractAssistantText = (data) => {
  if (!data || typeof data !== "object") return "";

  if (typeof data.reply === "string") return data.reply;
  if (typeof data.message === "string") return data.message;
  if (typeof data.content === "string") return data.content;
  if (typeof data.answer === "string") return data.answer;

  const choiceContent = data.choices?.[0]?.message?.content;
  if (typeof choiceContent === "string") return choiceContent;

  return "";
};

const startLoading = () => {
  isLoading.value = true;
  loadingOverlayText.value = "> Incoming transmission...";
  if (overlayPhraseTimer) {
    clearTimeout(overlayPhraseTimer);
    overlayPhraseTimer = null;
  }
  overlayPhraseTimer = setTimeout(() => {
    loadingOverlayText.value = pickRandom(loadingPhrases);
  }, 300);
};

const stopLoading = () => {
  if (overlayPhraseTimer) {
    clearTimeout(overlayPhraseTimer);
    overlayPhraseTimer = null;
  }
  isLoading.value = false;
  loadingOverlayText.value = "";
};

const requestAssistant = async ({ userText, appendUserMessage, apiHistory }) => {
  if (isLoading.value) return;

  const userMessage = { role: "user", content: userText, timestamp: new Date().toISOString() };
  const historyForApi = Array.isArray(apiHistory) ? apiHistory : messages.value.map(toApiMessage);
  const requestMessages = [...historyForApi, toApiMessage(userMessage)];
  if (appendUserMessage) {
    messages.value.push(userMessage);
    currentMessage.value = "";
  }
  startLoading();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const payload = {
      messages: [
        { role: "system", content: systemPrompt },
        ...requestMessages,
      ],
    };

    const response = await fetch(`${AI_CONFIG.baseUrl}${AI_CONFIG.chatPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-ID": AI_CONFIG.clientId,
        "X-Client-Token": AI_CONFIG.clientToken,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("backend_error");
    }

    const data = await response.json();
    const assistantText = extractAssistantText(data).trim();

    if (!assistantText) {
      throw new Error("empty_response");
    }

    messages.value.push({
      role: "assistant",
      content: assistantText,
      displayPrefix: pickRandom(assistantPrefixes),
      timestamp: new Date().toISOString(),
      reaction: null,
    });
  } catch (error) {
    console.warn("AI chat request failed:", error);
    messages.value.push({
      role: "assistant",
      content: errorText,
      displayPrefix: errorPrefix,
      timestamp: new Date().toISOString(),
      reaction: null,
    });
  } finally {
    clearTimeout(timeoutId);
    stopLoading();
  }
};

const sendMessage = async () => {
  const text = currentMessage.value.trim();
  if (!text || isLoading.value) return;
  await requestAssistant({ userText: text, appendUserMessage: true });
};

const copyAssistantAnswer = async (text, index) => {
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

  copiedAssistantIndex.value = index;
  setTimeout(() => {
    if (copiedAssistantIndex.value === index) {
      copiedAssistantIndex.value = null;
    }
  }, 1000);
};

const toggleReaction = (index, reaction) => {
  const message = messages.value[index];
  if (!message || message.role !== "assistant") return;
  message.reaction = message.reaction === reaction ? null : reaction;
};

const regenerateFrom = async (assistantIndex) => {
  if (isLoading.value) return;

  let previousUserMessage = null;
  for (let i = assistantIndex - 1; i >= 0; i -= 1) {
    if (messages.value[i]?.role === "user") {
      previousUserMessage = messages.value[i];
      break;
    }
  }

  if (!previousUserMessage?.content) return;

  const apiHistory = messages.value.map(toApiMessage);
  await requestAssistant({
    userText: previousUserMessage.content,
    appendUserMessage: false,
    apiHistory,
  });
};

const clearChat = () => {
  messages.value = [];
  copiedAssistantIndex.value = null;
  showClearDialog.value = false;
};

watch(isOpen, (value) => {
  if (!value) {
    clearChat();
    currentMessage.value = "";
  }
});

watch(messages, () => {
  scrollChatToBottom();
}, { deep: true });

watch(isLoading, (value) => {
  if (!value) {
    scrollChatToBottom();
  }
});

const exportChat = () => {
  const content = messages.value
    .map((message) => {
      if (message.role === "user") {
        return `INPUT SIGNAL:\n${message.content}`;
      }

      const prefixPart = message.displayPrefix ? `${message.displayPrefix}\n` : "";
      return `MATRIX RECOMMENDS:\n${prefixPart}${message.content}`;
    })
    .join("\n\n");

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "vuetex-ai-chat.txt";
  link.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped lang="scss">
.chat-launcher {
  position: fixed;
  right: 24px;
  bottom: 60px;
  z-index: 1200;
  width: 128px;
  height: 56px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid rgba(70, 255, 139, 0.75);
  background: rgba(0, 20, 10, 0.78);
  color: #46ff8b;
  box-shadow: 0 0 10px rgba(70, 255, 139, 0.28);
  font-family: Consolas, "Courier New", monospace;
  text-transform: uppercase;
  letter-spacing: 0.04rem;
  text-align: left;
  cursor: pointer;
  animation: launcherPulse 2.7s ease-in-out infinite;
  transition: box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.chat-launcher-main {
  display: flex;
  align-items: center;
  font-size: 16px;
  line-height: 1;
  font-weight: 700;
}

.chat-launcher-sub {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #46ff8b;
  box-shadow: 0 0 8px rgba(70, 255, 139, 0.6);
  animation: statusPulse 1.8s ease-in-out infinite;
}

.cursor {
  margin-left: 1px;
  animation: cursorBlink 1.05s steps(1, end) infinite;
}

.status-hover {
  display: none;
}

.chat-launcher:hover {
  border-color: rgba(122, 255, 171, 0.95);
  background: rgba(0, 28, 13, 0.86);
  box-shadow: 0 0 16px rgba(70, 255, 139, 0.45);
}

.chat-launcher:hover .status-default {
  display: none;
}

.chat-launcher:hover .status-hover {
  display: inline;
}

:deep(.q-dialog__inner--right) {
  padding: 16px;
}

.chat-panel {
  width: clamp(420px, 36vw, 680px);
  max-width: 40vw;
  min-width: 33vw;
  height: calc(100vh - 32px);
  max-height: calc(100vh - 32px);
  background: rgba(0, 20, 10, 0.92);
  color: #bfffd5;
  border: 1px solid rgba(42, 221, 126, 0.65);
  box-shadow: 0 0 18px rgba(42, 221, 126, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: rgba(1, 40, 18, 0.8);
}

.chat-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #46ff8b;
  box-shadow: 0 0 9px rgba(70, 255, 139, 0.65);
  animation: statusPulse 1.8s ease-in-out infinite;
}

.chat-title {
  color: #8effb9;
  font-weight: 700;
  letter-spacing: 0.08rem;
}

.chat-header-status {
  color: #6dffab;
  font-family: Consolas, "Courier New", monospace;
  font-size: 11px;
  letter-spacing: 0.06rem;
  opacity: 0.9;
}

.chat-subtitle {
  color: #5ae79b;
  font-size: 12px;
  opacity: 0.9;
}

.chat-body {
  position: relative;
  flex: 1;
  overflow: hidden;
  padding-bottom: 0;
}

.chat-scroll {
  height: 100%;
  overflow: auto;
  padding-right: 14px;
  padding-bottom: 10px;
  scrollbar-width: thin;
  scrollbar-color: rgba(70, 255, 139, 0.25) rgba(0, 40, 20, 0.25);
}

.chat-scroll::-webkit-scrollbar {
  width: 7px;
}

.chat-scroll::-webkit-scrollbar-track {
  background: rgba(0, 40, 20, 0.25);
  border-radius: 8px;
}

.chat-scroll::-webkit-scrollbar-thumb {
  background: rgba(70, 255, 139, 0.25);
  border-radius: 8px;
}

.chat-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(70, 255, 139, 0.45);
}

.chat-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 10, 4, 0.78);
  border: 1px solid rgba(42, 221, 126, 0.25);
}

.chat-overlay-text {
  color: #8effb9;
  font-family: Consolas, "Courier New", monospace;
  font-size: 15px;
  text-shadow: 0 0 6px rgba(42, 221, 126, 0.55);
}

.chat-welcome {
  border: 1px dashed rgba(42, 221, 126, 0.45);
  border-radius: 8px;
  padding: 12px;
  margin-right: 2px;
  background: rgba(4, 36, 18, 0.75);
  color: #9af7c0;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 2px;
}

.chat-message {
  border-radius: 8px;
  padding: 10px 12px;
  border: 1px solid rgba(42, 221, 126, 0.35);
}

.chat-message--user {
  background: rgba(7, 50, 24, 0.8);
  width: 70%;
  margin-left: auto;
}

.chat-message--assistant {
  background: rgba(1, 33, 15, 0.8);
}

.chat-message-role {
  font-size: 11px;
  color: #6dffab;
  opacity: 0.85;
  margin-bottom: 5px;
}

.chat-message-prefix {
  color: #83ffc0;
  font-family: Consolas, "Courier New", monospace;
  font-size: 12px;
  margin-bottom: 6px;
}

.chat-message-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.assistant-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
  color: rgba(70, 255, 139, 0.65);
}

.assistant-actions :deep(.q-btn) {
  opacity: 0.85;
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.assistant-actions :deep(.q-btn:hover) {
  opacity: 1;
  transform: translateY(-1px);
}

.chat-input-section {
  background: rgba(0, 18, 9, 0.95);
}

.chat-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.confirm-card {
  width: min(420px, 92vw);
  background: rgba(0, 20, 10, 0.96);
  border: 1px solid rgba(42, 221, 126, 0.6);
}

@keyframes cursorBlink {
  0%,
  45% {
    opacity: 1;
  }
  46%,
  100% {
    opacity: 0.2;
  }
}

@keyframes launcherPulse {
  0%,
  100% {
    box-shadow: 0 0 10px rgba(70, 255, 139, 0.25);
  }
  50% {
    box-shadow: 0 0 15px rgba(70, 255, 139, 0.42);
  }
}

@keyframes statusPulse {
  0%,
  100% {
    opacity: 0.7;
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
}

@media screen and (max-width: 1023px) {
  .chat-launcher {
    right: 14px;
    bottom: 54px;
    width: 114px;
    height: 50px;
    padding: 7px 8px;
  }

  .chat-launcher-main {
    font-size: 14px;
  }

  .chat-launcher-sub {
    font-size: 10px;
  }

  .chat-panel {
    width: 100vw;
    min-width: 100vw;
    max-width: 100vw;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }

  .chat-actions {
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .chat-scroll {
    padding-right: 10px;
  }

  .chat-header-status {
    font-size: 10px;
  }
}
</style>

<style lang="scss">
.chat-launcher-tooltip {
  background: rgba(0, 14, 7, 0.98) !important;
  background-color: rgba(0, 14, 7, 0.98) !important;
  color: #46ff8b !important;
  border: 1px solid rgba(70, 255, 139, 0.45) !important;
  box-shadow: 0 0 12px rgba(70, 255, 139, 0.25) !important;
  font-family: Consolas, "Courier New", monospace !important;
  font-size: 11px !important;
  letter-spacing: 0.04rem !important;
  padding: 8px 10px !important;
}
</style>
