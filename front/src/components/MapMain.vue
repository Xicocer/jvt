<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/lib/axios'
import {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker
} from '@/lib/ymaps'

const markers = ref([])
const location = ref({
  center: [43.4548, 56.2421],
  zoom: 13
})

onMounted(async () => {
  try {
    const res = await axios.get('/marker')
    console.log('Полученные маркеры:', res.data) // Добавьте это для отладки
    
    markers.value = res.data.map(marker => ({
      ...marker,
      // Убедитесь, что координаты - числа
      longitude: Number(marker.longitude || marker.longitube),
      latitude: Number(marker.latitude || marker.latitube)
    }))
    
    console.log('Обработанные маркеры:', markers.value) // Проверка обработки
  } catch (e) {
    console.error('Ошибка загрузки маркеров:', e)
  }
})
</script>

<template>
  <div class="map">
    <YMap :location="location">
      <YMapDefaultSchemeLayer />
      <YMapDefaultFeaturesLayer />
      <YMapMarker
        v-for="marker in markers"
        :key="marker.id"
        :coordinates="[marker.longitude, marker.latitude]"
      >
        <v-icon color="deep-purple accent-4" size="36">mdi-paw</v-icon>
      </YMapMarker>
    </YMap>
  </div>
</template>

<style scoped>
.map {
  width: 100%;
  height: 50vh;
}
</style>