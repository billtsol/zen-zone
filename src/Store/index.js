import { createStore } from 'vuex';
import authModule from './Auth';
import notificationsModule from './Notifications';

const store = createStore({
	strict: true,
	modules: {
		auth: authModule,
		notify: notificationsModule,
	},
});

export default store;
