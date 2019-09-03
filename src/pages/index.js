import React, { Component } from 'react';
import { Switch } from 'dva/router';
import Header from './Header/Header';
import SubRoutes, { RedirectRoute, NoMatchRoute } from '../utils/SubRoute';
import './global.less';
import { connect } from 'dva';
import { get } from '../utils/request';
import api from '../services/api';
import PageConfig from './common/PageConfig';
import Footer from './common/footer/index';
// const { Header, Footer, Sider, Content } = Layout; //全局样式覆盖
@connect()
class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			menus: [],
		};
	}
	render() {
		const { routes, app } = this.props;
		if (!this.state.menus.length) return null;
		return (
			<>
				<Header {...this.props} />
				{/* 一级路由 */}
				<Switch>
					{routes.map((route, i) => (
						<SubRoutes key={i} {...route} app={app} />
					))}
					<RedirectRoute exact={true} from={'/'} routes={routes} />
					<NoMatchRoute />
				</Switch>
				{/* <Footer /> */}
			</>
		);
	}
	async UNSAFE_componentWillMount() {
		const { global = { menus: [] } } = this.props;
		let { menus = [] } = global;
		if (!menus.length) {
			const res = await get(api.menus);
			if (res.success) {
				let secondaryMenu = {}; // 二级菜单 keys 对应路由
				// 初始加载 一级菜单、二级菜单数据
				menus = res.data.map(this.getMenuData);
				menus.map(
					(item) =>
						(secondaryMenu[item.key] = this.secondaryMenu(item)),
				);

				this.props.dispatch({
					type: 'global/setmenus',
					payload: { menus, secondaryMenu },
				});
				console.log('获取菜单数据', new Date());
			}
		}
		this.setState({ menus });
	}

	getMenuData(item) {
		const key = PageConfig[item.id] || 'home';
		return {
			...item,
			path: '/' + key,
			key,
			name: item.name,
		};
	}
	// 二级分类菜单数据
	secondaryMenu(item = {}) {
		if (!item.sub && !item.sub.length) return item;
		// if (!item.sub || !item.sub.length) return {};
		// item.sub.unshift({
		// 	name: '全部',
		// 	id: item.id,
		// 	categories: [],
		// });
		return item.sub;
	}
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
}

export default connect()(index);
