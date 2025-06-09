<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="text-h4 font-weight-regular text-center">Вход</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field v-model="email" label="Email" type="email" required />
              <v-text-field v-model="password" label="Пароль" type="password" required />
              <v-alert type="error" v-if="errorMessage" class="mt-2">{{ errorMessage }}</v-alert>
              <v-card-actions class="mt-4">
                <v-btn color="primary" type="submit" variant="tonal" block>Войти</v-btn>
              </v-card-actions>
              <p class="text-center"><span class="font-weight-light">Нет аккаунта?</span> <RouterLink to="/register">Зарегестрируйся!</RouterLink></p>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

const auth = useAuthStore()

const login = async () => {
  errorMessage.value = ''

  await auth.login({
    email: email.value,
    password: password.value
  })
}
</script>