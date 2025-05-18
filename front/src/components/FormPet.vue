<template>
 <v-container>
    <v-card>
      <v-card-title>Добавить питомца</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-text-field
            v-model="petName"
            label="Имя питомца"
            required
          />

          <v-text-field
            v-model="petAge"
            type="number"
            label="Возраст"
            required
          />

          <v-radio-group
            v-model="petGender"
            label="Пол питомца"
            required
          >
            <v-radio
              label="Мальчик"
              :value="true"
            ></v-radio>
            <v-radio
              label="Девочка"
              :value="false"
            ></v-radio>
          </v-radio-group>

          <v-select
            v-model="selectedAnimalId"
            :items="animalOptions"
            item-title="name"
            item-value="id"
            label="Тип животного"
            required
            @update:modelValue="handleAnimalChange"
          />

          <v-select
            v-model="selectedBreedId"
            :items="breedOptions"
            item-title="name"
            item-value="id"
            label="Порода"
            required
            :disabled="!selectedAnimalId"
          />

          <v-btn type="submit" color="primary">Сохранить</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/lib/axios'

const petName = ref('')
const petAge = ref('')
const petGender = ref(null) // true - мальчик, false - девочка
const selectedAnimalId = ref(null)
const selectedBreedId = ref(null)
const animals = ref([])
const breeds = ref([])

const animalOptions = computed(() => animals.value)
const breedOptions = computed(() => breeds.value)

const fetchBreeds = async (animalId) => {
  if (!animalId) {
    breeds.value = []
    return
  }
  
  try {
    const response = await axios.get(`/breed/${animalId}`, { withCredentials: true })
    breeds.value = response.data
    selectedBreedId.value = null
  } catch (error) {
    console.error('Ошибка загрузки пород:', error)
    breeds.value = []
  }
}

const fetchAnimals = async () => {
  try {
    const response = await axios.get('/animals', { withCredentials: true })
    animals.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки животных:', error)
  }
}

const handleAnimalChange = (animalId) => {
  selectedBreedId.value = null
  fetchBreeds(animalId)
}

const submitForm = async () => {
  try {
    const payload = {
      name: petName.value,
      age: parseInt(petAge.value),
      gender: petGender.value, // Добавляем пол в отправляемые данные
      breedId: selectedBreedId.value
    }

    await axios.post('/addPet', payload, { withCredentials: true })
    alert('Питомец успешно добавлен!')
    // Очистить форму
    petName.value = ''
    petAge.value = ''
    petGender.value = null
    selectedAnimalId.value = null
    selectedBreedId.value = null
    breeds.value = []
  } catch (error) {
    console.error('Ошибка при добавлении питомца:', error)
    alert('Ошибка при добавлении питомца')
  }
}

onMounted(fetchAnimals)
</script>

<style lang="scss" scoped>

</style>