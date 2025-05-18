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
              <v-list-item-subtitle>{{ pet.breed?.name }} - {{ pet.age }} лет</v-list-item-subtitle>
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

// При монтировании компонента — загрузка профиля
onMounted(() => {
  fetchProfile()
})
</script>