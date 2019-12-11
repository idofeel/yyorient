export default {
	namespace: 'global',

	state: {
		userInfo: {
			uname: '',
			pwd: null,
			id: null,
			avatar:
				'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
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
		*getLoginState({ payload }, { put }) {
			// 获得登录状态
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
