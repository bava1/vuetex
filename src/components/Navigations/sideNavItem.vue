<template>
  <router-link :to="props.link" style="text-decoration: none" color="green-9" class="row">
    <q-item-section avatar>
      <q-icon :name="props.icon" color="green-9" size="lg" />
    </q-item-section>
    <q-item-section>
      <q-item-label color="green-9" class="text-h5">{{ props.text }}</q-item-label>
    </q-item-section>
  </router-link>
</template>

<script setup>
// import { ref } from 'vue';

const props = defineProps({
  link: {
    type: String,
    default: '/',
  },
  icon: {
    type: String,
    default: 'home',
  },
  text: {
    type: String,
    default: 'item',
  }
});
</script>
