import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { START_LOCATION, createRouter, createWebHistory } from 'vue-router';
import store from './Store/index.js';
import Sudoku from './components/Games/sudoku.vue';
import Home from './components/Home.vue';
import Login from './components/User/Login.vue';

const routes = [
	{ path: '/', component: Home, name: 'home' },
	{ path: '/login', component: Login, name: 'login' },
	{ path: '/sudoku', component: Sudoku, name: 'sudoku' },
];

const router = createRouter({
	history: createWebHistory(),
	routes, // short for `routes: routes`
});

const auth = getAuth();
const validateCheck = (to, from, next) => {
	next();
	store.commit('notify/setLoading', false);
};

router.beforeEach((to, from, next) => {
	if (from === START_LOCATION) {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				store.dispatch('auth/autosign', user).then(() => {
					validateCheck(to, from, next);
				});
			} else {
				validateCheck(to, from, next);
			}
		});

		unsubscribe();
	} else {
		validateCheck(to, from, next);
	}
	if (to.name == 'sudoku') {
		store.dispatch('sudoku/generateSudoku', {}).then(() => {});
	}
});

export default router;
