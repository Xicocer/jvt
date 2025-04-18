<script setup>
import {ref} from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import {useAuthStore} from  '../stores/auth';

import FormInput from '@/components/FormInput.vue';
import FormButton from '@/components/FormButton.vue';
import ErrorBlock from '@/components/ErrorBlock.vue';

const authStore = useAuthStore();

const email = ref();
const password = ref();
const router = useRouter();

const signup = async () => {
    await authStore.auth({email: email.value, password: password.value}, 'signup') 
    router.push('/MainMap');
}
</script>

<template>
    <div>
        
    </div>
    <div class="screen">
        <h2>Регистрация</h2>
        <form class="sign" >
            <div class="in">
                <label for="#email">Ваше имя</label>
                <FormInput type="email" v-model="email" placeholder="Полное имя"/>
            </div>
            <div class="in">
                <label for="#email">Ваша фамилия</label>
                <FormInput type="email" v-model="email" placeholder="Фамилия"/>
            </div>
            <div class="in">
                <label for="#email">Отчество <span class="second-color">(необязательно)</span></label>
                <FormInput type="email" v-model="email" placeholder="Отчество (необязательно)"/>
            </div>
            <div class="in">
                <label for="#email">Set <span class="second-color">email</span></label>
                <FormInput type="email" v-model="email" placeholder="e-mail"/>
            </div>
            <div class="in">
                <label for="#email">Set <span class="second-color">email</span></label>
                <FormInput type="file" v-model="email" placeholder="e-mail"/>
            </div>
            <div class="in">
                <label for="#password">Set <span class="second-color">password</span></label>
                <FormInput type="password" v-model="password" placeholder="password"/>
            </div>
        <FormButton @click="signup" type="button" text="Sign up!"/>
        <transition name="fade-error">
            <ErrorBlock v-if="authStore.error" :error="authStore.error"/>
        </transition>
    </form>
    <p>If you are already registred <RouterLink to="/signin" class="link">Log in</RouterLink></p>
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