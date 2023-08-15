import { createApp } from 'vue';
import App from './App.vue';
import './Firebase/index';
import store from './Store';
import './style.css';
import Toaster from '@meforma/vue-toaster';

// Routes
import router from './routes.js';

const app = createApp(App);
app.use(Toaster);
app.use(router);
app.use(store);

app.mount('#app');
