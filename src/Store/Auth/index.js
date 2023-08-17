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

const DEFAULT_USER = {
	uid: null,
	email: null,
	username: null,
};

const authModule = {
	namespaced: true,
	state() {
		return {
			user: DEFAULT_USER,
			auth: false,
		};
	},
	mutations: {
		setUser(state, payload) {
			state.auth = true;
			state.user = {
				...state.user,
				...payload,
			};
		},
		clearUser(state) {
			state.user = DEFAULT_USER;
			state.auth = false;
		},
	},
	getters: {
		isAuth(state) {
			return state.auth;
		},
		getUserData(state) {
			return state.user;
		},
		getUserId(state) {
			return state.user.uid;
		},
	},
	actions: {
		// NEW USER
		async signup({ commit }, payload) {
			try {
				commit('notify/setLoading', true, { root: true });

				const userCredential = await createUserWithEmailAndPassword(
					auth,
					payload.email,
					payload.password
				);

				const newUser = {
					...DEFAULT_USER,
					uid: userCredential.user.uid,
					email: userCredential.user.email,
					username: payload.username,
				};

				await setDoc(doc(db, users, userCredential.user.uid), newUser);

				commit('setUser', payload);

				msgSuccess(commit, `Welcome ${payload.username} `);
				router.push('/');
			} catch (error) {
				msgError(commit, errorCodes(error.code));
			} finally {
				commit('notify/setLoading', false, { root: true });
			}
		},

		// AUTO SIGN IN
		async autosign({ commit, dispatch }, payload) {
			try {
				const userData = await dispatch('getUserProfile', payload.uid);
				commit('setUser', userData);
				return true;
			} catch (error) {
				console.log('Not auto');
			}
		},
		async getUserProfile({ commit }, payload) {
			try {
				const docSnap = await getDoc(doc(db, 'users', payload));

				if (docSnap.exists()) {
					return docSnap.data();
				} else {
					return null;
				}
			} catch (error) {
				console.log('Not auto');
			}
		},

		// EXISTING USER
		async signin({ commit, dispatch }, payload) {
			try {
				commit('notify/setLoading', true, { root: true });
				const userCredentials = await signInWithEmailAndPassword(
					auth,
					payload.email,
					payload.password
				);

				const userData = await dispatch(
					'getUserProfile',
					userCredentials.user.uid
				); // I need this function 'getUserProfile' because i want all user information not only id,email and password.

				commit('setUser', userData);
				msgSuccess(commit, `Welcome back ${userData.username} `);

				router.push('/');
			} catch (error) {
				msgError(commit, errorCodes(error.code));
			} finally {
				commit('notify/setLoading', false, { root: true });
			}
		},

		async signOut({ commit }) {
			try {
				await auth.signOut();

				msgError(commit, 'Bye');

				commit('clearUser');

				router.push('/');
			} catch (error) {
				msgError(commit);
			}
		},
	},
};

export default authModule;
