import React, { Component } from 'react';
import { Switch } from 'dva/router';
import Header from './Header/Header';
import SubRoutes, { RedirectRoute, NoMatchRoute } from '../utils/SubRoute';
import './global.less';
import { connect } from 'dva';
// import Footer from './common/footer/index';
// const { Header, Footer, Sider, Content } = Layout; //全局样式覆盖

@connect()
class index extends Component {
	render() {
		const { routes, app } = this.props;
		// if (!this.state.menus.length) return null;
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
	componentDidMount() {
		this.props.dispatch({
			type: 'menus/setMenus',
		});
	}
	componentWillUnmount() {
		this.setState = (state, callback) => {
			return;
		};
	}
}

export default index;
