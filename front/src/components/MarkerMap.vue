<script setup>
import { ref } from 'vue'
import axios from '@/lib/axios'

const form = ref({
  name: '',
  type: '',
  address: '',
  latitude: '',
  longitude: '',
  image: null
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const types = ref(['Ветклиника', 'Зоомагазин', 'Гостиница', 'Площадка'])
const submitting = ref(false)

const handleFileUpload = (event) => {
  form.value.image = event.target.files[0]
}

const submitForm = async () => {
  submitting.value = true
  
  try {
    // Валидация
    if (!form.value.name || !form.value.type) {
      throw new Error('Заполните название и тип метки')
    }

    const lat = parseFloat(form.value.latitude)
    const lng = parseFloat(form.value.longitude)

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Координаты должны быть числами')
    }

    // Создаем FormData
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('type', form.value.type)
    formData.append('address', form.value.address)
    formData.append('latitube', lat)
    formData.append('longitube', lng)
    if (form.value.image) {
      formData.append('image', form.value.image)
    }

    // Отправка данных
    const response = await axios.post('/markers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    snackbar.value = {
      show: true,
      message: 'Метка успешно добавлена!',
      color: 'success'
    }
    resetForm()
  } catch (error) {
    snackbar.value = {
      show: true,
      message: error.response?.data?.message || error.message || 'Ошибка сохранения',
      color: 'error'
    }
    console.error('Ошибка:', error)
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    type: '',
    address: '',
    latitude: '',
    longitude: '',
    image: null
  }
}
</script>

<template>
  <v-container>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>

    <v-card max-width="600" class="mx-auto">
      <v-card-title>Добавить метку с изображением</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-text-field
            v-model="form.name"
            label="Название места *"
            :rules="[v => !!v || 'Обязательное поле']"
            required
            outlined
          ></v-text-field>

          <v-select
            v-model="form.type"
            :items="types"
            label="Тип метки *"
            :rules="[v => !!v || 'Выберите тип']"
            required
            outlined
          ></v-select>

          <v-text-field
            v-model="form.address"
            label="Адрес"
            outlined
          ></v-text-field>

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="form.latitude"
                label="Широта *"
                :rules="[
                  v => !!v || 'Обязательное поле',
                  v => !isNaN(Number(v)) || 'Должно быть числом'
                ]"
                required
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="form.longitude"
                label="Долгота *"
                :rules="[
                  v => !!v || 'Обязательное поле',
                  v => !isNaN(Number(v)) || 'Должно быть числом'
                ]"
                required
                outlined
              ></v-text-field>
            </v-col>
          </v-row>

          <v-file-input
            label="Изображение метки"
            prepend-icon="mdi-camera"
            accept="image/*"
            @change="handleFileUpload"
          ></v-file-input>

          <v-btn
            type="submit"
            color="primary"
            :loading="submitting"
            block
            class="mt-4"
          >
            Добавить метку
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>