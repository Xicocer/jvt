import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, 
})

// api.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true

//       try {
//         await api.post('/refresh')
//         return api(originalRequest)
//       } catch (refreshError) {
//         if (
//           refreshError.response?.status === 403 ||
//           refreshError.response?.status === 401
//         ) {
//           console.warn('Refresh токен недействителен. Выполняем выход...')

//           try {
//             await api.post('/logout') // refresh берётся из куки
//           } catch (logoutError) {
//             console.error('Ошибка при logout', logoutError)
//           }

//           router.push('/login')
//         }
//       }
//     }

//     return Promise.reject(error)
//   }
// )

export default api