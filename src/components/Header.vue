<template>
	<header
		class="w-full select-none bg-blue-700 p-4 flex place-content-around font-bold"
	>
		<h1 class="inline p-2">
			<span class="text-xl text-gray-50 cursor-pointer">
				<router-link to="/"> Zen Zone </router-link>
			</span>
		</h1>
		<nav class="">
			<ul class="p-2">
				<li
					class="p-1 px-2 rounded text-lg text-gray-100 cursor-pointer hover:bg-blue-800 inline"
				>
					<router-link to="/sudoku"> Games </router-link>
				</li>
				<li
					class="inline p-1 px-2 rounded text-lg text-gray-100 cursor-pointer hover:bg-blue-800"
				>
					<router-link to="/login" v-if="!isAuth"> Log in </router-link>
					<span v-else @click="logOutUser"> LogOut</span>
				</li>
				<li
					v-if="isAuth"
					class="p-1 px-2 ml-4 rounded text-lg text-gray-100 select-none inline"
				>
					{{ user.username }}
				</li>
			</ul>
		</nav>
	</header>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
	computed: {
		...mapGetters({
			isAuth: 'auth/isAuth',
			user: 'auth/getUserData',
		}),
	},
	methods: {
		logOutUser() {
			this.$store.dispatch('auth/signOut');
		},
	},
};
</script>
<style scoped></style>
