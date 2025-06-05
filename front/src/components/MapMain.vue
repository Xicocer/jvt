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
  center: [43.4548, 56.2421], // [долгота, широта] - Нижний Новгород
  zoom: 13
})

const loadMarkers = async () => {
  try {
    const response = await axios.get('/markers')
    console.log('Получены маркеры:', response.data)
    
    markers.value = response.data.map(marker => {
      // Преобразуем координаты в числа, учитывая разные варианты названий полей
      const longitude = Number(marker.longitude || marker.longitube || 0)
      const latitude = Number(marker.latitude || marker.latitube || 0)
      
      // Проверяем валидность координат
      if (isNaN(longitude) || isNaN(latitude)) {
        console.warn('Некорректные координаты маркера:', marker.id, marker)
        return null
      }
      
      return {
        ...marker,
        longitude,
        latitude
      }
    }).filter(marker => marker !== null) // Фильтруем некорректные маркеры
    
    console.log('Обработанные маркеры:', markers.value)
    
    // Если есть маркеры, центрируем карту на первом из них
    if (markers.value.length > 0) {
      location.value.center = [markers.value[0].longitude, markers.value[0].latitude]
    }
  } catch (error) {
    console.error('Ошибка загрузки маркеров:', error)
  }
}

onMounted(loadMarkers)
</script>

<template>
  <div class="map">
    <YMap :location="location">
      <YMapDefaultSchemeLayer />
      <YMapDefaultFeaturesLayer />
      
      <!-- Маркеры на карте -->
      <YMapMarker
        v-for="marker in markers"
        :key="marker.id"
        :coordinates="[marker.longitude, marker.latitude]"
      >
        <div class="custom-marker">
          <v-icon color="red" size="36">mdi-map-marker</v-icon>
          <div class="marker-label">{{ marker.name }}</div>
        </div>
      </YMapMarker>
    </YMap>
  </div>
</template>

<style scoped>
.map {
  width: 100%;
  height: 70vh; /* Увеличил высоту для лучшего отображения */
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.custom-marker {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.marker-label {
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  margin-top: -8px;
}
</style>