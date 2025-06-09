<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title>Самая популярная порода</v-card-title>
          <v-card-text>
            <div v-if="popularBreed && popularBreed.breed">
              <strong>{{ popularBreed.breed }}</strong> <br />
              Используется у {{ popularBreed.count }} питомцев
            </div>
            <div v-else>
              Нет данных
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <v-card-title>Самый популярный маркер</v-card-title>
          <v-card-text>
            <div v-if="popularMarker && popularMarker.marker">
              <strong>{{ popularMarker.marker.name }}</strong><br />
              Адрес: {{ popularMarker.marker.address }} <br />
              Клики: {{ popularMarker.count }}
            </div>
            <div v-else>
              Нет данных
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/lib/axios'

const popularBreed = ref(null)
const popularMarker = ref(null)

onMounted(async () => {
  try {
    const { data: breedData } = await axios.get('/mostPopularBreed')
    popularBreed.value = breedData
  } catch (err) {
    console.error('Ошибка при загрузке самой популярной породы:', err)
    popularBreed.value = null
  }

  try {
    const { data: markerData } = await axios.get('/mostPopularMarker')
    popularMarker.value = markerData
  } catch (err) {
    console.error('Ошибка при загрузке самого популярного маркера:', err)
    popularMarker.value = null
  }
})
</script>