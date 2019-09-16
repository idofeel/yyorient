import React, { Component } from 'react';
import SecondayClassfiy from '../../components/SecondayClassfiy/SecondayClassfiy';
import api from '../../services/api';
import { get } from '../../utils/request';
import { Spin, Empty } from 'antd';
import './page.less';
import { queryString, joinUrlEncoded } from '../../utils';
/**
 * 菜单和分类
 *
 *
 * 根据 pageId pageName 获取菜单数据
 *
 * renderBody(){}
 *
 */

class Page extends Component {
	constructor(props, state) {
		super(props);
		const { secondaryMenu = [] } = props.menus || {};
		const menuTabs = secondaryMenu[this.pageName] || [];
		const { cateId = '', cateIndex: activeKey } = queryString(
			this.props.location.search,
		);
		let selectedTags = [],
			cateids = cateId.split(',');
		if (cateids.toString()) selectedTags[activeKey] = cateids;

		this.state = {
			menuTabs,
			activeKey: activeKey || '0', // 初始展示的菜单
			nextActiveKey: '',
			selectedTags,
			loading: true,
			empty: false,
			hideCate: false,
			...state,
		};
		this.query = queryString(this.props.location.search);
		this.pageId = props.pageId || this.pageId;
		this.pageName = props.pageName || this.pageName;
		this.selectTags = props.selectTags || this.selectTags || function() {};

		this.loading = this.state.loading || true;
		this.empty = this.state.empty || false;
	}
	loadMenu = true; // 是否加载菜单
	// loading = true; //页面loading状态 存在时将不能加载内容
	// empty = false; //页面empty展示的状态
	pageId = '0'; // 图库页对应id
	pageName = 'home'; // 图库页对应名称

	render() {
		const {
			menuTabs,
			activeKey,
			selectedTags,
			hideCate,
			loading,
			empty,
		} = this.state;
		return (
			<div className="yyPage">
				{this.loadMenu && (
					<SecondayClassfiy
						tabChange={(item, index) => this.tabChange(item, index)}
						tabs={menuTabs}
						mouseEnterTab={(item, index) =>
							this.mouseEnterTab(item, index)
						}
						selectOptions={(item, key, tags) =>
							this.selectOptions(item, key, tags)
						}
						activeKey={activeKey}
						selectedTags={selectedTags}
						hideCate={hideCate}
					/>
				)}
				{
					<div
						ref="container"
						onMouseEnter={() => {
							this.setState({
								hideCate: true,
							});
						}}>
						{empty ? (
							<Empty
								image={Empty.PRESENTED_IMAGE_SIMPLE}
								description={
									empty === true ? '暂无数据' : empty
								}
							/>
						) : loading ? (
							<Spin spinning={loading} size="large"></Spin>
						) : (
							this.renderBody()
						)}
					</div>
				}
				{this.renderFooter()}
			</div>
		);
	}
	mouseEnterTab(item, index) {
		// 没有子元素，或不是当前tab
		if (item.sub === '0' || index !== this.state.activeKey * 1) return;
		this.setState({
			hideCate: false,
		});
	}

	// 二级菜单tab发生变化
	tabChange(item, index) {
		// const tagid = item.sub < 1 ? [item.id] : [];
		this.getCategory(item.id, index);
	}

	renderFooter() {}
	renderBody() {} // 渲染body 数据

	getPath(ids = this.state.selectedTags, index = this.state.activeKey) {
		return '?cateId=' + ids + '&cateIndex=' + index;
	}

	replaceState() {
		const pathName = this.props.location.pathname;
		const { selectedTags, activeKey } = this.state;
		// 保留原有参数更新地址栏
		let params = {
			...queryString(this.props.location.search),
			cateId: selectedTags[activeKey],
			cateIndex: activeKey,
		};
		const path = joinUrlEncoded('#' + pathName, params);

		window.history.replaceState({}, 0, path);
	}
	// selectTags() {}

	// 三级菜单选中
	selectOptions(tabItem, tabIndex, tags = {}) {
		console.log('三级菜单选中');
		let { selectedTags } = this.state;
		let nextSeleted = selectedTags[tabIndex];

		tabItem.data.forEach((i) => {
			nextSeleted = nextSeleted.filter((t) => t !== i.id); // 删除单行数据中的所有tagid
		});
		if (tags.id) nextSeleted = [...nextSeleted, tags.id];
		selectedTags[tabIndex] = nextSeleted;
		this.setState({ selectedTags, activeKey: tabIndex }, () =>
			this.readyLoad(),
		);
	}

	onTab() {}
	onTabEnd() {}

	readyLoad() {
		const { selectedTags, activeKey } = this.state;
		this.selectTags(selectedTags[activeKey]);
	}

	/**
	 * 根据二级分类id获取三级分类数据
	 *
	 * @param {String} id  默认 '2' 图库的id
	 * @param {Number} index 默认 0  全部
	 * @param {Function} callback 默认 false 是否加载图库数据
	 */
	async getCategory(id, index = 0, callback = () => {}) {
		console.log('getCategory');
		let { menuTabs, activeKey, selectedTags } = this.state;
		let selectTags = []; // 三级初始选中的标签
		const items = menuTabs[index];
		if (items) {
			// tab没有分类
			if (items.sub < 1) {
				menuTabs[index].categories = [];
			}

			// tab有分类 但没有加载分类信息
			if (!menuTabs[index].categories) {
				//  获取分类信息
				let categories = []; // 三级分类数据
				const res = await get(api.category, { id });
				if (res.success && res.data) {
					// 处理三级分类数据
					categories = res.data.map((item) => {
						const { id, name, sub = [] } = item;
						sub.unshift({ name: '全部', id: item.id }); // 默认值全部
						selectTags.push(sub[0].id);
						return {
							id,
							name,
							data: sub || [],
						};
					});
				}

				menuTabs[index].categories = categories;
			}
		}

		// 处理三级分类ID选中
		if (!selectedTags[index]) selectedTags[index] = selectTags;

		// 当前选中的分类是否在
		const tagId = this.getOnlyTagId(
			menuTabs[index].categories,
			selectedTags[index],
		);
		selectedTags[index] = tagId.length ? tagId : [menuTabs[index].id];

		this.setState(
			{
				menuTabs,
				selectedTags,
				activeKey: index + '',
				hideCate: false,
			},
			() => this.readyLoad(),
		);
	}

	// 保证加载数据时 id 的唯一性,自动纠错
	getOnlyTagId(categories, selectedTag) {
		let tempTags = [];
		categories.map((item) => {
			// 当前tab分类的每一行数据保证直有一个选中
			const temptag = item.data.filter((tags) => {
				return selectedTag.filter((tag) => tag === tags.id)[0];
			});

			if (temptag.length === 1) {
				// 找到tagid
				tempTags.push(temptag[0].id);
			} else {
				// 当前行未找到对应的id 设置未全部
				tempTags.push(item.id);
			}
		});
		return tempTags;
	}

	/**
	 *
	 * @param {Object} status 设置页面展示的状态  loading empty
	 */
	setPageStatus(status = { loading: true, empty: false }) {
		this.loading = status.loading;
		this.empty = status.empty;
	}
	// 获取菜单数据
	getMenutabsData(props = this.props) {
		const { menuTabs } = this.state;
		const { secondaryMenu = [] } = props.menus || {};
		const tabs = secondaryMenu[this.pageName] || [];
		if (menuTabs.toString() !== tabs.toString()) {
			this.setState({
				menuTabs: tabs,
			});
		}
	}

	// 组件准备加载
	onLoad() {}
	UNSAFE_componentWillMount() {
		this.getMenutabsData(); // 获取菜单数据
		this.onLoad();
	}

	// 组件已加载 // 获取三级菜单
	onReady() {}
	async componentDidMount() {
		try {
			const { activeKey, menuTabs } = this.state,
				category = menuTabs[activeKey];
			if (category) {
				await this.getCategory(category.id, activeKey); // 初始加载分类数据
			}
		} catch (error) {}
		this.onReady();
	}

	// 组件接收参数
	onReceive() {}
	UNSAFE_componentWillReceiveProps(nextProps) {
		// this.getMenutabsData(nextProps);
		this.onReceive(...arguments);
	}

	// 组件卸载
	onWillUnmount() {}
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
		this.onWillUnmount();
	}
}

export default Page;
