<template>

  
  <v-app style="overflow: hidden">
    <v-navigation-drawer
      v-model="drawer"
      permanent
      width="280"
      color="primary"
      dark
    >
      <v-list density="compact" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.id"
          :value="item.id"
          @click="scrollToSection(item.id)"
          :active="activeSection === item.id"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="main-content" ref="content" @scroll.passive="handleScroll">
      <v-container fluid class="pa-0 fill-height w-100">
        <v-row no-gutters class="fill-height">
          <v-col cols="12" class="fill-height">
            <v-sheet
              v-for="item in menuItems"
              :id="item.id"
              :key="item.id"
              class="section fill-height"
            >
              <v-container class="fill-height">
                <v-card class="fill-height w-100">
                  <v-card-title class="text-h5">
                    <v-icon :icon="item.icon" class="mr-2"></v-icon>
                    {{ item.title }}
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <component :is="item.component" />
                  </v-card-text>
                </v-card>
              </v-container>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BreedAnimal from '@/components/BreedAnimal.vue'
import ChatForm from '@/components/ChatForm.vue'
import MarkerMap from '@/components/MarkerMap.vue'
import SupportForm from '@/components/SupportForm.vue'
import BreedForm from '@/components/BreedForm.vue'
import MarkerTable from '@/components/MarkerTable.vue'
import AppStatistic from '@/components/AppStatistic.vue'


const menuItems = [
  { 
    id: 'animals', 
    title: 'Управление животными', 
    component: BreedAnimal,
    icon: 'mdi-paw'
  },
  { 
    id: 'breeds', 
    title: 'Управление породами', 
    component: BreedForm,
    icon: 'mdi-paw'
  },
  { 
    id: 'chats', 
    title: 'Создание чатов', 
    component: ChatForm,
    icon: 'mdi-message-text'
  },
  { 
    id: 'markers', 
    title: 'Добавление маркеров', 
    component: MarkerMap,
    icon: 'mdi-map-marker'
  },
  { 
    id: 'markersDel', 
    title: 'Удаление маркеров', 
    component: MarkerTable,
    icon: 'mdi-map-marker'
  },
  {
    id: 'support',
    title: 'Поддержка',
    component: SupportForm,
    icon: 'mdi-face-agent'
  },
  {
    id: 'analytics',
    title: 'Аналитика',
    component: AppStatistic,
    icon: 'mdi-chart-bar'
  }


]

const drawer = ref(true)
const content = ref(null)
const activeSection = ref('breeds')
const isProgrammaticScroll = ref(false)

const scrollToSection = (sectionId) => {
  isProgrammaticScroll.value = true
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
    activeSection.value = sectionId
    
    // Сбрасываем флаг после завершения анимации
    setTimeout(() => {
      isProgrammaticScroll.value = false
    }, 1000)
  }
}

const handleScroll = () => {
  if (!isProgrammaticScroll.value) {
    // Возвращаем к активному разделу если пользователь пытается прокрутить
    const element = document.getElementById(activeSection.value)
    if (element) {
      element.scrollIntoView({ behavior: 'auto' })
    }
  }
}

onMounted(() => {
  // Отключаем колесо прокрутки на всем документе
  document.addEventListener('wheel', preventScroll, { passive: false })
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && isProgrammaticScroll.value) {
        activeSection.value = entry.target.id
      }
    })
  }, { threshold: 0.5 })

  menuItems.forEach(item => {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  })
})

const preventScroll = (e) => {
  if (!isProgrammaticScroll.value) {
    e.preventDefault()
    e.stopPropagation()
    return false
  }
}
</script>

<style scoped>
.main-content {
  width: 100%;
  height: 100vh;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
}

.section {
  height: 100vh;
  scroll-snap-align: start;
}

.v-list-item--active {
  background-color: rgba(255, 255, 255, 0.15);
}

/* Отключаем скроллбар */
.main-content::-webkit-scrollbar {
  display: none;
}
.main-content {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>