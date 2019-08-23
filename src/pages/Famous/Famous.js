import { Switch } from 'dva/router';
import SubRoutes, { RedirectRoute } from '../../utils/SubRoute';
import { connect } from 'dva';
import Page from '../common/Page';
import api from '../../services/api';
import { get } from '../../utils/request';
@connect()
class Famous extends Page {
	constructor(props) {
		super(props, {
			loadend: false,
		});
	}

	pageId = '5'; // 图库页对应名称
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

	async selectTags(ids = [this.pageId]) {
		this.setPageStatus({ loading: true, empty: false });

		const nowFamous = await get(api.famous.now, { ids });
		const agoFamous = await get(api.famous.ago, { ids });
		const data = {
			famous: [
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
			],
			agoFamous: [
				{ name: '123' },
				{ name: '123' },
				{ name: '123' },
				{ name: '123' },
				{ name: '123' },
				{ name: '123ddddd' },
				{ name: '123ddddd' },
				{ name: '大叔大叔大叔的' },
				{ name: '123ddddd' },
				{ name: '123ddddd' },
				{ name: '123' },
				{ name: '123' },
				{ name: '123' },
				{ name: '123' },
				{ name: '123' },
				{ name: '123' },
				{ name: '123' },
				{ name: '123' },
			],
		};
		this.setPageStatus({ loading: false, empty: false });
		this.setState({ loadend: true });
		this.props.dispatch({
			type: 'famous/getList',
			payload: data,
		});
	}
}

export default connect(({ global }) => ({ ...global }))(Famous);
