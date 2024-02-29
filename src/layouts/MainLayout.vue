<template>
  <q-layout view="hHh lpR fFf" class="layout">
    <q-header reveal class="bg-transparent text-white">
      <q-toolbar>
        <q-toolbar-title>
          <router-link to="/">
            <img class="header-logo" alt="Quasar logo" src="~assets/img/Logo-3.png">
          </router-link>
        </q-toolbar-title>

        <q-btn
          flat
          color="green-12"
          size="lg"
          icon="menu"
          class="header-btn"
          @click="toggleLeftDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      side="right"
      behavior="mobile"
    >
      <q-list>
        <q-item-label header color="green-9" class="text-h5">Menu</q-item-label>
        <q-item v-for="link in linksList" :key="link.text" clickable class="drawer-item">
          <sideNavItem :link="link.link" :icon="link.icon" :text="link.text"></sideNavItem>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
      <q-page-sticky v-if="$q.screen.gt.sm" expand position="left" class="layout-aside q-pt-xl">
        <leftAsideItem :linksList="linksList"></leftAsideItem>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import sideNavItem from 'src/components/Navigations/sideNavItem.vue'
import leftAsideItem from 'src/components/Navigations/leftAsideItem.vue'

const leftDrawerOpen = ref(false)
const linksList = [
  { text: 'Home', icon: 'house_siding', link: '/' },
  { text: 'Features', icon: 'webhook', link: '/articles' },
  { text: 'Tasks', icon: 'tune', link: '/tasks' },
  { text: 'About', icon: 'fitbit', link: '/about' },
  { text: 'Contacts', icon: 'attractions', link: '/contacts' }
]

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

</script>

<style lang="scss">
.layout {
  background-color:  rgb(1, 11, 3);
}
.header-logo {
  width: 200px;
  margin-left: 2%;
}
.header-btn {
  display: none;
}

.q-drawer {
  width: 250px !important;
  opacity: .8;
  background-color: rgb(224, 255, 245);
}
/* RESPONSIVE */
@media screen and (max-width: 1024px) {

  .header-btn {
    display: block;
    padding-top: 1%;
  }

  .layout-aside {
    display: none;
  }
  .header-logo {
    width: 130px;
    margin-left: 2%;
    padding-top: 2%;
  }
}

@media screen and (max-width: 768px) {

  .header-btn {
    padding-top: 3%;
    margin-right: -10px;
  }

  .header-logo {
    width: 100px;
    margin-left: 2%;
    padding-top: 2%;
  }
}
</style>
