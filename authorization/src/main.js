import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { initializeApp } from "firebase/app";
import App from './App.vue'
import router from './router'

const firebaseConfig = {
  apiKey: "AIzaSyDJLCKe85Heu1pRukdtCr1dtiOSkFN7EiE",
  authDomain: "jwt-token-try.firebaseapp.com",
  projectId: "jwt-token-try",
  storageBucket: "jwt-token-try.firebasestorage.app",
  messagingSenderId: "627807838784",
  appId: "1:627807838784:web:f32ef901b7803b4fd675a5"
};

initializeApp(firebaseConfig);

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
