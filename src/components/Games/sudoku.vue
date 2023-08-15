<template>
	<div class="flex flex-col items-center">
		<div class="sudoku-board sm:mt-14 sm:mb-20 border-4 border-gray-700">
			<div
				v-for="(row, row_index) in sudoku"
				:key="row_index"
				class="w-full flex flex-row justify-around text-center"
			>
				<span
					v-for="(number, col_index) in row"
					:key="col_index"
					class="sudoku-number select-none cursor-default w-full sm:p-1 sm:text-3xl border-gray-400 sm:pt-2 sm:pb-2 text-sm"
					:class="addBorder(row_index, col_index)"
					v-text="number == 0 ? ' ' : number"
				>
				</span>
			</div>
		</div>
		<span @click="shuffleSudoku()" class="p-3 border-4">Test</span>
	</div>
</template>
<script>
export default {
	beforeMount() {
		this.fillGrid(this.sudoku);
		this.solved = this.sudoku;
	},
	data() {
		return {
			numberList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
			sudoku: [
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
			],
			solved: [],
			counter: 0,
		};
	},
	methods: {
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
		shuffle(array) {
			array.sort(() => Math.random() - 0.5);
		},
		checkGrid(grid) {
			for (let i = 0; i < 9; i++) {
				for (let j = 0; j < 9; j++) {
					if (grid[i][j] == 0) {
						return false;
					}
				}
			}
			return true;
		},
		forFuntion(n1, n2, n3, start, end, grid) {
			let table = [];
			for (let i = start; i < end; i++) {
				table.push([grid[i][n1], grid[i][n2], grid[i][n3]]);
			}
			return table;
		},
		fillGrid(grid) {
			for (let i = 0; i < 81; i++) {
				var row = parseInt(i / 9);
				var col = parseInt(i % 9);

				if (grid[row][col] == 0) {
					this.shuffle(this.numberList);

					for (let j = 0; j < this.numberList.length; j++) {
						let value = this.numberList[j];

						if (!grid[row].includes(value)) {
							if (
								[
									grid[0][col],
									grid[1][col],
									grid[2][col],
									grid[3][col],
									grid[4][col],
									grid[5][col],
									grid[6][col],
									grid[7][col],
									grid[8][col],
								].includes(value) == false
							) {
								let square = [];
								if (row < 3) {
									if (col < 3) {
										square = this.forFuntion(0, 1, 2, 0, 3, grid);
									} else if (col < 6) {
										square = this.forFuntion(3, 4, 5, 0, 3, grid);
									} else {
										square = this.forFuntion(6, 7, 8, 0, 3, grid);
									}
								} else if (row < 6) {
									if (col < 3) {
										square = this.forFuntion(0, 1, 2, 3, 6, grid);
									} else if (col < 6) {
										square = this.forFuntion(3, 4, 5, 3, 6, grid);
									} else {
										square = this.forFuntion(6, 7, 8, 3, 6, grid);
									}
								} else {
									if (col < 3) {
										square = this.forFuntion(0, 1, 2, 6, 9, grid);
									} else if (col < 6) {
										square = this.forFuntion(3, 4, 5, 6, 9, grid);
									} else {
										square = this.forFuntion(6, 7, 8, 6, 9, grid);
									}
								}
								if (
									[...square[0], ...square[1], ...square[2]].includes(value) ==
									false
								) {
									grid[row][col] = value;
									if (this.checkGrid(grid)) {
										return true;
									} else {
										if (this.fillGrid(grid)) {
											return true;
										}
									}
								}
							}
						}
					}
					break;
				}
			}
			grid[row][col] = 0;
		},
		solveGrid(grid) {
			for (let i = 0; i < 81; i++) {
				var row = parseInt(i / 9);
				var col = parseInt(i % 9);

				if (grid[row][col] == 0) {
					for (let value = 1; value < 10; value++) {
						if (!grid[row].includes(value)) {
							if (
								[
									grid[0][col],
									grid[1][col],
									grid[2][col],
									grid[3][col],
									grid[4][col],
									grid[5][col],
									grid[6][col],
									grid[7][col],
									grid[8][col],
								].includes(value) == false
							) {
								let square = [];
								if (row < 3) {
									if (col < 3) {
										square = this.forFuntion(0, 1, 2, 0, 3, grid);
									} else if (col < 6) {
										square = this.forFuntion(3, 4, 5, 0, 3, grid);
									} else {
										square = this.forFuntion(6, 7, 8, 0, 3, grid);
									}
								} else if (row < 6) {
									if (col < 3) {
										square = this.forFuntion(0, 1, 2, 3, 6, grid);
									} else if (col < 6) {
										square = this.forFuntion(3, 4, 5, 3, 6, grid);
									} else {
										square = this.forFuntion(6, 7, 8, 3, 6, grid);
									}
								} else {
									if (col < 3) {
										square = this.forFuntion(0, 1, 2, 6, 9, grid);
									} else if (col < 6) {
										square = this.forFuntion(3, 4, 5, 6, 9, grid);
									} else {
										square = this.forFuntion(6, 7, 8, 6, 9, grid);
									}
								}
								if (
									[...square[0], ...square[1], ...square[2]].includes(value) ==
									false
								) {
									grid[row][col] = value;
									if (this.checkGrid(grid)) {
										this.counter += 1;
										break;
									} else {
										if (this.solveGrid(grid)) {
											return true;
										}
									}
								}
							}
						}
					}
					break;
				}
			}
			grid[row][col] = 0;
		},
		shuffleSudoku() {
			let attempts = 10;
			this.counter = 1;

			while (attempts > 0) {
				let row = Math.floor(Math.random() * 9);
				let col = Math.floor(Math.random() * 9);

				while (this.sudoku[row][col] == 0) {
					row = Math.floor(Math.random() * 9);
					col = Math.floor(Math.random() * 9);
				}

				let backup = this.sudoku[row][col];
				this.sudoku[row][col] = 0;

				let copyGrid = [];
				for (let i = 0; i < 9; i++) {
					copyGrid.push([]);
					for (let j = 0; j < 9; j++) {
						copyGrid[i].push(this.sudoku[i][j]);
					}
				}
				this.counter = 0;
				this.solveGrid(copyGrid);

				if (this.counter != 1) {
					this.sudoku[row][col] = backup;
					attempts -= 1;
				}
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
}

@media (max-width: 640px) {
	.sudoku-board {
		width: 250px;
		height: 250px;
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
	}
	.sudoku-number {
		padding-top: 4.3px;
		/*padding-bottom: 1.5rem; */
	}
}
</style>
