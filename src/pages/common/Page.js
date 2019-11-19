import React, { Component } from 'react';
import SecondayClassfiy from '../../components/SecondayClassfiy/SecondayClassfiy';
import api from '../../services/api';
import { get } from '../../utils/request';
import { Spin, Empty, Breadcrumb } from 'antd';
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
		const { secondaryMenu = {}, topCategory = [] } = props.menus || {};
		const menuTabs = secondaryMenu[this.pageName] || [];
		const { cateId = '', cateIndex: activeKey } = queryString(
			this.props.location.search,
		);
		let selectedTags = [],
			cateids = cateId.split(',');
		if (cateids.toString()) selectedTags[activeKey] = cateids;

		// const breadcrumb = topCategory.filter(
		// 	(item) => item.path === props.location.pathname,
		// );

		this.state = {
			menuTabs,
			activeKey: activeKey || '0', // 初始展示的菜单
			nextActiveKey: '',
			selectedTags,
			loading: false,
			empty: false,
			hideCate: true,
			breadcrumb: [],
			showBreadcrumb: true,
			...state,
		};

		this.query = queryString(this.props.location.search);
		this.pageId = props.pageId || this.pageId;
		this.pageName = props.pageName || this.pageName;
		this.selectTags = props.selectTags || this.selectTags || function() {};

		this.loading = false;
		this.empty = this.state.empty || false;
		console.log('Page', this.props);
	}
	loadMenu = true; // 是否加载菜单
	// loading = true; //页面loading状态 存在时将不能加载内容
	// empty = false; //页面empty展示的状态

	pageId = '0'; // 图库页对应id
	pageName = 'home'; // 图库页对应名称
	pagePath = '/home';

	getBreadcrumb() {
		const { topCategory = [] } = this.props.menus || {};

		// const tabs = secondaryMenu[this.pageName] || [];

		// const { activeKey } = this.state;

		// 一级菜单
		let breadcrumb = topCategory.filter(
			(item) => this.props.location.pathname.indexOf(item.path) > -1,
		);
		breadcrumb.unshift({
			name: '首页',
			path: '/home',
		});
		// // 二级菜单
		// this.setBreadcrumb;
		// let temptabs = tabs[tabIndex || activeKey];
		// temptabs.path = this.getPath();
		// breadcrumb.push();

		return breadcrumb;
	}
	setBreadcrumb(ids, tabIndex) {
		const tabs = this.state.menuTabs[tabIndex];
		return {
			name: tabs.name,
			path: this.pagePath + this.getPath(ids, tabIndex),
		};
	}

	/**
	 *
	 * @param {object} params path | name
	 */
	pushTrack(params) {
		let { breadcrumb } = this.state;
		breadcrumb.push(params);
		return breadcrumb;
	}

	render() {
		const {
			menuTabs,
			activeKey,
			selectedTags,
			hideCate,
			loading,
			empty,
			breadcrumb,
			showBreadcrumb,
		} = this.state;
		return (
			<div className='yyPage'>
				{this.loadMenu && !!menuTabs.length ? null : null}
				{this.loadMenu && !!menuTabs.length && (
					<>
						<SecondayClassfiy
							tabChange={(item, index) =>
								this.tabChange(item, index)
							}
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
						<div
							ref='container'
							className={this.state.bodyClass}
							onMouseEnter={() => {
								!this.state.hideCate &&
									this.setState({
										hideCate: true,
									});
							}}>
							{showBreadcrumb && (
								<Breadcrumb
									separator='>'
									className='pageBreadcumb'>
									{breadcrumb.map((item, index) => (
										<Breadcrumb.Item
											key={index}
											href={'#' + item.path}>
											{item.name}
										</Breadcrumb.Item>
									))}
								</Breadcrumb>
							)}
							{empty ? (
								<Empty
									image={Empty.PRESENTED_IMAGE_SIMPLE}
									description={
										empty === true ? '暂无数据' : empty
									}
								/>
							) : loading ? (
								<Spin spinning={loading} size='large'></Spin>
							) : (
								this.renderBody()
							)}
						</div>
					</>
				)}
				{this.renderFooter()}
			</div>
		);
	}

	renderMenus() {
		return;
	}

	renderContent() {}
	mouseEnterTab(item, index) {
		// 没有子元素，或不是当前tab
		if (item.sub === '0' || index !== this.state.activeKey * 1) return;
		this.setState({
			hideCate: false,
		});
	}

	// 二级菜单tab发生变化
	tabChange(item, index) {
		let breadcrumb = this.getBreadcrumb();
		breadcrumb.push(this.setBreadcrumb('', index));
		this.setState({
			breadcrumb,
			loading: true,
			empty: false,
		});
		// const tagid = item.sub < 1 ? [item.id] : [];
		this.getCategory(item.id, index);
	}

	renderFooter() {}
	renderBody() {
		return null;
	} // 渲染body 数据

	getPath(ids, index) {
		const { selectedTags, activeKey } = this.state;
		const cateIndex = index || index == 0 ? index : activeKey;
		return joinUrlEncoded('', {
			cateId: ids || selectedTags[activeKey],
			cateIndex,
		});
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
	async getCategory(id, index = this.state.activeKey, callback = () => {}) {
		console.log('getCategory', index);
		let { menuTabs, selectedTags } = this.state;
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
		let breadcrumb = this.getBreadcrumb();
		breadcrumb.push(this.setBreadcrumb(selectedTags[index], index));
		this.setState(
			{
				menuTabs,
				selectedTags,
				activeKey: index + '',
				hideCate: false,
				// loading: false,
				empty: false,
				breadcrumb,
			},
			() => {
				this.readyLoad();
			},
		);
	}

	// 保证加载数据时 id 的唯一性,自动纠错
	getOnlyTagId(categories, selectedTag) {
		let tempTags = [];
		categories.forEach((item) => {
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
	async getMenutabsData(props = this.props) {
		const { menuTabs, activeKey } = this.state;
		const { secondaryMenu = [] } = props.menus || {};
		const tabs = secondaryMenu[this.pageName] || [];
		if (menuTabs.toString() !== tabs.toString()) {
			this.setState(
				{
					menuTabs: tabs,
				},
				() => {
					this.getCategory(tabs[activeKey].id);
				},
			);
		}
	}

	// 组件准备加载
	onLoad() {}
	UNSAFE_componentWillMount() {
		this.getMenutabsData(); // 获取菜单数据
	}

	// 组件已加载 // 获取三级菜单
	onReady() {}
	async componentDidMount() {
		const { menuTabs } = this.state;
		const { secondaryMenu = [] } = this.props.menus || {};
		const tabs = secondaryMenu[this.pageName] || [];
		if (menuTabs.toString() !== tabs.toString()) {
			this.setState({
				menuTabs: tabs,
			});
		}

		try {
			const { activeKey, menuTabs } = this.state,
				category = menuTabs[activeKey] || tabs[activeKey];

			if (category) {
				await this.getCategory(category.id, activeKey); // 初始加载分类数据
				this.onReady();
			}
		} catch (error) {}
	}

	// 组件接收参数
	onReceive() {}
	UNSAFE_componentWillReceiveProps(nextProps) {
		this.getMenutabsData(nextProps);
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
