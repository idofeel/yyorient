import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'dva/router';
import SubRoutes, { RedirectRoute } from '../../utils/SubRoute';
import { Tabs } from 'antd';
import asyncComponent from '../../utils/asyncComponent';

const { TabPane } = Tabs;
const VideoCollect = asyncComponent(() => import('./videoCollect'));
const PhotoCollect = asyncComponent(() => import('./photoCollect'));
const Center = asyncComponent(() => import('./center'));

export default class Index extends Component {
	constructor(props) {
		super(props);
		const { routes, app, location, history } = props;
		const { pathname } = location;
		const components = this.getPathName(routes, pathname);

		if (!components.component) {
			history.push(routes[routes.length - 1].path);
		}
		this.state = {
			pathname,
			component: components.component,
		};
	}

	render() {
		if (!this.state.component) return null;
		const { routes, app, location, history } = this.props;
		const { pathname } = location;
		const currentKey = pathname;
		return (
			<>
				<Tabs
					defaultActiveKey={currentKey}
					onChange={(key) => {
						this.setState({
							component: this.getPathName(routes, key).component,
						});
						window.history.replaceState({}, 0, '#' + key);
					}}>
					{routes.map((item) => (
						<TabPane tab={item.title} key={item.path} />
					))}
				</Tabs>

				{this.renderCompontent(this.state.component)}
			</>
		);
	}

	getPathName(routes, pathname) {
		return routes.filter((i) => i.path === pathname)[0] || {};
	}
	renderCompontent(c) {
		const Component = asyncComponent(c);
		return <Component />;
	}

}
