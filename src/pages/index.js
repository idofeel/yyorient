
import React from 'react';
import { connect } from 'dva';
import { Row } from 'antd';
import { Switch } from 'dva/router';
import Header from './Header/Header';
import SubRoutes, { RedirectRoute, NoMatchRoute } from '../utils/SubRoute';

function IndexPage(props) {
  const { routes } = props;
  return (
    <Row >
      <Header {...props} />
      {/* 一级路由 */}
      <Switch>
        {routes.map((route, i) => <SubRoutes key={i} {...route} />)}
        <RedirectRoute exact={true} from={"/"} routes={routes} />
        <NoMatchRoute />
      </Switch>
    </Row>

  );
}


IndexPage.propTypes = {
};

export default connect()(IndexPage);
