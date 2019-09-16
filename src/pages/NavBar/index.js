import React, { Component } from 'react';
import { Menu } from 'antd';
import { Link } from 'dva/router';
import styles from './index.less';
import routerKeys from '../common/PageConfig';

class NavBar extends Component {
	render() {
		const { topCategory = [] } = this.props.menus || {};
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
					{topCategory.map(({ key, path, name, className }) => (
						<Menu.Item key={key} className={className}>
							<Link to={path}>{name}</Link>
						</Menu.Item>
					))}
				</Menu>
			</nav>
		);
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

	// shouldComponentUpdate() {
	// 	console.log(...arguments);

	// 	return true;
	// }
}

export default NavBar;
