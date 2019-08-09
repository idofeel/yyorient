import React from 'react'
import { Route, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';

import NoMatch from '../components/NoMatch';


// 动态加载路由

const dynamicComponent = ({ app, model, component, routes }) =>
    dynamic({
        app,
        models: () => model,
        component: () => component().then(res => {
            const Component = res.default || res;
            return props => <Component {...props} app={app} routes={routes} />
        })
    });


export default ({ routes, app, component, model }) => {
    return <Route component={dynamicComponent({ app, model, component, routes })} />
}


// 将路由 / 指向RoutersConfig中的第一个
export function RedirectRoute({ routes, from, exact }) {
    // console.log(routes, from, exact)
    const redirect = routes.filter(item => item.redirect);
    const to = redirect.length ? redirect[0].path : routes[0].path;
    return (
        <Redirect exact={exact} from={from} to={to} />
    )
}

// 未找到页面
export function NoMatchRoute({ status = 404 }) {
    return <Route render={props => <NoMatch {...props} status={status} />} />;
}
