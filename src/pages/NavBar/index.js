import React, { Component } from 'react';
import { Menu } from 'antd';
import { Link } from 'dva/router';
import styles from './index.less';
import { connect } from 'dva';

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
					mode='horizontal'
					// defaultSelectedKeys={selectedKeys}
					selectedKeys={[selectedKeys]}>
					{topCategory.map(({ key, path, name, className }) => (
						<Menu.Item
							key={key}
							className={className}
							onClick={() => {
								this.props.dispatch({
									type: 'menus/removeCategories',
									payload: key,
								});
								this.props.history.push(path);
							}}>
							{name}
						</Menu.Item>
					))}
				</Menu>
			</nav>
		);
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

export default NavBar;
