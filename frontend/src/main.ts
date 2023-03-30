import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from '@/plugins/vuetify'
import '@mdi/font/css/materialdesignicons.css'
import '@/assets/sass/font.scss'

createApp(App).use(router).use(vuetify).mount('#app')
