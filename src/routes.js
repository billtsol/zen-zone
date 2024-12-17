// Import Firebase authentication and routing libraries
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { START_LOCATION, createRouter, createWebHistory } from 'vue-router';
import store from './Store/index.js';  // Vuex store import
import Sudoku from './components/Games/sudoku.vue';  // Sudoku game component
import Home from './components/Home.vue';  // Home component
import Login from './components/User/Login.vue';  // Login component

// Define route configurations
const routes = [
	{ path: '/', component: Home, name: 'home' },  // Home route
	{ path: '/login', component: Login, name: 'login' },  // Login route
	{ path: '/sudoku', component: Sudoku, name: 'sudoku' },  // Sudoku game route
];

// Create a new Vue Router instance
const router = createRouter({
	history: createWebHistory(),  // Use browser's history mode
	routes, // Define the routes
});

// Firebase authentication instance
const auth = getAuth();

// Function to validate the user status before navigation
const validateCheck = (to, from, next) => {
	// Continue to the next route after checking user status
	next();
	store.commit('notify/setLoading', false);  // Stop loading spinner
};

// Global navigation guard for route protection
router.beforeEach((to, from, next) => {
	// If navigating from the initial location
	if (from === START_LOCATION) {
		// Check the authentication state using Firebase
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				// If user is authenticated, dispatch action to load user data
				store.dispatch('auth/autosign', user).then(() => {
					// Proceed with the navigation after user data is loaded
					validateCheck(to, from, next);
				});
			} else {
				// If user is not authenticated, proceed without loading user data
				validateCheck(to, from, next);
			}
		});
		// Unsubscribe after the check to avoid memory leaks
		unsubscribe();
	} else {
		// If the navigation is not from the initial location, just proceed
		validateCheck(to, from, next);
	}

	// If navigating to the Sudoku route, trigger Sudoku game generation
	if (to.name == 'sudoku') {
		store.dispatch('sudoku/generateSudoku', {}).then(() => {});
	}
});

// Export the configured router
export default router;
