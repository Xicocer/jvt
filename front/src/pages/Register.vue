<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="text-h4 font-weight-regular text-center">Регистрация</v-card-title>
          <v-card-text>
            <v-form ref="formRef" @submit.prevent="register">
              <v-text-field v-model="firstName" label="Имя" />
              <v-text-field v-model="lastName" label="Фамилия" />
              <v-text-field v-model="patronymic" label="Отчество (если есть)" />
              <v-text-field
                v-model="email"
                label="Email"
                :rules="[rules.required, rules.email]"
              />
              <v-text-field
                v-model="password"
                label="Пароль"
                type="password"
                :rules="[rules.required, rules.min]"
              />
              <v-text-field
                v-model="passwordConfirmation"
                label="Повторите пароль"
                type="password"
                :rules="[rules.required, matchPassword]"
              />
              <v-alert
                v-if="error"
                type="error"
                class="mt-2"
                dense
                text
              >
                {{ error }}
              </v-alert>
              <v-btn color="primary" type="submit" class="mt-4" variant="tonal" block>
                Зарегистрироваться
              </v-btn>
              <p class="text-center pt-3"><span class="font-weight-light">Есть аккаунт? </span><RouterLink to="/login" >Войди!</RouterLink></p>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import router from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import { RouterLink } from 'vue-router'

// refs
const firstName = ref('')
const lastName = ref('')
const patronymic = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const error = ref(null)
const formRef = ref(null)

const rules = {
  required: v => !!v || 'Обязательное поле',
  min: v => (v && v.length >= 8) || 'Минимум 8 символов',
  email: v => /.+@.+\..+/.test(v) || 'Введите корректный email',
}
const matchPassword = v =>
  v === password.value || 'Пароли не совпадают'

const auth = useAuthStore()

const register = async () => {
  error.value = null
  const { valid } = await formRef.value.validate()
  if (!valid) return

 await auth.register({
    firstName: firstName.value,
    lastName: lastName.value,
    patronymic: patronymic.value,
    email: email.value,
    password: password.value
  }) 

   router.push('/login')
}
</script>

<style scoped>
.v-card {
  padding: 16px;
}
</style>