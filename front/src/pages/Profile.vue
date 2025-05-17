<template>
  <v-container>
    <v-card v-if="user">
      <v-card-title>Профиль пользователя</v-card-title>
      <v-card-text class="d-flex justify-space-between">
        <v-avatar size="200" v-if="user.img">
          <img :src="getAvatarUrl(user.img)" alt="Аватар">
        </v-avatar>
        <div>
            <p><strong>Имя:</strong> {{ user.first_name }} {{ user.last_name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
        </div>
        <h3>Питомцы:</h3>
        <v-list>
          <v-list-item v-for="pet in user.user_pets" :key="pet.id">
            <v-list-item-content>
              <v-list-item-title>{{ pet.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ pet.breed?.name }} - {{ pet.age }} лет</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="logout">Выйти</v-btn>
      </v-card-actions>
    </v-card>
    <v-progress-circular v-else indeterminate color="primary"></v-progress-circular>
  </v-container>
  
</template>

<script>
import axios from '@/lib/axios' // твой axios-инстанс

export default {
  data() {
    return {
      user: null,
    }
  },
  async mounted() {
    try {
      const res = await axios.get('/profile')
      this.user = res.data
    } catch (err) {
      console.error('Ошибка загрузки профиля', err)
      // можно сделать редирект на логин если 401
      if (err.response && err.response.status === 401) {
        this.$router.push('/login')
      }
    }
  },
  methods: {
      getAvatarUrl(path) {
        return `http://localhost:5000${path}`;
        },
    async logout() {
      try {
        await axios.post('/logout')
        this.$router.push('/login')
      } catch (err) {
        console.error('Ошибка выхода', err)
      }
    }
  },

}
</script>