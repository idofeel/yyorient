export default {
	namespace: 'famous',
	state: {
		famous: [],
		agoFamous: [],
	},

	subscriptions: {
		setup({ dispatch, history }) {
			// eslint-disable-line
		},
	},

	effects: {
		*getList({ payload }, { put }) {
			yield put({ type: 'get_List', payload });
		},
	},

	reducers: {
		get_List(state, action) {
			const { payload } = action;
			return { ...state, ...payload };
		},
	},
};
