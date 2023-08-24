<template>
	<div class="flex flex-col">
		<app-footer></app-footer>
	</div>
</template>

<script>
import appFooter from './Footer.vue';
import sudokuGame from './Games/sudoku.vue';

export default {
	components: {
		appFooter,
		sudokuGame,
	},
};
</script>

<style></style>
