<template>
  <div class="item" v-for="contact in contactList" :key="contact">
    <div class="item-names">
      <q-img :src="getImageUrl(contact.photo)" alt="ll" style="width: 50px;" />
      <div class="item-names_name">
        <div class="text-weight-bold">
          <span>{{ contact.name }}&nbsp;</span>
          <span> {{ contact.surname }}</span>
        </div>
        <div>
          {{ contact.department }}
        </div>
      </div>
    </div>
    <div class="item-connection">
      <div><q-icon class="q-mr-sm" name="mail" color="green-9" size="xs" /> {{ contact.email }}</div>
      <div><q-icon class="q-mr-sm" name="phone" color="green-9" size="xs" /> {{ contact.phone }}</div>
    </div>
  </div>
</template>

<script setup>
// import { ref } from 'vue';

const props = defineProps({
  contactList: {
    type: Array,
  },
});

const getImageUrl = (name) => {
  return new URL(`../../assets/Contacts/${name}`, import.meta.url).href
};
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  justify-content: space-between;
  width: 450px;
  padding: 5px;
  margin: 7px 0;
  color: #2add7e;
  border:1px dashed #0a3b21;
  border-radius: 6px;

  &-names {
    display: flex;

    &_name {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      & div {
        padding: 4px 8px 4px 15px;
      }
    }
  }

  &-connection {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    width: 50%;

    & div {
      display: flex;
      align-items: center;
      padding: 4px 8px 4px 2px;
    }
  }
}

@media screen and (max-width: 570px) {

  .item {
    width: 300px;
    font-size: 8px;
    &-names {

      &_name {
        & div {
          padding: 12px 8px 12px 15px;
        }
      }
    }
    &-connection {

      & div {
        padding: 10px 8px 10px 2px;
      }
    }
  }
}
</style>
