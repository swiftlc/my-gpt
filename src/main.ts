import { createApp } from 'vue'
import '@unocss/reset/normalize.css'
import 'virtual:uno.css'
import 'virtual:svg-icons-register';
import './styles/css/global.css';

import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import App from './App.vue'

console.log(process.env.NODE_ENV)

createApp(App).use(autoAnimatePlugin).mount('#app')
