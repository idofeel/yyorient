import api from '../services/api';
import { get } from '../utils/request';
import PageConfig from '../pages/common/PageConfig';

export default {
	namespace: 'menus',
	state: {
		topCategory: [],
		secondaryMenu: {},
		selectedTags: [],
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
		*getCategory({ payload, callback }, { put, call }) {
			let {
				item: parentItem,
				index,
				pageName,
				selectedTag = [],
			} = payload;
			let categories = [];
			let tempTags = [parentItem.id];
			let res = yield call(
				async () => await get(api.category, { id: parentItem.id }),
			);
			if (res.success) {
				tempTags = [];
				categories = res.data.map((item, idx) => {
					item.sub.unshift({
						id: item.id,
						name: '全部',
					});
					let temptag = item.sub.filter((tags) => {
						return selectedTag.filter((tag) => tag === tags.id)[0];
					});
					if (temptag.length === 1) {
						// 找到tagid
						tempTags.push(temptag[0].id);
					} else {
						// 当前行未找到对应的id 设置未全部
						tempTags.push(item.id);
					}
					return {
						id: item.id,
						name: item.name,
						data: item.sub,
					};
				});
				// 没有分类
				if (!categories.length) tempTags = [parentItem.id];
			}

			callback && callback(tempTags, index);
			yield put({
				type: 'changeSecondaryMenu',
				payload: {
					pageName,
					categories,
					selectedTag: tempTags,
					index,
				},
			});
		},
	},

	reducers: {
		save(state, action) {
			return { ...state, ...action.payload };
		},
		changeSecondaryMenu(state, action) {
			const { selectedTag, categories, index, pageName } = action.payload;
			let { secondaryMenu, selectedTags } = state;
			secondaryMenu[pageName][index].categories = categories;
			selectedTags[index] = selectedTag;
			return { ...state, secondaryMenu, selectedTags };
		},
		removeCategories(state, action) {
			let { secondaryMenu } = state;
			secondaryMenu[action.payload].map((item) => {
				item.categories = false;
				return item;
			});
			return { ...state, secondaryMenu, selectedTags: [] };
		},
	},
};
