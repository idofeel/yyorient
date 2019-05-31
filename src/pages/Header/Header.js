import React, { Component } from 'react'
import { Row, Col, Input, Icon } from 'antd';
import NavBar from '../NavBar/index';
import logo from 'images/logo.png'
import style from './header.less';
import { Link } from 'dva/router';
const Search = Input.Search;

export default (props) => {
    return (
        <header className={style.header}>
            <Row type="flex" justify="space-around" align="middle">
                <Col xs={8} sm={6} md={5} lg={4} xl={3} className={style.logo}>
                    <img src={logo} title="雅韵东方官网" />
                </Col>
                <Col xs={10} sm={13} md={15} lg={16} xl={17}>
                    <NavBar {...props} />
                </Col>
                <Col xs={6} sm={5} md={4} lg={4} xl={4}>
                    <Col xs={24} sm={20} md={18} lg={16} xl={14}>
                        <Search
                            size="small"
                            placeholder=""
                            onSearch={value => console.log(value)}
                            enterButton />
                    </Col>
                    <Col span={24}>
                        <Icon type="user" className={style.icon} />
                        <Link to="/login">登录</Link>
                        <a href="javascript:;">/</a>
                        <Link to="/register">注册</Link>
                    </Col>
                </Col>
            </Row>
        </header>
    )
}
