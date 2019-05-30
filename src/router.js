// 根路由
import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import index from './pages';


function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" component={index} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
