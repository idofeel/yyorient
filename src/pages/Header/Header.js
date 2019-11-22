import React from 'react';
import { Row, Col, Input, Icon, Avatar } from 'antd';
import NavBar from '../NavBar/index';
import logo from 'images/logo.png';
import style from './header.less';
import { Link } from 'dva/router';
import { connect } from 'dva';

const Search = Input.Search;
@connect(({menus})=>({menus}))
class yyHeader extends React.Component {
	render() {
		const { isLogin = false } = this.props;
		return (
			<header className={style.header}>
				<Row type='flex' justify='space-around' align='middle'>
					<Col
						xs={8}
						sm={6}
						md={5}
						lg={4}
						xl={3}
						className={style.logo}>
						<Link to='/'>
							<img
								src={logo}
								title='雅韵东方官网'
								alt='雅韵东方官网'
							/>
						</Link>
					</Col>
					<Col xs={10} sm={13} md={15} lg={16} xl={17}>
						<NavBar {...this.props} />
					</Col>
					<Col xs={6} sm={5} md={4} lg={4} xl={4}>
						<Col xs={24} sm={20} md={18} lg={16} xl={14}>
							<Search
								size='small'
								placeholder=''
								onSearch={(value) => console.log(value)}
								enterButton
								className='searchIcon'
							/>
						</Col>
						<Col span={24}>
							{isLogin ? (
								<>
									<Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
									<span>{this.props.uname}</span>
								</>
							) : (
								<>
									<Icon type='user' className={style.icon} />
									<Link to='/login'>登录</Link>
									<span>/</span>
									<Link to='/register'>注册</Link>
								</>
							)}
						</Col>
					</Col>
				</Row>
			</header>
		);
	}
	
}

export default yyHeader;
