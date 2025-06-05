<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Список маркеров
        <v-spacer />
        <v-btn icon @click="fetchMarkers">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="markers"
        :items-per-page="limit"
        :page.sync="page"
        :loading="loading"
        class="elevation-1"
        :server-items-length="total"
      >
        <template #item.img="{ item }">
          <v-img
            v-if="item.img"
            :src="item.img"
            max-width="100"
            max-height="60"
            contain
          />
          <span v-else>—</span>
        </template>

        <template #item.coordinates="{ item }">
          {{ formatCoordinate(item.latitube) }}, {{ formatCoordinate(item.longitube) }}
        </template>

        <template #item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>

        <template #item.actions="{ item }">
          <v-btn
            size="small"
            color="red"
            icon
            @click="deleteMarker(item.id)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from '@/lib/axios'

const markers = ref([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const loading = ref(false)

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Название', key: 'name' },
  { title: 'Тип', key: 'type' },
  { title: 'Адрес', key: 'address' },
  { title: 'Координаты', key: 'coordinates' },
  { title: 'Изображение', key: 'img' },
  { title: 'Дата создания', key: 'created_at' },
  { title: 'Действия', key: 'actions', sortable: false },
]

// Безопасное форматирование координат
const formatCoordinate = (coord) => {
  if (coord === null || coord === undefined) return '—'
  const num = Number(coord)
  return isNaN(num) ? coord : num.toFixed(6)
}

const formatDate = (date) => {
  return date ? new Date(date).toLocaleString() : '—'
}

const fetchMarkers = async () => {
  try {
    loading.value = true
    const { data } = await axios.get(`/markers?page=${page.value}&limit=${limit.value}`)
    markers.value = data.data.map(marker => ({
      ...marker,
      // Преобразуем координаты в числа, если они строки
      latitube: typeof marker.latitube === 'string' ? parseFloat(marker.latitube) : marker.latitube,
      longitube: typeof marker.longitube === 'string' ? parseFloat(marker.longitube) : marker.longitube
    }))
    total.value = data.total
  } catch (err) {
    console.error('Ошибка загрузки маркеров:', err)
  } finally {
    loading.value = false
  }
}

const deleteMarker = async (id) => {
  if (!confirm('Удалить этот маркер?')) return
  
  try {
    await axios.delete(`/markers/${id}`)
    await fetchMarkers()
  } catch (error) {
    console.error('Ошибка при удалении:', error)
  }
}

watch([page, limit], fetchMarkers)
onMounted(fetchMarkers)
</script>