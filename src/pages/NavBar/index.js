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
		const { menus = [] } = props.global || {};
		this.state = {
			menus,
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

	// goPage(path) {
	// 	// console.log(this.props.location.pathname === path);
	// 	// if (this.props.location.pathname === path) return;
	// 	this.props.history.push(path);
	// }

	getMenuData(item) {
		const key = routerKeys[item.id] || 'home';
		return {
			...item,
			path: '/' + key,
			key,
			name: item.name,
		};
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

export default connect()(NavBar);
