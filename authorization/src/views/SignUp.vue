<script setup>
import {ref} from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import {useAuthStore} from  '../stores/auth';

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
            <div class="error" v-if="authStore.error">{{ authStore.error }}</div>
            <div class="in">
                <label for="#email">Set <span class="second-color">email</span></label>
                <input type="email" v-model="email" class="form-input">
            </div>
            <div class="in">
                <label for="#password">Set <span class="second-color">password</span></label>
                <input type="password" v-model="password" class="form-input">
            </div>
        <button class="btn second-bg-color body-color" @click="signup" type="button">SignUp</button>
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

.btn{
    outline: none;
    border: none;
    margin: 1%;
    padding: 0.4em;
    border-radius: 1rem;
}
.form-input{
    width: 50%;
    padding: 0.6em;
    border-radius: 1rem;
    border: 3px solid #71d316;
}
.screen{
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.sign{
    display: flex;
    flex-direction: column;
    width: 30%;

}
.in{
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>