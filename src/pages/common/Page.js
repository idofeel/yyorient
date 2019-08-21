import React, { Component } from 'react';
import SecondayClassfiy from '../../components/SecondayClassfiy/SecondayClassfiy';
import api from '../../services/api';
import { get } from '../../utils/request';
import { Spin, Empty } from 'antd';
import './page.less';
/**
 * 菜单和分类
 *
 *
 * 根据 pageName 获取菜单数据
 *
 * renderBody(){}
 *
 */

class Page extends Component {
	constructor(props, state) {
		super(props);
		const { secondaryMenu = [] } = props;
		const menuTabs = secondaryMenu[this.pageName] || [];
		this.state = {
			menuTabs,
			...state,
		};
	}
	loadMenu = true; // 是否加载菜单
	loading = false; //页面loading状态
	empty = false; //页面empty展示的状态
	pageId = '0'; // 图库页对应id
	pageName = 'home'; // 图库页对应名称

	render() {
		const { loading, empty } = this;
		return (
			<div className="yyPage">
				{this.loadMenu && this.renderMenu()}
				{
					<>
						<Spin spinning={loading} size="large" />
						{empty ? (
							<Empty
								image={Empty.PRESENTED_IMAGE_SIMPLE}
								description="暂无数据"
							/>
						) : (
							this.renderBody()
						)}
					</>
				}
			</div>
		);
	}

	renderMenu() {
		const { menuTabs } = this.state;
		return (
			<SecondayClassfiy
				tabs={menuTabs}
				onChange={(index) => this.onChange(index)}
				mouseEnterTab={(item, index) => this.mouseEnterTab(item, index)}
				selectOptions={(item) => this.selectOptions(item)}
			/>
		);
	}

	renderBody() {} // 渲染body 数据
	onChange() {} //

	selectTags() {}
	selectOptions(item = []) {
		if (!item.length) return;
		this.selectTags(item);
	}

	onTab() {}
	onTabEnd() {}
	mouseEnterTab(item, index) {
		this.onTab(item, index);
		this.getCategory(item.id, index, this.onTabEnd);
	}

	/**
	 * 根据二级分类id获取三级分类数据
	 *
	 * @param {String} id  默认 '2' 图库的id
	 * @param {Number} index 默认 0  全部
	 * @param {Function} callback 默认 false 是否加载图库数据
	 */
	async getCategory(id = this.pageId, index = 0, callback = () => {}) {
		let { menuTabs } = this.state;
		// tab 没有加载分类信息
		if (menuTabs[index] && !menuTabs[index].categories) {
			//  获取分类信息
			let categories = []; // 三级分类数据
			let selectTags = []; // 三级初始选中的标签
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
			this.setState(
				{
					menuTabs,
				},
				() => callback,
			);
		}
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
		let tabs = props.secondaryMenu[this.pageName] || [];
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
		this.getCategory(this.pageId, 0); // 初始加载分类数据
		this.onLoad();
	}

	// 组件已加载
	onReady() {}
	componentDidMount() {
		this.onReady();
	}

	// 组件接收参数
	onReceive() {}
	UNSAFE_componentWillReceiveProps(nextProps) {
		this.getMenutabsData(nextProps);
		this.onReceive();
	}

	// 组件卸载
	onWillUnmount() {}
	componentWillUnmount() {
		this.onWillUnmount();
		this.setState = (state, callback) => {
			return;
		};
	}
}

export default Page;
