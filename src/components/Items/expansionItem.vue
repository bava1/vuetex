<template>
  <q-expansion-item v-for="features in itemsList" :key="features.label"
    group="somegroup"
    :icon="features.icon"
    :label="features.label"
    class="q-my-xs shadow-10"
    header-class="bg-green-7 text-white"
    expand-icon-class="text-white">
    <q-card>
      <q-card-section class="bg-green-11">
        {{ features.text }}
      </q-card-section>
    </q-card>
  </q-expansion-item>
  <q-separator />
</template>

<script setup>
// import { ref } from 'vue';

const props = defineProps({
  itemsList: {
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
