import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const apiKey = import.meta.env.VITE_API_KEY_FIREBASE

export const useAuthStore = defineStore('auth', () => {

  const userInfo = ref({
    token: '',
    email: '',
    userId: '',
    refreshToken: '',
    expiresIn: '',
  })

  const error = ref('')

  const auth = async (payload, type) => {
    const stringUrl = type === 'signup' ? 'signUp' : 'signInWithPassword' 
    error.value = '';
    try{
      let response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:${stringUrl}?key=${apiKey}`, {
        ...payload,
        returnSecureToken: true
      });
      console.log(response.date)
      userInfo.value = {
        token: response.data.idToken,
        email: response.data.email,
        userId: response.data.localId,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn,
      }
      console.log(response.data)
    }
    catch(err) {
      switch (err.response.data.error.message){
        case 'EMAIL_EXISTS':
          error.value = 'Email exists';
          break;
        case 'OPERATION_NOT_ALLOWED':
          error.value = 'Operation not allowed';
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          error.value = 'Too many attempts try later';
          break;
        case 'EMAIL_NOT_FOUND':
          error.value = 'Your e-mail is not registred';
          break;
        case 'INVALID_PASSWORD':
          error.value = 'Your password doesnt agree';
          break;
        case 'USER_DISABLED':
            error.value = 'БАН, иди нахуй отсюда';
            break;
        default:
          error.value = 'Error';
          break;
      }
      throw error.value;
    }
  }
  return { auth, userInfo, error}
})
