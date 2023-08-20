<template>
	<div class="flex flex-col items-center pt-10">
		<div class="flex flex-col text-center">
			<div class="flex flex-row place-content-between sm:text-xl text-xs">
				<span class="">Mistakes: {{ mistakes }} / 3</span>
				<span class="mr-4"> {{ difficulty }} </span>
				<span class="">Time: {{ timeConvertor() }}</span>
			</div>
			<div class="sudoku-board sm:mb-20 border-2 rounded border-gray-700">
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
					v-for="(row, row_index) in unSolvedSudoku"
					:key="row_index"
					class="w-full flex flex-row justify-around text-center"
				>
					<div
						v-for="(number, col_index) in row"
						:key="col_index"
						class="sudoku-number flex justify-center items-center select-none w-full sm:p-1 sm:text-3xl border-gray-400 sm:pt-2 sm:pb-2 text-2xl bg-blue-100 hover:bg-blue-300"
						:class="[
							addBorder(row_index, col_index),
							setCursor(number),
							...boardNumbersStyle(number),
						]"
					>
						<div
							class="pl-2 pr-2"
							:class="[
								number == 0 && currentNumber != 0
									? 'hover:cursor-pointer'
									: 'hover:cursor-default',
							]"
							@click="
								setNumberInBoard({
									row: row_index,
									col: col_index,
								})
							"
						>
							{{ number }}
						</div>
					</div>
				</div>
				<div
					class="select-none w-full flex flex-row items-center justify-around mt-4"
				>
					<div
						v-for="num in numberList"
						class="sudoku-number mt-1 m-0.5 sm:text-3xl text-center rounded-md text-2xl flex justify-center items-center"
						:class="[...numbersBarStyle(num)]"
						@click="setNewCurrectNumber({ number: num })"
					>
						<span class="">{{ num }}</span>
					</div>
				</div>
				<div
					class="mt-7 border-2 rounded p-1 bg-gray-200 select-none cursor-pointer inline-block"
					@click="newGame()"
				>
					Reset
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
			unSolvedSudoku: 'sudoku/getUnSolvedSudoku',
			solvedSudoku: 'sudoku/getSolvedSudoku',
			mistakes: 'sudoku/getMistakes',
			difficulty: 'sudoku/getDifficulty',
			solved: 'sudoku/isSolved',
			moreNumbers: 'sudoku/getMoreNumbers',
			currentNumber: 'sudoku/getCurrentNumber',
			gameOverMessage: 'sudoku/getGameOverMessage',
		}),
	},
	created() {
		this.increaseTime();
	},
	data() {
		return {
			numberList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
			time: 0,
		};
	},
	methods: {
		...mapActions({
			isNumberActive: 'sudoku/isNumberActive',
			setNumberInBoard: 'sudoku/setNumberInBoard',
			setNewCurrectNumber: 'sudoku/setNewCurrectNumber',
			newGame: 'sudoku/generateSudoku',
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
					return '!border-b-2 !border-r-2 !border-r-gray-700 !border-b-gray-700';
				}
				return '!border-r-2 !border-r-gray-700';
			} else if (row_index == 2 || row_index == 5) {
				return '!border-b-2 !border-b-gray-700';
			}
			return '';
		},

		numbersBarStyle(number) {
			let styles = [];
			if (this.currentNumber == number) {
				styles.push('bg-blue-300');
			} else {
				styles.push('bg-blue-100');
			}

			if (this.moreNumbers[parseInt(number) - 1]) {
				styles.push('cursor-pointer bg-blue-100 hover:bg-blue-300');
			} else {
				styles.push('cursor-default bg-red-500 text-white');
			}

			return styles;
		},

		boardNumbersStyle(number) {
			let styles = [];
			if (number == this.currentNumber && this.currentNumber != 0) {
				styles.push('bg-blue-300');
			} else {
				styles.push('bg-blue-100');
			}

			if (this.moreNumbers[parseInt(number) - 1]) {
			} else {
				styles.push('hover:bg-blue-300');
			}
			return styles;
		},
		setCursor(number) {
			if (number == 0) {
				return ' hover:text-blue-300 text-blue-100';
			}
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
	height: 55.1px;
}

@media (max-width: 640px) {
	.sudoku-board {
		width: 350px;
		height: 375px;
	}
	.sudoku-number {
		width: 100%;
		height: 41.25px;
	}
}
</style>
