import App from './App.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

// 创建Vue应用实例
const app = createApp(App);

// 创建并使用Pinia状态管理
const pinia = createPinia();
app.use(pinia);

// 挂载应用
app.mount('#app');
