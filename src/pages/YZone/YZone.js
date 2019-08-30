import { connect } from 'dva';
import Page from '../common/Page';
import PageConfig from '../common/PageConfig';

@connect()
class YZone extends Page {
	constructor(props) {
		super(props);
	}
	pageId = '3'; // 图库页对应名称
	pageName = PageConfig[this.pageId]; // 图库页对应名称
	renderBody() {
		return null;
	}

	selectTags(tagsId) {
		console.log(tagsId);
	}
}
export default connect()(YZone);
