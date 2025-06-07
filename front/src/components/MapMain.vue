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
const selectedMarker = ref(null)
const dialog = ref(false)

const getMarkerImg = (path) => `http://localhost:5000${path}`

const fetchMarkers = async () => {
  try {
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
  }
}

const handleMarkerClick = (marker) => {
  selectedMarker.value = marker
  dialog.value = true
}

onMounted(fetchMarkers)
</script>

<template>
  <div class="map-container">
    <YMap :location="location" class="map">
      <YMapDefaultSchemeLayer />
      <YMapDefaultFeaturesLayer />
      
      <YMapMarker
        v-for="marker in markers"
        :key="marker.id"
        :coordinates="[marker.longitude, marker.latitude]"
        @click="handleMarkerClick(marker)"
      >
        <div class="custom-marker">
          <v-icon color="deep-purple accent-4" size="36">mdi-paw</v-icon>
        </div>
      </YMapMarker>
    </YMap>

    <!-- Модальное окно с информацией о маркере -->
    <v-dialog v-model="dialog" max-width="500">
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
              <span>Координаты: {{ selectedMarker.latitude.toFixed(6) }}, {{ selectedMarker.longitude.toFixed(6) }}</span>
            </div>
            
            <v-img
              v-if="selectedMarker.img"
              :src="getMarkerImg(selectedMarker.img)"
              alt="Аватар"
            ></v-img>
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
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.map {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
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
  gap: 8px;
}

.info-row .v-icon {
  color: #757575;
}
</style>