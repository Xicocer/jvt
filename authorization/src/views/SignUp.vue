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
    <div class="screen">
        <h2>Sign <span class="second-color">Up</span></h2>
        <form class="sign" >
            
            <div class="in">
                <label for="#email">Set <span class="second-color">email</span></label>
                <FormInput type="email" v-model="email" placeholder="e-mail"/>
            </div>
            <div class="in">
                <label for="#password">Set <span class="second-color">password</span></label>
                <FormInput type="password" v-model="password" placeholder="password"/>
            </div>
        <FormButton @click="signup" type="button" text="Sign in"/>
        <ErrorBlock v-if="authStore.error" :error="authStore.error"/>
    </form>
    <p>If you are already registred <RouterLink to="/signin" class="link">Log in</RouterLink></p>
    </div>
</template>

<style lang="scss" scoped>
.error{
    border: 3px solid #d38116;
    padding: 1%;
    border-radius: 1rem;
}

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
</style>