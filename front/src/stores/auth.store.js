import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
    state:() => ({
        user: null,
        error: null,
        isLoading: false
    }),

    actions: {
        async register(userData) {
            this.isLoading = true
            this.error = null

            try {
                const response = await axios.post('http://localhost:5000/api/register', {
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    patronymic: userData.patronymic,
                    email: userData.email,
                    password: userData.password
                }, { withCredentials: true })

                console.log('Успешная регистрация: ', response.data)
                useRouter().push('/login')
                return { succsess: true }
            }catch(error){
                this.error = error.response?.data?.message || 'Ошибка регистрации'
                return { succsess: false, error: this.error }
            }finally{
                this.isLoading = false
            }
        }
    }
})