import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: ()=>({
        user:null,
        error:null,
    }),

    actions:{
        async register (formData){
            try {
                const res = await axios.post("http://localhost:5000/api/register", formData, {
                    withCredentials: true
                })
                this.user = res.data.user || null
                this.error = null
            }catch (err){
                this.error = err.response?.data?.message || "Ошибка регистрации"
            }
        },
    },

    getters: {
        isAuthenticated: (state) => !!state.user,
    }
})
