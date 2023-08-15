const msgError = (commit, msg = 'Oops, try again!!') => {
	return commit(
		'notify/setToastMsg',
		{
			msg: msg,
			type: 'error',
		},
		{
			root: true,
		}
	);
};

const msgSuccess = (commit, msg = 'Thank you!!') => {
	return commit(
		'notify/setToastMsg',
		{
			msg: msg,
			type: 'success',
		},
		{
			root: true,
		}
	);
};
export { msgError, msgSuccess };
