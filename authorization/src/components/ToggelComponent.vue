<script setup>
import MarkerDescription from './MarkerDescription.vue'

import { ref } from 'vue'

const mode = ref('info') 

function toggleMode() {
  mode.value = mode.value === 'info' ? 'settings' : 'info'
}
</script>

<template>
    <button class="flag-button" @click="toggleMode">
      переключить
    </button>
  <div class="toggle-container">
    <div class="content-block">
      <template v-if="mode === 'info'">
        <MarkerDescription/>
      </template>
      <template v-else>
        <h3>Настройки</h3>
        <p>Здесь можно изменить параметры профиля или поведения.</p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.toggle-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 1rem;
  padding: 1em;
  width: 35vw;
  height: 80vh;
  background-color: #5f5f5f;
}

.flag-button {
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  margin-bottom: 0.5em;
}

.content-block {
  transition: all 0.3s ease;
}
</style>