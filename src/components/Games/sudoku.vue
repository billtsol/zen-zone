<template>
	<div class="flex flex-col items-center">
		<div class="sudoku-board mt-14 mb-20 border-4 border-gray-700">
			<div
				v-for="(row, row_index) in sudoku"
				:key="row_index"
				class="w-full flex flex-row justify-around text-center"
			>
				<span
					v-for="(number, col_index) in row"
					:key="col_index"
					class="sudoku-number select-none cursor-default w-full p-1 text-3xl border-gray-400 pt-2 pb-2"
					:class="addBorder(row_index, col_index)"
				>
					{{ number }}
				</span>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			sudoku: [
				[1, 2, 3, 4, 5, 6, 7, 8, 9],
				[1, 2, 3, 4, 5, 6, 7, 8, 9],
				[1, 2, 3, 4, 5, 6, 7, 8, 9],
				[1, 2, 3, 4, 5, 6, 7, 8, 9],
				[1, 2, 3, 4, 5, 6, 7, 8, 9],
				[1, 2, 3, 4, 5, 6, 7, 8, 9],
				[1, 2, 3, 4, 5, 6, 7, 8, 9],
				[1, 2, 3, 4, 5, 6, 7, 8, 9],
				[1, 2, 3, 4, 5, 6, 7, 8, 9],
			],
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
</style>
