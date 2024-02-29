<template>
  <div class="fit q-pt-md q-pl-md column">
    <router-link v-for="link in props.linksList" :key="link.text" :to="link.link" class="fit-link q-my-sm">
      <q-btn size="30px" :icon="link.icon" class="bg-transparent q-mx-sm">
        <q-tooltip anchor="center right" self="center left" :offset="[10, 10]" class="tool-text bg-transparent text-h6">
           <div class="tool-text">{{ link.text }}</div>
        </q-tooltip>
      </q-btn>
    </router-link>
  </div>
</template>

<script setup>
// import { ref } from 'vue';

const props = defineProps({
  linksList: {
    type: Array,
  },
});
</script>

<style lang="scss" scoped>

.fit-link {
  text-decoration: none;
  color: rgb(88, 228, 137);
  opacity: .7;
}

.fit-link:hover {
  transform: scale(1.1);
  filter: blur(1px);
}
.tool-text {
  color: #2add7e !important;
  text-shadow: 2px 2px 2px rgb(66, 193, 178) !important;
  letter-spacing: .2rem !important;
}
</style>
