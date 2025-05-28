<template>
  <v-card class="pa-4" max-width="400">
    <v-card-title>Добавить породу</v-card-title>

    <v-card-text>
      <v-select
        v-model="selectedAnimal"
        :items="animals"
        item-title="name"
        item-value="id"
        label="Выберите животное"
        return-object
        density="compact"
        variant="outlined"
        :loading="isLoading"
        :disabled="isLoading"
      />

      <v-text-field
        v-model="breedName"
        label="Название породы"
        variant="outlined"
        density="compact"
        class="mt-4"
        :disabled="!selectedAnimal"
      />

      <v-btn
        :disabled="!selectedAnimal || !breedName"
        color="primary"
        class="mt-4"
        block
        @click="submitBreed"
      >
        Добавить
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/lib/axios'

const animals = ref([])
const selectedAnimal = ref(null)
const breedName = ref('')
const isLoading = ref(false)

const fetchAnimals = async () => {
  isLoading.value = true
  try {
    const { data } = await axios.get('/animals') // предполагается, что у тебя уже есть этот эндпоинт
    animals.value = data
  } catch (e) {
    console.error('Ошибка получения видов животных:', e)
  } finally {
    isLoading.value = false
  }
}

const submitBreed = async () => {
  if (!selectedAnimal.value || !breedName.value) return

  try {
    await axios.post('/breed', {
      petId: selectedAnimal.value.id,
      name: breedName.value,
    }, { withCredentials: true })

    breedName.value = ''
    selectedAnimal.value = null
    await fetchAnimals() // обновить список, если нужно
    alert('Порода успешно добавлена!')
  } catch (e) {
    console.error('Ошибка добавления породы:', e)
    alert('Ошибка добавления породы')
  }
}

onMounted(fetchAnimals)
</script>