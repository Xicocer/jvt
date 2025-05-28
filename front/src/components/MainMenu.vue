<template>
  <v-navigation-drawer
    app
    permanent
    rail
    width="72"
    class="bg-grey-darken-4 text-white"
  >
    <v-list nav dense>
      <v-list-item
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        :active="isActive(item.to)"
        active-class="bg-primary"
        class="justify-center"
      >
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  { to: '/', icon: 'mdi-map' },
  { to: '/messenger', icon: 'mdi-message-text-outline' },
  { to: '/profile', icon: 'mdi-account-circle' },
]

const isActive = (path) => {
  return route.path === path
}
</script>

<style scoped>
.v-list-item {
  height: 64px;
}
</style>