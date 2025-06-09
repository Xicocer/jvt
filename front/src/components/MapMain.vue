<script setup>
import { ref, onMounted, computed } from 'vue'
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
const selectedMarker = ref(null)
const dialog = ref(false)
const loading = ref(true)
const filter = ref('all')

const getMarkerImg = (path) => `http://localhost:5000${path}`

const fetchMarkers = async () => {
  try {
    loading.value = true
    const response = await axios.get('/marker')
    markers.value = response.data.map(marker => {
      const lng = Number(marker.longitude ?? marker.longitube)
      const lat = Number(marker.latitude ?? marker.latitube)

      if (isNaN(lng) || isNaN(lat)) {
        console.warn('Invalid coordinates:', marker.id)
        return null
      }

      return {
        ...marker,
        longitude: lng,
        latitude: lat
      }
    }).filter(Boolean)

    if (markers.value.length > 0) {
      location.value.center = [markers.value[0].longitude, markers.value[0].latitude]
    }
  } catch (error) {
    console.error('Error loading markers:', error)
  } finally {
    loading.value = false
  }
}

const handleMarkerClick = (marker) => {
  selectedMarker.value = marker
  dialog.value = true
}

const filteredMarkers = computed(() => {
  if (filter.value === 'all') return markers.value
  return markers.value.filter(m => m.type === filter.value)
})

onMounted(fetchMarkers)
</script>

<template>
  <div class="map-ui-wrapper">
    <!-- Заголовок и инструкции -->
    <div class="map-header" color="dark">
      <h2>📍 Карта мест для прогулок</h2>
      <p>Нажмите на значок на карте, чтобы узнать больше.</p>
    </div>

    <!-- Карта -->
    <YMap :location="location" class="map">
      <YMapDefaultSchemeLayer />
      <YMapDefaultFeaturesLayer />

      <YMapMarker
        v-for="(marker, index) in filteredMarkers"
        :key="marker.id"
        :coordinates="[marker.longitude, marker.latitude]"
        @click="handleMarkerClick(marker)"
      >
        <div
          class="custom-marker"
          :class="{ pulse: index === 0 }"
        >
          <v-icon color="deep-purple accent-4" size="36">mdi-paw</v-icon>
        </div>
      </YMapMarker>
    </YMap>

    <!-- Спиннер загрузки -->
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>

    <!-- Модалка с информацией -->
    <v-dialog v-model="dialog" max-width="500" scrollable>
      <v-card v-if="selectedMarker">
        <v-card-title class="headline">
          {{ selectedMarker.name }}
          <v-spacer />
        </v-card-title>

        <v-card-text>
          <div class="marker-info">
            <div class="info-row">
              <v-icon>mdi-tag</v-icon>
              <span>Тип: {{ selectedMarker.type }}</span>
            </div>
            <div class="info-row">
              <v-icon>mdi-map-marker</v-icon>
              <span>Адрес: {{ selectedMarker.address || 'не указан' }}</span>
            </div>
            <div class="info-row">
              <v-icon>mdi-crosshairs-gps</v-icon>
              <span>
                {{ selectedMarker.latitude.toFixed(6) }},
                {{ selectedMarker.longitude.toFixed(6) }}
              </span>
            </div>
            <v-img
              v-if="selectedMarker.img"
              :src="getMarkerImg(selectedMarker.img)"
              alt="Фото места"
              max-height="250"
              contain
            />
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="dialog = false">
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.map-ui-wrapper {
  position: relative;
  height: 100vh;
}

.map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.map-header {
  position: absolute;
  top: 3vh;
  left: 5vw;
  background: rgba(39, 39, 39, 0.95);
  padding: 16px;
  border-radius: 8px;
  z-index: 10;
  max-width: 320px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.filter-select {
  margin-top: 12px;
}

.custom-marker {
  cursor: pointer;
  transition: transform 0.2s;
}
.custom-marker:hover {
  transform: scale(1.1);
}

.marker-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 10vw;
}

.info-row .v-icon {
  color: #757575;
}
</style>
