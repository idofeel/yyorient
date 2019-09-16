import { Switch } from 'dva/router';
import SubRoutes, { RedirectRoute } from '../../utils/SubRoute';
function Famous({ routes, app }) {
	return (
		<Switch>
			{routes.map((route, i) => (
				<SubRoutes key={i} {...route} app={app} />
			))}
			<RedirectRoute from={'/famous'} routes={routes} />
		</Switch>
	);
}
export default Famous;
