/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
}

export default createVuetify({
  theme: {
    defaultTheme: 'myTheme',
    themes: {
      dark: true,
      colors: {
        primary: '#16d384;'
      }
    }
  }
})
