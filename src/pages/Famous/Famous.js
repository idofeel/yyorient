import { Switch } from 'dva/router';
import SubRoutes, { RedirectRoute } from '../../utils/SubRoute';
import { connect } from 'dva';
import api from '../../services/api';
import { get } from '../../utils/request';
import { Component } from 'react';
@connect()
class Famous extends Component {
	constructor(props) {
		super(props, {
			loadend: false,
			tempRoute: props.routes,
		});
	}

	pageId = '5'; // 图库页对应名称
	pageName = 'famous'; // 图库页对应名称

	render() {
		const { routes, app } = this.props;
		return (
			<Switch>
				{routes.map((route, i) => (
					<SubRoutes key={i} {...route} app={app} />
				))}
				<RedirectRoute from={'/famous'} routes={routes} />
			</Switch>
		);
	}
}

export default connect()(Famous);
