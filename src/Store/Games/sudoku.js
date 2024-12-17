import { msgError } from '../../Tools/vuex.js';

const sudokuModule = {
	// Enable namespacing for this module
	namespaced: true,

	// Define the state for the Sudoku module
	state() {
		return {
			unSolvedSudoku: '',  // Board with unsolved Sudoku
			solvedSudoku: '',    // Solved Sudoku board
			difficulty: '',      // Difficulty level of the Sudoku
			gameOverMessage: '', // Message displayed when game is over
			mistakes: 0,         // Number of mistakes made by the player
			solved: false,       // Whether the Sudoku is solved or not
			currentNumber: 0,    // The current number selected by the player
			moreNumbers: [true, true, true, true, true, true, true, true, true], // Track if more numbers are available
		};
	},

	// Define mutations to modify the state
	mutations: {
		// Set the initial Sudoku data (both unsolved and solved boards)
		setSudoku(state, payload) {
			state.unSolvedSudoku = payload.unSolvedSudoku;
			state.solvedSudoku = payload.solvedSudoku;
			state.difficulty = payload.difficulty;
		},

		// Set a number on the Sudoku board at the specified row and column
		setNumberOnSudoku(state, payload) {
			state.unSolvedSudoku[payload.row][payload.col] = payload.number;
		},

		// Increase the mistake count by 1
		increaseMistakes(state) {
			state.mistakes++;
		},

		// Reset the mistakes count to 0
		setMistakes(state) {
			state.mistakes = 0;
		},

		// Set the message when the game is over (win/lose)
		setGameOverMessage(state, payload) {
			state.gameOverMessage = payload.text;
		},

		// Set whether the game is solved or not
		setSolved(state, payload) {
			state.solved = payload;
		},

		// Set the currently selected number by the player
		setCurrentNumber(state, payload) {
			state.currentNumber = payload.number;
		},

		// Set whether more numbers are available to place
		setMoreNumbers(state, payload) {
			state.moreNumbers[payload.index] = payload.value;
		},

		// Reset the "moreNumbers" array to the initial state
		setDefaultMoreNumbers(state) {
			state.moreNumbers = [
				true,
				true,
				true,
				true,
				true,
				true,
				true,
				true,
				true,
			];
		},
	},

	// Define getters to access the state values
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

	// Define actions to perform asynchronous tasks or complex logic
	actions: {
		// Generate a new Sudoku puzzle from an external API
		async generateSudoku({ commit }, payload) {
			try {
				commit('notify/setLoading', true, { root: true });

				// Fetch new Sudoku puzzle from the API
				const response = await fetch(
					'https://sudoku-api.vercel.app/api/dosuku'
				);
				const res = await response.json();

				// Prepare the puzzle data to store in the state
				const myData = {
					unSolvedSudoku: res.newboard.grids[0].value,
					solvedSudoku: res.newboard.grids[0].solution,
					difficulty: res.newboard.grids[0].difficulty,
				};

				// Reset the game state
				commit('setSolved', false);
				commit('setMistakes');
				commit('setDefaultMoreNumbers');

				// Store the new Sudoku data in the state
				commit('setSudoku', myData);
			} catch (error) {
				// Handle error and show a notification
				msgError(commit, errorCodes(error.code));
			} finally {
				// Disable loading spinner after the operation is done
				commit('notify/setLoading', false, { root: true });
			}
		},

		// Set a number in the Sudoku board and check for correctness
		setNumberInBoard({ commit, dispatch, getters }, payload) {
			if (
				getters.getUnSolvedSudoku[payload.row][payload.col] == 0 &&
				getters.getCurrentNumber != 0
			) {
				if (
					getters.getCurrentNumber == 
					getters.getSolvedSudoku[payload.row][payload.col]
				) {
					// Correct number, update the board
					commit('setNumberOnSudoku', {
						row: payload.row,
						col: payload.col,
						number: getters.getCurrentNumber,
					});

					// Check if the number is active and update availability
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

					// Check if the puzzle is solved
					dispatch('checkSolved')
						.then((result) => {
							if (result == true) {
								// Game won, display the message
								commit('setGameOverMessage', { text: 'You won!' });
								commit('setCurrentNumber', { number: 0 });

								// Mark the puzzle as solved
								commit('setSolved', true);
							}
						})
						.catch((err) => {});
				} else {
					// Incorrect number, increase mistake count
					commit('increaseMistakes');
					if (getters.getMistakes == 3) {
						// Game over after 3 mistakes
						commit('setGameOverMessage', { text: 'Game Over!' });
						commit('setCurrentNumber', { number: 0 });

						// Mark the puzzle as solved
						commit('setSolved', true);
					}
				}
			}
		},

		// Check if the given number is still available in the puzzle
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
			// If the number appears in all rows and columns, it's not active
			return count == 9;
		},

		// Check if the Sudoku puzzle is completely solved
		checkSolved({ getters }) {
			for (let row = 0; row < 9; row++) {
				for (let col = 0; col < 9; col++) {
					if (getters.getUnSolvedSudoku[row][col] == 0) {
						return false; // Puzzle not yet solved
					}
				}
			}
			return true; // Puzzle solved
		},

		// Set the new current number selected by the player
		setNewCurrectNumber({ commit }, payload) {
			commit('setCurrentNumber', payload);
		},
	},
};

export default sudokuModule;
