<template>
  <v-card class="pa-4">
    <v-card-title>Управление породами</v-card-title>

    <v-card-text>
      <!-- Добавление породы -->
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
        Добавить породу
      </v-btn>

      <v-divider class="my-6" />

      <!-- Удаление породы -->
      <v-select
        v-model="selectedAnimalForDelete"
        :items="animals"
        item-title="name"
        item-value="id"
        label="Выберите животное для удаления породы"
        density="compact"
        variant="outlined"
        @update:modelValue="fetchBreeds"
        clearable
      />

      <v-select
        v-model="selectedBreedId"
        :items="breeds"
        item-title="name"
        item-value="id"
        label="Выберите породу"
        :disabled="!selectedAnimalForDelete || breeds.length === 0"
        class="mt-4"
        clearable
        density="compact"
        variant="outlined"
      />

      <v-btn
        class="mt-4"
        color="error"
        :disabled="!selectedBreedId"
        @click="deleteBreed"
        block
      >
        Удалить породу
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/lib/axios'

const animals = ref([])
const isLoading = ref(false)

const selectedAnimal = ref(null)
const breedName = ref('')

const selectedAnimalForDelete = ref(null)
const breeds = ref([])
const selectedBreedId = ref(null)

const fetchAnimals = async () => {
  isLoading.value = true
  try {
    const { data } = await axios.get('/animals', { withCredentials: true })
    animals.value = data
  } catch (e) {
    console.error('Ошибка получения видов животных:', e)
  } finally {
    isLoading.value = false
  }
}

const fetchBreeds = async (animalId) => {
  if (!animalId) {
    breeds.value = []
    return
  }

  try {
    const response = await axios.get(`/breed/${animalId}`, {
      withCredentials: true,
    })
    breeds.value = response.data
    selectedBreedId.value = null
  } catch (error) {
    console.error('Ошибка загрузки пород:', error)
    breeds.value = []
  }
}

const submitBreed = async () => {
  if (!selectedAnimal.value || !breedName.value) return

  try {
    await axios.post(
      '/breed',
      {
        petId: selectedAnimal.value.id,
        name: breedName.value,
      },
      { withCredentials: true }
    )

    breedName.value = ''
    selectedAnimal.value = null
    await fetchAnimals()
    alert('Порода успешно добавлена!')
  } catch (e) {
    console.error('Ошибка добавления породы:', e)
    alert('Ошибка добавления породы')
  }
}

const deleteBreed = async () => {
  if (!selectedBreedId.value) return

  try {
    await axios.delete(`/breed/${selectedBreedId.value}`, {
      withCredentials: true,
    })
    breeds.value = breeds.value.filter(b => b.id !== selectedBreedId.value)
    selectedBreedId.value = null
    alert('Порода успешно удалена!')
  } catch (e) {
    console.error('Ошибка удаления породы:', e)
    alert('Не удалось удалить породу')
  }
}

onMounted(fetchAnimals)
</script>