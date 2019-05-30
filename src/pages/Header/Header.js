import React, { Component } from 'react'
import { Row, Col, Input, Icon } from 'antd';
import NavBar from '../NavBar/index';
import style from './header.less';

const Search = Input.Search;

export default (props) => {
    return (
        <header className={style.header}>
            <Row type="flex" justify="space-around" align="middle">
                <Col xs={8} sm={6} md={5} lg={4} xl={3} className={style.logo}>
                    <img src={require('../../assets/logo.png')} />
                </Col>
                <Col xs={10} sm={13} md={15} lg={16} xl={17}>
                    <NavBar {...props} />
                </Col>
                <Col xs={6} sm={5} md={4} lg={4} xl={3}>
                    <Col xs={24} sm={20} md={18} lg={16} xl={14}>
                        <Search
                            size="small"
                            placeholder=""
                            onSearch={value => console.log(value)} enterButton />
                    </Col>
                    <Col span="24">
                        <Icon type="user" className={style.icon} /><span>登录/注册</span>

                    </Col>
                </Col>
            </Row>
        </header>
    )
}
