import React from 'react';
import { Router, Switch } from 'dva/router';
import SubRoutes from './utils/SubRoute';

// 顶级路由
const RoutersConfig = [
	{
		path: '/',
		component: () => import('./pages'),
		model: [],
		routes: [
			{
				path: '/home',
				component: () => import('./pages/Home/Home'),
				redirect: true,
				model: []
			},
			{
				path: '/photo',
				component: () => import('./pages/PhotoGallery/PhotoGallery'),
				model: []
			},
			{
				path: '/zone',
				component: () => import('./pages/YZone/YZone'),
				header: false,
				model: []
			},
			{
				path: '/city',
				component: () => import('./pages/YCity/YCity'),
				model: []
			},
			{
				path: '/video',
				component: () => import('./pages/YVideo/YVideo'),
				model: []
			},
			{
				path: '/famous',
				component: () => import('./pages/Famous/Famous'),
				model: []
			},
			{
				path: '/login',
				component: () => import('./pages/User/login'),
				model: []
			},
			{
				path: '/register',
				component: () => import('./pages/User/register'),
				model: []
			}

		]

	}
];


function RouterConfig({ history, app }) {
	return (
		<Router history={history}>
			<Switch>
				{RoutersConfig.map((route, i) => <SubRoutes key={i} {...route} app={app} />)}
			</Switch>
		</Router>
	);
}

export default RouterConfig;
