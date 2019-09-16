import React from 'react';
import { Router, Switch } from 'dva/router';
import SubRoutes from './utils/SubRoute';

const authorty = false;
// 顶级路由
const RoutersConfig = [
	{
		path: '/',
		component: () => import('./pages'),
		model: [import('./models/menus')],
		routes: [
			{
				path: '/test',
				component: () => import('./pages/TestPage'),
				model: [],
			},
			{
				path: '/home',
				component: () => import('./pages/Home/Home'),
				model: [],
				redirect: true,
			},
			{
				path: '/photo',
				component: () => import('./pages/PhotoGallery/PhotoGallery'),
				model: [],
			},
			{
				path: '/zone',
				component: () => import('./pages/YZone/YZone'),
				authorty,
				model: [],
				routes: [
					{
						path: '/zone/list',
						model: [],
						component: () => import('./pages/YZone/list/ZoneList'),
					},
					{
						path: '/zone/detail',
						model: [],
						component: () =>
							import('./pages/YZone/detail/ZoneDetail'),
					},
				],
			},
			{
				path: '/city',
				component: () => import('./pages/YCity/YCity'),
				authorty,
				model: [],
			},
			{
				path: '/video',
				component: () => import('./pages/YVideo/YVideo'),
				authorty,
				model: [],
			},
			{
				path: '/famous',
				component: () => import('./pages/Famous/Famous'),
				authorty,
				model: [],
				routes: [
					{
						path: '/famous/list',
						model: [import('./models/famous_model')],
						component: () => import('./pages/Famous/FamousList'),
					},
					{
						path: '/famous/detail',
						model: [],
						component: () => import('./pages/Famous/FamousDetails'),
					},
				],
			},
			{
				path: '/login',
				component: () => import('./pages/User/login'),
				model: [],
			},
			{
				path: '/register',
				component: () => import('./pages/User/register'),
				model: [],
			},
			{
				path: '/profile',
				component: () => import('./pages/User/ProfilePage'),
				model: [],
			},
		],
	},
];

function RouterConfig({ history, app }) {
	console.log('RouterConfig');
	return (
		<Router history={history}>
			<Switch>
				{RoutersConfig.map((route, i) => (
					<SubRoutes key={i} {...route} app={app} />
				))}
			</Switch>
		</Router>
	);
}

export default RouterConfig;
