<script setup>
import {ref} from 'vue';
import {useAuthStore} from  '../stores/auth';
import { useRouter } from 'vue-router';

import FormInput from '@/components/FormInput.vue';
import FormButton from '@/components/FormButton.vue';
import ErrorBlock from '@/components/ErrorBlock.vue';

const authStore = useAuthStore();

const email = ref();
const password = ref();
const router = useRouter();

const signin = async () => {
    await authStore.auth({email: email.value, password: password.value}, 'signin')
    router.push('/MainMap');
}
</script>

<template>
    <div class="screen">
        <h2>Log <span class="second-color">In</span></h2>
        <form class="sign" >
            <div class="in">
                <label for="#email">Enter your <span class="second-color">email</span></label>
                <FormInput type="email" v-model="email" placeholder="e-mail"/>
            </div>
            <div class="in">
                <label for="#password">Enter your <span class="second-color">password</span></label>
                <FormInput type="password" v-model="password" placeholder="password"/>
            </div>
            <FormButton @click="signin" type="button" text="Sign up!"/>
            <transition name="fade-error">
                <ErrorBlock v-if="authStore.error" :error="authStore.error"/>
            </transition>
    </form>
    <p>if you are not registered yet <RouterLink to="/sign" class="link">Reg in</RouterLink></p>
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