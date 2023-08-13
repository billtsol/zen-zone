<template>
	<div class="flex flex-col">
		<app-header></app-header>
		<main class="">
			<sudoku-game></sudoku-game>
		</main>
		<app-footer></app-footer>
	</div>
</template>

<script>
import appFooter from './components/Footer.vue';
import sudokuGame from './components/Games/sudoku.vue';
import appHeader from './components/Header.vue';

export default {
	components: {
		appHeader,
		appFooter,
		sudokuGame,
	},
};
</script>

<style></style>
