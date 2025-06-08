<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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
  name: '',
  type: false,
  description: ''
})

const joinedChats = ref(new Set()) // id чатов, в которых пользователь уже есть

const selectedChatId = ref(null)
const selectedChat = computed(() => chats.value.find(c => c.id === selectedChatId.value) || null)

// Получение списка чатов с пагинацией и фильтром
const fetchChats = async (reset = false) => {
  if (loading.value) return

  loading.value = true
  try {
    if (reset) {
      page.value = 1
      chats.value = []
      hasMore.value = true
    }

    const response = await axios.get('/chats/all', {
      params: {
        page: page.value,
        search: searchQuery.value
      }
    })

    if (response.data.length === 0) {
      hasMore.value = false
    } else {
      if (reset) {
        chats.value = response.data
      } else {
        chats.value = [...chats.value, ...response.data]
      }
      page.value++
    }
  } catch (error) {
    console.error('Ошибка загрузки чатов:', error)
  } finally {
    loading.value = false
  }
}

// Получить список чатов, в которых пользователь состоит (для показа кнопок)
const fetchUserChats = async () => {
  try {
    const res = await axios.get('/user/chats') // должен возвращать массив chat_id, например
    joinedChats.value = new Set(res.data.map(c => c.id))
  } catch (error) {
    console.error('Ошибка загрузки пользовательских чатов', error)
  }
}

// Вступить в чат
const joinChat = async (chatId) => {
  try {
    await axios.post(`/chats/${chatId}/join`)
    joinedChats.value.add(chatId)
  } catch (error) {
    console.error('Ошибка при вступлении в чат:', error)
  }
}

// Выйти из чата
const leaveChat = async (chatId) => {
  try {
    await axios.post(`/chats/${chatId}/leave`)
    joinedChats.value.delete(chatId)
    // Если сейчас этот чат выбран — снимаем выделение
    if (selectedChatId.value === chatId) selectedChatId.value = null
  } catch (error) {
    console.error('Ошибка при выходе из чата:', error)
  }
}

// Создать новый чат
const createChat = async () => {
  try {
    const response = await axios.post('/chats', newChat.value)
    chats.value.unshift(response.data)
    showCreateDialog.value = false
    newChat.value = { name: '', type: false, description: '' }
  } catch (error) {
    console.error('Ошибка создания чата:', error)
  }
}

// Обработчик скролла для ленивой загрузки
const handleScroll = () => {
  if (
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300 &&
    hasMore.value &&
    !loading.value
  ) {
    fetchChats()
  }
}

// Поиск с debounce
let searchTimeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchChats(true)
  }, 500)
})

onMounted(() => {
  fetchChats()
  fetchUserChats()
  window.addEventListener('scroll', handleScroll)
})

// Выбор чата
const selectChat = (chatId) => {
  selectedChatId.value = chatId
}
</script>

<template>
  <MainMenu />

  <v-container class="pa-4" max-width="900">
    <v-row justify="space-between" align="center">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchQuery"
          label="Поиск чатов"
          clearable
          prepend-inner-icon="mdi-magnify"
          outlined
          dense
        />
      </v-col>

      <v-col cols="12" md="3" class="text-right">
        <v-btn color="primary" @click="showCreateDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Создать чат
        </v-btn>
      </v-col>
    </v-row>

    <v-list two-line>
      <v-list-item
        v-for="chat in chats"
        :key="chat.id"
        @click="selectChat(chat.id)"
        class="chat-item"
        :class="{ 'selected-chat': chat.id === selectedChatId }"
      >
        <v-list-item-avatar color="primary" class="white--text">
          {{ chat.name.charAt(0).toUpperCase() }}
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ chat.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ chat.description }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-chip small v-if="chat.created_by_id === authStore.user?.id" color="success" class="mr-2" label>
            Ваш чат
          </v-chip>

          <v-btn
            v-if="joinedChats.has(chat.id)"
            small
            color="error"
            @click.stop.prevent="leaveChat(chat.id)"
          >
            Выйти
          </v-btn>

          <v-btn
            v-else
            small
            color="primary"
            @click.stop.prevent="joinChat(chat.id)"
          >
            Вступить
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-row justify="center" v-if="loading">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <div v-if="!loading && chats.length === 0" class="text-center grey--text mt-6">
      Чаты не найдены.
    </div>

    <!-- Подробности выбранного чата -->
    <div v-if="selectedChat" class="selected-chat-details pa-4 mt-6" style="border: 1px solid #ddd; border-radius: 8px;">
      <h3>{{ selectedChat.name }}</h3>
      <p>{{ selectedChat.description }}</p>
      <!-- Здесь можно добавить сообщения и другую информацию -->
    </div>

    <!-- Диалог создания чата -->
    <v-dialog v-model="showCreateDialog" max-width="500">
      <v-card>
        <v-card-title>Создать новый чат</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="createChat">
            <v-text-field
              v-model="newChat.name"
              label="Название чата"
              required
              :rules="[v => !!v || 'Обязательное поле']"
              autofocus
            />

            <v-textarea
              v-model="newChat.description"
              label="Описание"
              rows="3"
              auto-grow
            />
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="showCreateDialog = false">Отмена</v-btn>
              <v-btn color="primary" type="submit">Создать</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.chat-item {
  cursor: pointer;
}

.chat-item:hover {
  background-color: #f5f5f5;
}

.selected-chat {
  background-color: #d0ebff;
}
</style>
