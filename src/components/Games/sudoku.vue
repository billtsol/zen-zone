<template>
	<div class="flex flex-col items-center pt-10">
		<div class="flex flex-col">
			<div class="flex flex-row place-content-between sm:text-xl text-xs">
				<span class="">Mistakes: {{ mistakes }} / 3</span>
				<span class="mr-4"> {{ sudoku.difficulty }} </span>
				<span class="">Time: {{ timeConvertor() }}</span>
			</div>
			<div class="sudoku-board sm:mb-20 border-4 rounded border-gray-700">
				<div
					v-if="solved"
					class="w-full h-full flex flex-col justify-center items-center"
				>
					<span class="text-3xl">{{ gameOverMessage }}</span>

					<div
						class="select-none cursor-pointer border-none rounded-lg p-3 bg-blue-100 hover:bg-blue-300 sm:text-xl text-xs"
						@click="newGame()"
					>
						New Game
					</div>
				</div>
				<div
					v-else
					v-for="(row, row_index) in sudoku.value"
					:key="row_index"
					class="w-full flex flex-row justify-around text-center"
				>
					<span
						v-for="(number, col_index) in row"
						:key="col_index"
						class="sudoku-number select-none cursor-default w-full sm:p-1 sm:text-3xl border-gray-400 sm:pt-2 sm:pb-2 text-sm bg-blue-100 hover:bg-blue-300"
						:class="[
							addBorder(row_index, col_index),
							number == currentNumber && currentNumber != 0
								? 'bg-blue-300'
								: 'bg-blue-100',
						]"
					>
						<div
							class="w-full h-full"
							:class="[
								currentNumber == 0 ? 'cursor-default' : 'cursor-pointer',
							]"
							v-text="number == 0 ? ' ' : number"
							@click="setNumberInBoard(row_index, col_index)"
						></div>
					</span>
				</div>
				<div
					class="select-none w-full flex flex-row items-center justify-around mt-4"
				>
					<div
						v-for="num in numberList"
						class="sudoku-number m-1 border-2 cursor-pointer sm:text-3xl sm:pt-2 sm:pb-2 p-l text-center rounded-md text-sm bg-blue-100 hover:bg-blue-300"
						:class="[currentNumber == num ? 'bg-blue-300' : 'bg-blue-100']"
						@click="setCurrectNumber(num)"
					>
						<span class="w-full h-full align-middle">{{ num }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
export default {
	components: {},
	computed: {
		...mapGetters({
			sudoku: 'sudoku/getSudokuData',
		}),
	},
	created() {
		this.increaseTime();
	},
	data() {
		return {
			numberList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
			counter: 0,
			solved: false,
			currentNumber: 0,
			mistakes: 0,
			gameOverMessage: '',
			time: 0,
		};
	},
	methods: {
		...mapActions({
			sudokuGenerator: 'sudoku/generateSudoku',
		}),
		increaseTime() {
			setInterval(() => {
				this.time = parseInt(this.time) + 1;
			}, 1000);
		},
		timeConvertor() {
			let str = ['0', '0', '0', '0'];

			let minutes = Math.floor(this.time / 60);
			let seconds = this.time % 60;

			if (parseInt(seconds / 10) >= 1) {
				str[3] = (seconds % 10) + '';
				str[2] = parseInt(seconds / 10) + '';
			} else {
				str[3] = (seconds % 10) + '';
			}
			if (parseInt(minutes / 10) >= 1) {
				str[1] = (minutes % 10) + '';
				str[0] = parseInt(minutes / 10) + '';
			} else {
				str[1] = (minutes % 10) + '';
			}
			return str[0] + str[1] + ':' + str[2] + str[3];
		},
		addBorder(row_index, col_index) {
			if (col_index == 2 || col_index == 5) {
				if (row_index == 2 || row_index == 5) {
					return '!border-b-4 !border-r-4 !border-r-gray-700 !border-b-gray-700';
				}
				return '!border-r-4 !border-r-gray-700';
			} else if (row_index == 2 || row_index == 5) {
				return '!border-b-4 !border-b-gray-700';
			}
			return '';
		},
		checkSolved() {
			for (let row = 0; row < 9; row++) {
				for (let col = 0; col < 9; col++) {
					if (this.sudoku[row][vol] == 0) {
						return false;
					}
				}
			}
			return true;
		},
		setCurrectNumber(number) {
			this.currentNumber = number;
		},

		setNumberInBoard(row, col) {
			if (this.sudoku.value[row][col] == 0 && this.currentNumber != 0) {
				if (this.currentNumber == this.sudoku.solution[row][col]) {
					this.$store.dispatch('sudoku/setNumber', {
						row: row,
						col: col,
						number: this.currentNumber,
					});
					if (this.checkSolved()) {
						this.gameOverMessage = 'You won!';
						this.solved = true;
					}
				} else {
					this.mistakes++;
					if (this.mistakes == 3) {
						this.gameOverMessage = 'Game Over!';
						this.solved = true;
					}
				}
			}
		},
		newGame() {
			this.sudokuGenerator({});
			this.solved = false;
			this.mistakes = 0;
		},
	},
};
</script>
<style scoped>
.sudoku-board {
	width: 500px;
	height: 500px;
}

.sudoku-number {
	border-width: 0.5px;
	width: 129px;
	height: 54.8px;
}

@media (max-width: 640px) {
	.sudoku-board {
		width: 250px;
		height: 250px;
	}
	.sudoku-number {
		padding-top: 3px;
		width: 59px;
		height: 27px;
		/*padding-bottom: 1.5rem; */
	}
}
</style>
