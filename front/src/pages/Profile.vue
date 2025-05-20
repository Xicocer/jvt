<template>
  <v-container>
    <v-card v-if="user">
      <v-card-title>Профиль пользователя</v-card-title>
      <v-card-text class="d-flex justify-space-between">
        <div class="d-flex align-center mb-6">
          <v-avatar size="120" class="mr-6">
            <v-img
              v-if="user.img"
              :src="getAvatarUrl(user.img)"
              alt="Аватар"
            ></v-img>
            <v-icon v-else size="60">mdi-account</v-icon>
          </v-avatar>
        </div>
        <div>
            <p><strong>Имя:</strong> {{ user.first_name }} {{ user.last_name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
        </div>
        <div>
        <h3>Питомцы:</h3>
        <v-list>
          <v-list-item v-for="pet in user.user_pets" :key="pet.id">
            <div class="d-flex">
              <v-list-item-content>
              <v-list-item-title>{{ pet.name }}</v-list-item-title>
              <v-list-item-subtitle>Пол: {{ genderPet(pet.gender) }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ pet.breed?.name }} - {{ pet.age }} {{ getAgeWord(pet.age) }}</v-list-item-subtitle>
            </v-list-item-content>
              <v-dialog v-model="editDialog" max-width="400">
              <v-card>
                <v-card-title>Изменить возраст</v-card-title>
                <v-card-text>
                  <v-text-field
                    v-model.number="editingPet.age"
                    type="number"
                    label="Новый возраст"
                    min="0"
                    max="30"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="editDialog = false">Отмена</v-btn>
                  <v-btn 
                    color="primary" 
                    @click="updatePetAge(pet.id)"
                    :loading="updateLoading"
                  >
                    Сохранить
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
              <v-list-item-action>
                <v-btn 
                  icon 
                  size="x-small" 
                  @click="openEditDialog(pet)"
                  variant="outline"
                  color = "primary"
                  class="ml-2"
                >
                  <v-icon size="small">mdi-pencil-outline</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="error"
                  @click="confirmDelete(pet.id)"
                  size="small"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </div>
          </v-list-item>
        </v-list>
        </div>

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

  <form-pet/>
  
</template>

<script setup>
import FormPet from '@/components/FormPet.vue'

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

const confirmDelete = (petId) => {
  if (confirm('Вы уверены, что хотите удалить этого питомца?')) {
    deletePet(petId)
  }
}

const deletePet = async (petId) => {
  try {
    await axios.delete(`/delPet/${petId}`, { withCredentials: true })
    // Обновляем данные пользователя после удаления
    await fetchProfile()
    alert('Питомец успешно удален')
  } catch (error) {
    console.error('Ошибка при удалении питомца:', error)
    alert('Не удалось удалить питомца')
  }
}

const genderPet = (gender) => {
if (gender == 1){
  return 'Мужской'
}
else{
  return 'Женский'
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

//Логика для модального окна 

const editDialog = ref(false)
const updateLoading = ref(false)
const editingPet = ref({
  id: null,
  age: 0
})

const openEditDialog = (pet) => {
  editingPet.value = {
    id: pet.id,
    age: pet.age
  }
  editDialog.value = true
}

const updatePetAge = async (petId) => {
  if (!editingPet.value.age && editingPet.value.age !== 0) {
    alert('Введите корректный возраст')
    return
  }

  updateLoading.value = true
  try {
    await axios.patch(`/changePet/${petId}`, {
      age: editingPet.value.age
    }, { withCredentials: true })
    
    // Обновляем локальные данные
    const petIndex = user.value.user_pets.findIndex(p => p.id === editingPet.value.id)
    if (petIndex !== -1) {
      user.value.user_pets[petIndex].age = editingPet.value.age
    }
    
    editDialog.value = false
  } catch (error) {
    console.error('Ошибка обновления:', error)
    alert('Не удалось обновить возраст')
  } finally {
    updateLoading.value = false
  }
}

// При монтировании компонента — загрузка профиля
onMounted(() => {
  fetchProfile()
})
</script>