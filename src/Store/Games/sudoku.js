import { msgError } from '../../Tools/vuex.js';

const sudokuModule = {
	namespaced: true,
	state() {
		return {
			sudoku: '',
		};
	},
	mutations: {
		setSudoku(state, payload) {
			state.sudoku = {
				...payload,
			};
		},
		setNumberOnSudoku(state, payload) {
			state.sudoku.value[payload.row][payload.col] = payload.number;
		},
	},
	getters: {
		getSudokuData(state) {
			return state.sudoku;
		},
	},
	actions: {
		setNumber({ commit }, payload) {
			commit('setNumberOnSudoku', payload);
		},
		async generateSudoku({ commit }, payload) {
			try {
				commit('notify/setLoading', true, { root: true });

				const response = await fetch(
					'https://sudoku-api.vercel.app/api/dosuku'
				);
				const res = await response.json();

				const myData = {
					value: res.newboard.grids[0].value,
					solution: res.newboard.grids[0].solution,
					difficulty: res.newboard.grids[0].difficulty,
				};
				commit('setSudoku', myData);
			} catch (error) {
				msgError(commit, errorCodes(error.code));
			} finally {
				commit('notify/setLoading', false, { root: true });
			}
		},
	},
};

export default sudokuModule;
