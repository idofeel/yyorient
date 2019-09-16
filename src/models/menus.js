import api from '../services/api';
import { get } from '../utils/request';
import PageConfig from '../pages/common/PageConfig';

export default {
	namespace: 'menus',
	state: {
		topCategory: [],
		secondaryMenu: {},
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
		// dispatch 导航菜单 一级二级
		*setMenus({ payload }, { put, call }) {
			const res = yield call(async () => await get(api.menus));
			let topCategory = [];
			let secondaryMenu = {}; // 二级菜单 keys 对应路由
			const secondaryMenus = (item = {}) => {
				if (!item.sub && !item.sub.length) return item;
				return item.sub;
			};
			if (res.success) {
				// 初始加载 一级菜单、二级菜单数据
				topCategory = res.data.map((item) => {
					const key = PageConfig[item.id] || 'home';
					return {
						...item,
						path: '/' + key,
						key,
						name: item.name,
					};
				});
				topCategory.map(
					(item) => (secondaryMenu[item.key] = secondaryMenus(item)),
				);
			}
			payload = { topCategory, secondaryMenu };
			// 设置菜单的数据
			yield put({ type: 'save', payload });
		},
	},

	reducers: {
		save(state, action) {
			return { ...state, ...action.payload };
		},
	},
};
