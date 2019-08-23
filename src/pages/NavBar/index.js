import React, { Component } from 'react';
import { Menu } from 'antd';
import { Link } from 'dva/router';
import styles from './index.less';
import { get } from '../../utils/request';
import { connect } from 'dva';
import api from '../../services/api';
import routerKeys from '../common/PageConfig';

@connect()
class NavBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			menus: [],
		};
		this.menus = [];
	}
	render() {
		const { menus } = this.state;
		const selectedKeys = this.setSelectKeys(
			this.props.location.pathname || 'home',
		);
		return (
			<nav className={styles.navbar}>
				<Menu
					className={styles.navmenu}
					mode="horizontal"
					// defaultSelectedKeys={selectedKeys}
					selectedKeys={[selectedKeys]}>
					{menus.map(({ key, path, name, className }) => (
						<Menu.Item key={key} className={className}>
							<Link to={path}>{name}</Link>
						</Menu.Item>
					))}
				</Menu>
			</nav>
		);
	}

	async componentDidMount() {
		let { menus = [] } = this.props;
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
					type: 'global/menus',
					payload: { menus, secondaryMenu },
				});
			}
		}
		this.setState({
			menus,
		});
	}

	getMenuData(item) {
		const key = routerKeys[item.id] || 'home';
		return {
			...item,
			path: '/' + key,
			key,
			name: item.name,
		};
	}
	// 二级分类菜单数据
	secondaryMenu(item) {
		if (!item.sub && !item.sub.length) return [];
		item.sub.unshift({
			name: '全部',
			id: item.id,
			categories: [],
		});
		return item.sub;
	}

	setSelectKeys(pathname) {
		const path = pathname.split('/'),
			key = path && !path[1] ? 'home' : path[1];
		return key;
	}

	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
}

export default connect(({ global }) => ({ ...global }))(NavBar);
