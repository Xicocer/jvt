<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/lib/axios'
import { useAuthStore } from '@/stores/auth.store'
import MainMenu from '@/components/MainMenu.vue'

const authStore = useAuthStore()
const chats = ref([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const searchQuery = ref('')
const showCreateDialog = ref(false)
const newChat = ref({
  title: '',
  description: ''
})

// Получение чатов с пагинацией
const fetchChats = async (reset = false) => {
  if (loading.value) return
  
  loading.value = true
  try {
    if (reset) {
      page.value = 1
      chats.value = []
      hasMore.value = true
    }

    const response = await axios.get('/chats', {
      params: {
        page: page.value,
        search: searchQuery.value
      }
    })

    if (response.data.length === 0) {
      hasMore.value = false
    } else {
      chats.value = [...chats.value, ...response.data]
      page.value += 1
    }
  } catch (error) {
    console.error('Ошибка загрузки чатов:', error)
  } finally {
    loading.value = false
  }
}

// Создание нового чата
const createChat = async () => {
  try {
    const response = await axios.post('/chats', newChat.value)
    chats.value.unshift(response.data)
    showCreateDialog.value = false
    newChat.value = { title: '', description: '' }
  } catch (error) {
    console.error('Ошибка создания чата:', error)
  }
}

// Обработчик скролла
const handleScroll = () => {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 500
  if (nearBottom && hasMore.value && !loading.value) {
    fetchChats()
  }
}

// Поиск с debounce
let searchTimeout
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchChats(true)
  }, 500)
}

// Фильтрация чатов (если нужно на клиенте)
const filteredChats = computed(() => {
  return chats.value.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    chat.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

onMounted(() => {
  fetchChats()
  window.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <MainMenu/>
  <div class="chat-list-container w-100">
    <v-toolbar dark>
      <v-toolbar-title>Чаты</v-toolbar-title>
      <v-spacer />
      
      <v-text-field
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="Поиск чатов..."
        solo
        flat
        dense
        hide-details
        prepend-inner-icon="mdi-magnify"
        class="search-field"
      />
      
      <v-btn icon @click="showCreateDialog = true">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>

    <div class="chat-list">
      <template v-if="filteredChats.length > 0">
        <v-list>
          <v-list-item
            v-for="chat in filteredChats"
            :key="chat.id"
            :to="`/chats/${chat.id}`"
            class="chat-item"
          >
            <template #prepend>
              <v-avatar color="primary">
                {{ chat.title.charAt(0) }}
              </v-avatar>
            </template>
            
            <v-list-item-title>{{ chat.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ chat.description }}</v-list-item-subtitle>
            
            <template #append>
              <v-chip small v-if="chat.creator_id === authStore.user?.id">
                Ваш чат
              </v-chip>
              <span class="members-count">
                {{ chat.members_count }} участников
              </span>
            </template>
          </v-list-item>
        </v-list>
        
        <div v-if="loading" class="loading-indicator">
          <v-progress-circular indeterminate />
        </div>
      </template>
      
      <div v-else class="empty-state">
        <v-icon size="64">mdi-forum</v-icon>
        <p>Чатов не найдено</p>
        <v-btn @click="showCreateDialog = true" color="primary">
          Создать первый чат
        </v-btn>
      </div>
    </div>

    <!-- Диалог создания чата -->
    <v-dialog v-model="showCreateDialog" max-width="500">
      <v-card>
        <v-card-title>Создать новый чат</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="createChat">
            <v-text-field
              v-model="newChat.title"
              label="Название чата"
              required
              :rules="[v => !!v || 'Обязательное поле']"
            />
            
            <v-textarea
              v-model="newChat.description"
              label="Описание"
              rows="3"
            />
            
            <v-card-actions>
              <v-spacer />
              <v-btn @click="showCreateDialog = false">Отмена</v-btn>
              <v-btn type="submit" color="primary">Создать</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.chat-list-container {
  margin-left: 3vw;
  max-width: 96vw;
}

.search-field {
  max-width: 300px;
  margin-right: 16px;
}

.chat-list {
  margin-top: 16px;
}

.chat-item {
  margin-bottom: 8px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.chat-item:hover {
  background-color: #f5f5f5;
}

.members-count {
  font-size: 0.8rem;
  color: #757575;
  margin-left: 8px;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #757575;
}

.empty-state p {
  margin: 16px 0;
}
</style>