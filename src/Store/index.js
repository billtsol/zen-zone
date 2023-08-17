import { createStore } from 'vuex';
import authModule from './Auth';
import sudokuModule from './Games/sudoku.js';
import notificationsModule from './Notifications';

const store = createStore({
	strict: true,
	modules: {
		auth: authModule,
		notify: notificationsModule,
		sudoku: sudokuModule,
	},
});

export default store;
