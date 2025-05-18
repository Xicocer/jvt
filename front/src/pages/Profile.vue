<template>
  <v-container>
    <v-card v-if="user">
      <v-card-title>Профиль пользователя</v-card-title>
      <v-card-text class="d-flex justify-space-between">
        <v-avatar size="200" v-if="user.img">
          <img :src="getAvatarUrl(user.img)" alt="Аватар">
        </v-avatar>
        <div>
            <p><strong>Имя:</strong> {{ user.first_name }} {{ user.last_name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
        </div>
        <h3>Питомцы:</h3>
        <v-list>
          <v-list-item v-for="pet in user.user_pets" :key="pet.id">
            <v-list-item-content>
              <v-list-item-title>{{ pet.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ pet.breed?.name }} - {{ pet.age }} {{ getAgeWord(pet.age) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
            <v-form ref="formRef" @submit.prevent="changeProfile">
              <v-text-field v-model="firstName" label="Имя" />
              <v-text-field v-model="lastName" label="Фамилия" />
              <v-text-field v-model="patronymic" label="Отчество" />
              <v-btn color="primary" type="submit" class="mt-4" block>
                Изменить профиль
              </v-btn>
            </v-form>  
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="logout">Выйти</v-btn>
      </v-card-actions>
    </v-card>
    <v-progress-circular v-else indeterminate color="primary"></v-progress-circular>
  </v-container>

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
import { useRouter } from 'vue-router'
import axios from '@/lib/axios'

// Состояния
const user = ref(null)
const firstName = ref('')
const lastName = ref('')
const patronymic = ref('')

// Маршрутизатор
const router = useRouter()

// Получение URL аватара
const getAvatarUrl = (path) => `http://localhost:5000${path}`

// Загрузка данных пользователя
const fetchProfile = async () => {
  try {
    const res = await axios.get('/profile')
    user.value = res.data

    firstName.value = res.data.first_name
    lastName.value = res.data.last_name
    patronymic.value = res.data.patronymic
  } catch (err) {
    console.error('Ошибка загрузки профиля', err)
    if (err.response && err.response.status === 401) {
      router.push('/login')
    }
  }
}

// Обновление профиля
const changeProfile = async () => {
  try {
    await axios.patch('/profile', {
      first_name: firstName.value,
      last_name: lastName.value,
      patronymic: patronymic.value
    })
    await fetchProfile() // обновляем данные после изменения
  } catch (err) {
    console.error('Ошибка обновления профиля', err)
  }
}

// Выход
const logout = async () => {
  try {
    await axios.post('/logout')
    router.push('/login')
  } catch (err) {
    console.error('Ошибка выхода', err)
  }
}

const getAgeWord = (age) => {
  const lastDigit = age % 10;
  const lastTwoDigits = age % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'лет';
  if (lastDigit === 1) return 'год';
  if (lastDigit >= 2 && lastDigit <= 4) return 'года';
  return 'лет';
};  

// При монтировании компонента — загрузка профиля
onMounted(() => {
  fetchProfile()
})

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