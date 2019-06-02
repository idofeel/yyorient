import React from 'react'
import { Route, Redirect } from 'dva/router';
import NoMatch from '../components/NoMatch';

export default ({ routes, component: Component }) => {
    return (
        <Route render={props => <Component {...props} routes={routes} />} />
    )
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
