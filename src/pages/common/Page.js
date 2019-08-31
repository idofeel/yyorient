import React, { Component } from 'react';
import SecondayClassfiy from '../../components/SecondayClassfiy/SecondayClassfiy';
import api from '../../services/api';
import { get } from '../../utils/request';
import { Spin, Empty } from 'antd';
import './page.less';
import { queryString } from '../../utils';
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
		const { secondaryMenu = [] } = props.global;
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
		let { loading, empty } = this.state;

		const { menuTabs, activeKey, nextActiveKey, selectedTags } = this.state;
		return (
			<div className="yyPage">
				{this.loadMenu && (
					<SecondayClassfiy
						tabs={menuTabs}
						onChange={(index) => this.onChange(index)}
						mouseEnterTab={(item, index) =>
							this.mouseEnterTab(item, index)
						}
						selectOptions={(item, key) =>
							this.selectOptions(item, key)
						}
						activeKey={activeKey}
						// nextActiveKey={nextActiveKey}
						selectedTags={selectedTags}
					/>
				)}
				{
					<div ref="container">
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

	renderFooter() {}

	getPath(ids = this.state.selectedTags, index = this.state.activeKey) {
		return '?cateId=' + ids + '&cateIndex=' + index;
	}

	replaceState(ids, index) {
		const pathName = this.props.location.pathname;
		const path = '#' + pathName + this.getPath(ids, index);
		window.history.replaceState({}, 0, path);
	}
	renderBody() {} // 渲染body 数据
	// 二级菜单选中
	onChange(index) {
		this.setState({
			activeKey: index + '',
			nextActiveKey: '',
		});
		console.log('onChange', this.state.selectedTags);

		const ids = this.state.selectedTags;

		this.selectTags(ids, index + '');
		this.replaceState(ids, index);
	}

	// selectTags() {}

	// 三级菜单选中
	selectOptions(item, activeKey) {
		if (!item.length || !activeKey) return;
		// this.selectTags(item);
		this.setState(
			{
				selectedTags: item,
			},
			() => {
				this.onChange(activeKey);
			},
		);
	}

	onTab() {}
	onTabEnd() {}
	mouseEnterTab(item, index) {
		this.onTab(item, index);
		if (item.sub === '0' || !item.sub) return this.onTabEnd(); // 无分类
		this.getCategory(item.id, index, this.onTabEnd);
	}

	/**
	 * 根据二级分类id获取三级分类数据
	 *
	 * @param {String} id  默认 '2' 图库的id
	 * @param {Number} index 默认 0  全部
	 * @param {Function} callback 默认 false 是否加载图库数据
	 */
	async getCategory(id, index = 0, callback = () => {}) {
		let { menuTabs, activeKey } = this.state;
		let selectTags = []; // 三级初始选中的标签

		// tab没有分类
		if (menuTabs[index] && menuTabs[index].sub === '0') {
			menuTabs[index].categories = [];
		}

		// tab有分类 但没有加载分类信息
		if (menuTabs[index] && !menuTabs[index].categories) {
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
			menuTabs[index].selectTags = selectTags;
			// 刷新菜单的数据
		}

		this.setState(
			{
				menuTabs,
				// selectedTags: selectTags,
			},
			() => {
				callback(selectTags, activeKey);
			},
		);
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
	getMenutabsData(props) {
		const { menuTabs } = this.state;
		const { secondaryMenu = [] } = props.global;
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
		this.getMenutabsData(this.props); // 获取菜单数据
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
