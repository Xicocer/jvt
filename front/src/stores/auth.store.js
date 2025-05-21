import { defineStore } from 'pinia'
import axios from '@/lib/axios'
import { useRouter } from 'vue-router'
import { fi } from 'vuetify/locale'

export const useAuthStore = defineStore('auth', {
    state:() => ({
        user: null,
        token: null,
        error: null,
        isLoading: false
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        currentUser: (state) => state.user,
        isAdmin: (state) => state.user?.role === true
    },

    actions: {
        async register(userData) {
            this.isLoading = true
            this.error = null

            try {
                const response = await axios.post('/register', {
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
        },

        async login(userData){
            this.isLoading = true
            this.erorr = null

            try{
                const response = await axios.post('/login',{
                    email: userData.email,
                    password: userData.password
                }, {withCredentials: true})

                console.log('Успешная вход: ', response.data)
                useRouter().push('/')
            }catch(erorr) {
                //
            }finally {
                this.isLoading = false
            }
        }
    }
})