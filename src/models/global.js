export default {
	namespace: 'global',

	state: {
		userInfo: {
			uname: 'dofeel',
			pwd: null,
			id: null,
		},
	},

	subscriptions: {
		setup({ dispatch, history }) {
			// eslint-disable-line
		},
	},

	effects: {
		*fetch({ payload }, { call, put }) {
			// eslint-disable-line
			yield put({ type: 'save' });
		},
		*setUserInfo({ payload }, { put }) {
			yield put({ type: 'set_userinfo', payload });
		},
	},

	reducers: {
		save(state, action) {
			return { ...state, ...action.payload };
		},
		set_userinfo(state, action) {
			const { payload } = action;
			return { ...state, userInfo: payload };
		},
	},
};
