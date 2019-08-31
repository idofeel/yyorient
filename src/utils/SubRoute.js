/**
 * 路由组件
 * subRoute 子路由组件
 * RedirectRoute 重定向路由组件
 * NoMatchRoute 未匹配路由组件
 */

import React from 'react';
import { Route, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';
import NoMatch from '../components/NoMatch';
import { connect } from 'dva';
// 动态加载路由
const dynamicComponent = ({
	app,
	model: models,
	component,
	routes,
	authorty,
	global,
	parmas,
}) =>
	dynamic({
		app,
		models: () => models,
		component: () =>
			component().then((res) => {
				const Component = res.default || res;
				if (authorty) {
					return () => <Redirect to={'/login'} />;
				}
				return (props) => (
					<Component
						{...props}
						app={app}
						routes={routes}
						global={global}
						parmas={parmas}
					/>
				);
			}),
	});

// 子路由组件
function SubRoutes(props) {
	return <Route component={dynamicComponent(props)} />;
}

//  重定向路由组件
// 将路由 / 指向RoutersConfig中的第一个
export function RedirectRoute({ routes, from, exact }) {
	const redirect = routes.filter((item) => item.redirect);
	const to = redirect.length ? redirect[0].path : routes[0].path;
	return <Redirect exact={exact} from={from} to={to} />;
}

// 未匹配路由组件
export function NoMatchRoute({ status = 404 }) {
	return <Route render={(props) => <NoMatch {...props} status={status} />} />;
}

// 链接
export default connect(({ global }) => ({ global }))(SubRoutes);
