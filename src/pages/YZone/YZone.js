import React, { Component } from 'react';
import { connect } from 'dva';
import Page from '../common/Page';
import PageConfig from '../common/PageConfig';
import { Typography, Card } from 'antd';

import './yzone.less';

const { Title } = Typography;
@connect()
class YZone extends Page {
	constructor(props) {
		super(props);
	}
	pageId = '3'; // 图库页对应名称
	pageName = PageConfig[this.pageId]; // 图库页对应名称
	renderBody() {
		const { selectedTags = [] } = this.state;
		const specialTitle = selectedTags.indexOf('16') > -1;
		return (
			<div className="yyZone">
				<Special
					title={
						specialTitle ? (
							<div className="pageTitle">
								<h3>空间精选</h3>
								<h4>···· SPECIAL ····</h4>
							</div>
						) : null
					}
					onClick={(item, index) => {
						console.log(item, index);
					}}
				/>
			</div>
		);
	}

	selectTags(tagsId) {
		this.setState({ loading: false });
	}
}

function Special(props) {
	const { titile = null } = props;
	return (
		<div className="specialPage">
			{props.title}
			<ZoneItem {...props} />
		</div>
	);
}

class ZoneItem extends Component {
	static defaultProps = {
		onClick: () => {},
	};

	render() {
		const {
			source = [
				{ title: '名家讲坛', desc: '写意花鸟专题', img: '' },
				{ title: '名家讲坛', desc: '写意花鸟专题', img: '' },
				{ title: '名家讲坛', desc: '写意花鸟专题', img: '' },
				{ title: '名家讲坛', desc: '写意花鸟专题', img: '' },
				{ title: '名家讲坛', desc: '写意花鸟专题', img: '' },
				{ title: '名家讲坛', desc: '写意花鸟专题', img: '' },
			],
		} = this.props;
		return (
			<div className="zoneItemContainer">
				{source.map((item, index) => (
					<Card
						key={index}
						className="zoneItem"
						onClick={() => {
							this.props.onClick(item, index);
						}}
						title={
							<h3 className="zoneItemTitle">
								{item.title}
								<span> {item.desc}</span>
							</h3>
						}
						bordered={false}>
						<img src={item.img} />
					</Card>
				))}
			</div>
		);
	}
}

export default connect()(YZone);
