<script setup>
import {ref} from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import {useAuthStore} from  '../stores/auth';

import FormInput from '@/components/FormInput.vue';
import FormButton from '@/components/FormButton.vue';
import ErrorBlock from '@/components/ErrorBlock.vue';

const router = useRouter();
const authStore = useAuthStore();

const firstName = ref('')
const lastName = ref('')
const patronymic = ref('')
const email = ref('')
const password = ref('')
const img = ref(null)


const signup = async () => {
    const userData = {
        first_name:firstName.value,
        last_name:lastName.value,
        patronymic:patronymic.value || null,
        email:email.value,
        password:password.value,
        img:img.value || null,
    };

    console.log(firstName.value);

    const success = await authStore.register(userData)

    if (success) {
      router.push('/MainMap')
    }

}
</script>

<template>
    <div class="screen" @submit.prevent="signup">
        <h2>Регистрация</h2>
        <form class="sign">
  <div class="in">
    <label>Ваше имя</label>
    <FormInput v-model="firstName" placeholder="Имя"/>
  </div>
  <div class="in">
    <label>Ваша фамилия</label>
    <FormInput v-model="lastName" placeholder="Фамилия"/>
  </div>
  <div class="in">
    <label>Отчество <span class="second-color">(если есть)</span></label>
    <FormInput v-model="patronymic" placeholder="Отчество"/>
  </div>
  <div class="in">
    <label>Email</label>
    <FormInput type="email" v-model="email" placeholder="e-mail"/>
  </div>
  <div class="in">
    <label>Придумайте пароль</label>
    <FormInput type="password" v-model="password" placeholder="Пароль"/>
  </div>
  
  <FormButton @click="signup" type="submit" text="Sign up!"/>

  <transition name="fade-error">
    <ErrorBlock v-if="error" :error="error" />
  </transition>
</form>
<p>Уже зарегестрированны? <RouterLink to="/signin" class="link">Войдите</RouterLink></p>
    </div>
</template>

<style lang="scss" scoped>
.screen{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.sign{
    display: flex;
    flex-direction: column;
    width: 30%;
    justify-content: center;

}
.in{
    display: flex;
    flex-direction: column;
    margin-top: 1em;
}

.fade-error-enter-active,
.fade-error-leave-active {
  transition: all 0.5s ease;
}

.fade-error-enter-from,
.fade-error-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-error-enter-to,
.fade-error-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>