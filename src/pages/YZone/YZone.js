import { Switch } from 'dva/router';
import SubRoutes, { RedirectRoute } from '../../utils/SubRoute';

function YZone(props) {
	const { routes, app } = props;
	return (
		<Switch>
			{routes.map((route, i) => (
				<SubRoutes key={i} {...route} app={app} />
			))}
			<RedirectRoute from={'/zone'} routes={routes} />
		</Switch>
	);
}
export default YZone;
