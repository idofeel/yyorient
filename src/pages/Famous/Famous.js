import { Switch } from 'dva/router';
import SubRoutes, { RedirectRoute } from '../../utils/SubRoute';
import { connect } from 'dva';
import Page from '../common/Page';

@connect()
class Famous extends Page {
	constructor(props) {
		super(props);
	}
	pageName = '5'; // 图库页对应名称
	pageName = 'famous'; // 图库页对应名称

	renderBody() {
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
export default connect(({ global }) => ({ ...global }))(Famous);
