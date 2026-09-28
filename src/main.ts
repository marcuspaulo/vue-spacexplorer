import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from '@/App.vue';
import { queryClient } from '@/lib/query-client';
import '@/assets/main.css';

createApp(App).use(VueQueryPlugin, { queryClient }).mount('#app');
