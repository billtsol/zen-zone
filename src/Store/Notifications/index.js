const notificationsModule = {
	namespaced: true,
	state() {
		return {
			loader: true,
			toastMsg: [false, '', 'error'], // true.false - message - type
		};
	},
	getters: {
		getToastMsg(state) {
			return state.toastMsg;
		},
		isLoading(state) {
			return state.loader;
		},
	},
	mutations: {
		setToastMsg(state, payload) {
			state.toastMsg = [true, payload.msg, payload.type];
		},
		setLoading(state, payload) {
			state.loader = payload;
		},
	},
};

export default notificationsModule;
