/* eslint-disable */
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, users } from '../../Firebase/';
import errorCodes from '../../Tools/fbCodes.js';
import { msgError, msgSuccess } from '../../Tools/vuex.js';
import router from '../../routes.js';

// Default user object to initialize the user state
const DEFAULT_USER = {
	uid: null,
	email: null,
	username: null,
};

const authModule = {
	namespaced: true,
	state() {
		return {
			user: DEFAULT_USER,  // Initial state of the user
			auth: false,  // Authentication status (false = not logged in)
		};
	},
	mutations: {
		// Set user data to the state when logged in
		setUser(state, payload) {
			state.auth = true;  // Set authentication status to true
			state.user = {
				...state.user,  // Spread the current user object
				...payload,  // Overwrite with the new user data
			};
		},
		// Clear user data when logged out
		clearUser(state) {
			state.user = DEFAULT_USER;  // Reset user object to default
			state.auth = false;  // Set authentication status to false
		},
	},
	getters: {
		// Return authentication status
		isAuth(state) {
			return state.auth;
		},
		// Return the current user data
		getUserData(state) {
			return state.user;
		},
		// Return the current user's UID
		getUserId(state) {
			return state.user.uid;
		},
	},
	actions: {
		// Sign up a new user
		async signup({ commit }, payload) {
			try {
				commit('notify/setLoading', true, { root: true });  // Show loading state

				// Create a new user with email and password
				const userCredential = await createUserWithEmailAndPassword(
					auth,
					payload.email,
					payload.password
				);

				// Create a user object with the necessary information
				const newUser = {
					...DEFAULT_USER,
					uid: userCredential.user.uid,
					email: userCredential.user.email,
					username: payload.username,
				};

				// Save the new user to Firestore
				await setDoc(doc(db, users, userCredential.user.uid), newUser);

				// Commit the user data to the state
				commit('setUser', payload);

				// Show success message
				msgSuccess(commit, `Welcome ${payload.username} `);

				// Redirect the user to the home page
				router.push('/');
			} catch (error) {
				// Show error message if signup fails
				msgError(commit, errorCodes(error.code));
			} finally {
				// Hide loading state
				commit('notify/setLoading', false, { root: true });
			}
		},

		// Auto sign in user (after page reload or refresh)
		async autosign({ commit, dispatch }, payload) {
			try {
				// Fetch user profile data by UID
				const userData = await dispatch('getUserProfile', payload.uid);
				// Commit the user data to the state
				commit('setUser', userData);
				return true;
			} catch (error) {
				console.log('Not auto');
			}
		},

		// Get the user's profile data from Firestore
		async getUserProfile({ commit }, payload) {
			try {
				// Get the document from Firestore using the user's UID
				const docSnap = await getDoc(doc(db, 'users', payload));

				// If the document exists, return the user data
				if (docSnap.exists()) {
					return docSnap.data();
				} else {
					// Return null if no user profile is found
					return null;
				}
			} catch (error) {
				console.log('Not auto');
			}
		},

		// Sign in an existing user
		async signin({ commit, dispatch }, payload) {
			try {
				commit('notify/setLoading', true, { root: true });  // Show loading state

				// Sign in with email and password
				const userCredentials = await signInWithEmailAndPassword(
					auth,
					payload.email,
					payload.password
				);

				// Fetch user profile data by UID
				const userData = await dispatch(
					'getUserProfile',
					userCredentials.user.uid
				);

				// Commit the user data to the state
				commit('setUser', userData);

				// Show success message
				msgSuccess(commit, `Welcome back ${userData.username} `);

				// Redirect the user to the home page
				router.push('/');
			} catch (error) {
				// Show error message if signin fails
				msgError(commit, errorCodes(error.code));
			} finally {
				// Hide loading state
				commit('notify/setLoading', false, { root: true });
			}
		},

		// Sign out the user
		async signOut({ commit }) {
			try {
				// Sign out from Firebase
				await auth.signOut();

				// Show success message for sign out
				msgError(commit, 'Bye');

				// Clear the user data from the state
				commit('clearUser');

				// Redirect the user to the home page
				router.push('/');
			} catch (error) {
				// Show error message if sign out fails
				msgError(commit);
			}
		},
	},
};

export default authModule;
