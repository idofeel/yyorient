// 根路由
import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import SubRoutes from './utils/SubRoute';

import index from './pages';

import Home from './pages/PhotoGallery/PhotoGallery';
import Zone from './pages/YZone/YZone';
import YVideo from './pages/YVideo/YVideo';
import YCity from './pages/YCity/YCity';
import Famous from './pages/Famous/Famous';
import Login from './pages/User/login';
import Register from './pages/User/register';



const RoutersConfig = [
	{
		path: '/',
		component: index,
		routes: [
			{
				path: '/home',
				component: Home,
				redirect: true
			},
			{
				path: '/zone',
				component: Zone
			},
			{
				path: '/city',
				component: YCity
			},
			{
				path: '/video',
				component: YVideo,
			},
			{
				path: '/famous',
				component: Famous,
			},
			{
				path: '/login',
				component: Login,
			},
			{
				path: '/register',
				component: Register,
			}

		]

	}
];


function RouterConfig({ history }) {
	return (
		<Router history={history}>
			<Switch>
				{RoutersConfig.map((route, i) => <SubRoutes key={i} {...route} />)}
			</Switch>
		</Router>
	);
}

export default RouterConfig;
