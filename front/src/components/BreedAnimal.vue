<template>
  <v-container сlass="d-flex">
    <v-card class="pa-4" max-width="500">
      <v-card-title>Добавить вид животного</v-card-title>

      <v-form @submit.prevent="addType">
        <v-text-field
          v-model="newType"
          label="Название животного"
          :disabled="loading"
          required
        />
        <v-btn type="submit" color="primary" :loading="loading">Добавить</v-btn>
      </v-form>

      <v-divider class="my-4" />

      <v-card-subtitle>Список видов животных</v-card-subtitle>
      <v-list style="max-height: 300px; overflow-y: auto">
        <v-list-item
          v-for="type in petTypes"
          :key="type.id"
          class="d-flex justify-space-between"
        >
          <span>{{ type.name }}</span>
          <v-btn icon @click="deleteType(type.id)" size="small">
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/lib/axios'

const newType = ref('')
const petTypes = ref([])
const loading = ref(false)

const fetchTypes = async () => {
  try {
    const { data } = await axios.get('http://localhost:5000/api/animals', { withCredentials: true }) // путь на getAllAnimalsWithBreed
    petTypes.value = data
  } catch (e) {
    console.error('Ошибка загрузки видов', e)
  }
}

const addType = async () => {
  if (!newType.value.trim()) return
  loading.value = true
  try {
    await axios.post('http://localhost:5000/api/addAnimal', { name: newType.value }, { withCredentials: true }) // путь на addAnimal
    newType.value = ''
    await fetchTypes()
  } catch (e) {
    console.error('Ошибка добавления', e)
  } finally {
    loading.value = false
  }
}

const deleteType = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/animals/${id}`, { withCredentials: true }) // путь на deleteAnimal
    await fetchTypes()
  } catch (e) {
    console.error('Ошибка удаления', e)
  }
}

onMounted(fetchTypes)
</script>