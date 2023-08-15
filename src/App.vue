<template>
	<app-header></app-header>
	<router-view v-if="!isLoading"></router-view>
	<div class="page_loader text-center mt-40" v-else>
		<appLoader />
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

import appHeader from './components/Header.vue';
import appLoader from './components/Utils/Loader.vue';

export default {
	components: {
		appHeader,
		appLoader,
	},
	computed: {
		...mapGetters({
			toastMsg: 'notify/getToastMsg',
			isLoading: 'notify/isLoading',
		}),
	},
	data() {
		return {};
	},
	watch: {
		toastMsg(toastMsg) {
			if (toastMsg[0] === true) {
				if (toastMsg[2] === 'error') {
					this.$toast.error(toastMsg[1]);
				}
				if (toastMsg[2] === 'success') {
					this.$toast.success(toastMsg[1]);
				}
			}
		},
	},
};
</script>

<style></style>
