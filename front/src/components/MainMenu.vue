<template>
  <!-- Боковая панель на десктопах -->
  <v-navigation-drawer
    v-if="!isMobile"
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

  <!-- Нижняя панель на мобильных устройствах -->
  <v-bottom-navigation
    v-else
    grow
    app
    class="bg-grey-darken-4 text-white"
  >
    <v-btn
      v-for="item in menuItems"
      :key="item.to"
      :to="item.to"
      :active="isActive(item.to)"
      active-class="bg-primary"
      class="d-flex flex-column"
    >
      <v-icon>{{ item.icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const route = useRoute()
const isActive = (path) => route.path === path

const menuItems = [
  { to: '/', icon: 'mdi-map' },
  { to: '/messenger', icon: 'mdi-message-text-outline' },
  { to: '/profile', icon: 'mdi-account-circle' },
]

// следим за шириной экрана
const isMobile = ref(window.innerWidth < 768)

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.v-list-item {
  height: 64px;
}
</style>
