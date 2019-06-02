import React, { Component } from 'react'
import { Menu } from 'antd';
import { Link } from 'dva/router';
import styles from './index.less';

const menus = [
    {
        key: 'home',
        path: '/home',
        name: '图库',
    },
    {
        key: 'zone',
        path: '/zone',
        name: '空间'
    },
    {
        key: 'video',
        path: '/video',
        name: '视频'
    },

    {
        key: 'famous',
        path: '/famous',
        name: '名家'
    },
    {
        key: 'city',
        path: '/city',
        name: '城市'
    },
];

export default class NavBar extends Component {

    render() {
        const selectedKeys = this.setSelectKeys(this.props.location.pathname || 'home');
        return (
            <nav className={styles.navbar}>
                <Menu
                    className={styles.navmenu}
                    mode="horizontal"
                    // defaultSelectedKeys={selectedKeys}
                    selectedKeys={[selectedKeys]}
                >
                    {menus.map(({ key, path, name, className }) => (
                        <Menu.Item key={key} className={className}>
                            <Link to={path}>{name}</Link>
                        </Menu.Item>
                    ))}
                </Menu>

            </nav>
        )
    }
    setSelectKeys(pathname) {
        const path = pathname.split('/'),
            key = path && !path[1] ? 'home' : path[1];
        return key;
    }

}
