import { connect } from 'dva';
import Page from '../common/Page';
@connect()
class YVideo extends Page {
	constructor(props) {
		super(props);
	}
	pageId = '4'; // 图库页对应id
	pageName = 'video'; // 图库页对应名称

	renderBody() {
		return null;
	}
}
export default connect(({ global }) => ({ ...global }))(YVideo);
