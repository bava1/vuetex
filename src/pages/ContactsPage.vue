<template>
  <div class="contacts">
    <div class="contacts-title q-mb-md text-h5">Contacts</div>
    <q-input
      class="contacts-input text-white q-mb-md"
      input-class="text-white"
      outlined
      v-model="search"
      label="Search for contact"
      label-color="green-12">
      <template v-if="search.length > 0" v-slot:append>
        <q-icon name="close" color="green-12" @click="search = ''" class="cursor-pointer" />
      </template>
    </q-input>

    <q-scroll-area class="contacts-area">
      <contactItem :contactList="filteredContacts"></contactItem>
    </q-scroll-area>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { contactsList } from 'src/stores/contactsList.js'
import contactItem from 'src/components/Items/contactItem.vue'

const search = ref('');

const filteredContacts = computed(() => {
  const query = search.value.toLowerCase().trim();
  return query
    ? contactsList.filter((contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.surname.toLowerCase().includes(query)
      )
    : contactsList;
});

const getImageUrl = (name) => {
  return new URL(`../assets/Contacts/${name}`, import.meta.url).href
};

</script>

<style lang="scss" scoped>
.contacts {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 950px;
  margin-top: -85px;
  padding-bottom: 30px;
  background-image: url("../assets/img/Tasks-3.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  text-align: center;
  background-color:  rgb(1, 16, 5);

  &-title {
    padding-top: 80px;
    color: #2add7e;
    font-weight: 800;
    letter-spacing: .2rem;
    text-shadow: 2px 2px 2px rgb(66, 193, 178);
  }

  &-input {
    width: 450px;
    border:1px dashed #0a3b21;
    border-radius: 6px;
    margin-left: -6px ;
  }

  &-area {
    height: 630px;
    min-width: 455px;
  }

}

@media screen and (max-width: 768px) {

  .contacts-area {
    height: 550px;
  }

}

@media screen and (max-width: 570px) {
  .contacts-area {
    min-width: 320px;
    height: 400px;
    margin-left: 12px;
  }
  .contacts-input {
    width: 300px;
  }
}
</style>
