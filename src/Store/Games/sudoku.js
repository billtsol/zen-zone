import { msgError } from '../../Tools/vuex.js';

const sudokuModule = {
	namespaced: true,
	state() {
		return {
			unSolvedSudoku: '',
			solvedSudoku: '',
			difficulty: '',
			gameOverMessage: '',
			mistakes: 0,
			solved: false,
			currentNumber: 0,
			moreNumbers: [true, true, true, true, true, true, true, true, true],
		};
	},
	mutations: {
		setSudoku(state, payload) {
			state.unSolvedSudoku = payload.unSolvedSudoku;
			state.solvedSudoku = payload.solvedSudoku;
			state.difficulty = payload.difficulty;
		},
		setNumberOnSudoku(state, payload) {
			state.unSolvedSudoku[payload.row][payload.col] = payload.number;
		},
		increaseMistakes(state) {
			state.mistakes++;
		},
		setMistakes(state) {
			state.mistakes = 0;
		},
		setGameOverMessage(state, payload) {
			state.gameOverMessage = payload.text;
		},
		setSolved(state, payload) {
			state.solved = payload;
		},
		setCurrentNumber(state, payload) {
			state.currentNumber = payload.number;
		},
		setMoreNumbers(state, payload) {
			state.moreNumbers[payload.index] = payload.value;
		},
	},
	getters: {
		isSolved(state) {
			return state.solved;
		},
		getCurrentNumber(state) {
			return state.currentNumber;
		},
		getMoreNumbers(state) {
			return state.moreNumbers;
		},
		getGameOverMessage(state) {
			return state.gameOverMessage;
		},
		getSolvedSudoku(state) {
			return state.solvedSudoku;
		},
		getUnSolvedSudoku(state) {
			return state.unSolvedSudoku;
		},
		getMistakes(state) {
			return state.mistakes;
		},
		getDifficulty(state) {
			return state.difficulty;
		},
	},
	actions: {
		async generateSudoku({ commit }, payload) {
			try {
				commit('notify/setLoading', true, { root: true });

				const response = await fetch(
					'https://sudoku-api.vercel.app/api/dosuku'
				);
				const res = await response.json();

				const myData = {
					unSolvedSudoku: res.newboard.grids[0].value,
					solvedSudoku: res.newboard.grids[0].solution,
					difficulty: res.newboard.grids[0].difficulty,
				};

				commit('setSolved', false);
				commit('setMistakes');

				commit('setSudoku', myData);
			} catch (error) {
				msgError(commit, errorCodes(error.code));
			} finally {
				commit('notify/setLoading', false, { root: true });
			}
		},

		setNumberInBoard({ commit, dispatch, getters }, payload) {
			if (
				getters.getUnSolvedSudoku[payload.row][payload.col] == 0 &&
				getters.getCurrentNumber != 0
			) {
				if (
					getters.getCurrentNumber ==
					getters.getSolvedSudoku[payload.row][payload.col]
				) {
					commit('setNumberOnSudoku', {
						row: payload.row,
						col: payload.col,
						number: getters.getCurrentNumber,
					});

					dispatch('isNumberActive', getters.getCurrentNumber).then(
						(result) => {
							if (result == true) {
								commit('setMoreNumbers', {
									index: getters.getCurrentNumber - 1,
									value: false,
								});
								commit('setCurrentNumber', { number: 0 });
							}
						}
					);

					dispatch('checkSolved')
						.then((result) => {
							if (result == true) {
								commit('setGameOverMessage', { text: 'You won!' });
								commit('setCurrentNumber', { number: 0 });

								commit('setSolved', true);
							}
						})
						.catch((err) => {});
				} else {
					commit('increaseMistakes');
					if (getters.getMistakes == 3) {
						commit('setGameOverMessage', { text: 'Game Over!' });
						commit('setCurrentNumber', { number: 0 });

						commit('setSolved', true);
					}
				}
			}
		},

		isNumberActive({ getters }, payload) {
			let count = 0;
			for (let row = 0; row < 9; row++) {
				for (let col = 0; col < 9; col++) {
					if (getters.getUnSolvedSudoku[row][col] == payload) {
						count++;
						break;
					}
				}
			}
			return count == 9;
		},

		checkSolved({ getters }) {
			for (let row = 0; row < 9; row++) {
				for (let col = 0; col < 9; col++) {
					if (getters.getUnSolvedSudoku[row][col] == 0) {
						return false;
					}
				}
			}
			return true;
		},

		setNewCurrectNumber({ commit }, payload) {
			commit('setCurrentNumber', payload);
		},
	},
};

export default sudokuModule;
