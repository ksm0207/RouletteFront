import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import './assets/css/header.scss';

createApp(App)
  .use(router)
  .use(ElementPlus)
  .mount('#app');
