import React from 'react';
import { connect } from 'dva';
import { Switch } from 'dva/router';
import Header from './Header/Header';
import SubRoutes, { RedirectRoute, NoMatchRoute } from '../utils/SubRoute';
import './global.less';
// const { Header, Footer, Sider, Content } = Layout; //全局样式覆盖
function Index(props) {
    const { routes, app } = props;
    return (
        <>
            <Header {...props} />
            {/* 一级路由 */}
            <Switch>
                {routes.map((route, i) => (
                    <SubRoutes key={i} {...route} app={app} />
                ))}
                <RedirectRoute exact={true} from={'/'} routes={routes} />
                <NoMatchRoute />
            </Switch>
        </>
    );
}

Index.propTypes = {};

export default connect()(Index);
