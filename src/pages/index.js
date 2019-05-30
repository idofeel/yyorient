
import React from 'react';
import { connect } from 'dva';
import { Row } from 'antd';
import { Switch, Route, Redirect } from 'dva/router';
// import styles from './index.less';
// import NavBar from './NavBar';
import Header from './Header/Header';

// const { Header, Content, Footer, Sider } = Layout;
// 页面基础结构

import Home from './PhotoGallery/PhotoGallery';
import Zone from './YZone/YZone';
import YVideo from './YVideo/YVideo';
import YCity from './YCity/YCity';
import Famous from './Famous/Famous';

function IndexPage(props) {
  return (
    <Row >
      <Header {...props} />
      {/* 一级路由 */}
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/zone" exact component={Zone} />
        <Route path="/city" exact component={YCity} />
        <Route path="/video" exact component={YVideo} />
        <Route path="/famous" exact component={Famous} />
        <Redirect to="/" />
      </Switch>
    </Row>

  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
