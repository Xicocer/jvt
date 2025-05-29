<template>
  <v-container fluid>
    <v-card>
      <v-card-title>

        <v-spacer />
        <v-btn icon @click="fetchTickets">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="tickets"
        :items-per-page="limit"
        :page.sync="page"
        :loading="loading"
        class="elevation-1"
        :server-items-length="total"
        :footer-props="{
          'items-per-page-options': [5, 10, 20],
          'items-per-page-text': 'Элементов на странице',
        }"
      >
        <template #item.user="{ item }">
          <div>
            <strong>{{ item.user?.last_name || '—' }} {{ item.user?.first_name || '' }}</strong>
            <div class="text-grey">{{ item.user?.email }}</div>
          </div>
        </template>

        <template #item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>

        <template #item.actions="{ item }">
          <v-btn size="small" color="red" icon @click="deleteTicket(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from '@/lib/axios'

const tickets = ref([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const loading = ref(false)

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Пользователь', key: 'user' },
  { title: 'Тип', key: 'type' },
  { title: 'Сообщение', key: 'message' },
  { title: 'Дата', key: 'created_at' },
  { title: 'Действия', key: 'actions', sortable: false },
]

const fetchTickets = async () => {
  try {
    loading.value = true
    const { data } = await axios.get(`/supportList?page=${page.value}&limit=${limit.value}`)
    tickets.value = data.data
    total.value = data.total
  } catch (err) {
    console.error('Ошибка загрузки тикетов:', err)
  } finally {
    loading.value = false
  }
}

const deleteTicket = async (id) => {
  if (!confirm('Удалить обращение?')) return
  await axios.delete(`/support/${id}`)
  await fetchTickets()
}

const formatDate = (date) => new Date(date).toLocaleString()

watch([page, limit], fetchTickets)
onMounted(fetchTickets)
</script>