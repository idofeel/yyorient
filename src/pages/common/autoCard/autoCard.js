import React, { Component } from 'react';
import { Card } from 'antd';
import './autoCard.less';
const { Meta } = Card;

class AutoCard extends Component {
	static defaultPros = {
		source: [{ meta: [] }],
		renderMeta: () => null,
		itemClick: () => {},
		cardCover: true,
		ItemStyle: {},
		bodyStyle: {},
		coverStyle: {},
	};
	render() {
		const {
			source = [],
			// metaDesc = [],
			itemClick = () => {},
			renderMeta = () => null,
			cardCover = true,
			ItemStyle = {},
			bodyStyle = {},
			coverStyle = {},
		} = this.props;
		return (
			<div className="autoCard" style={bodyStyle}>
				{source.map((item, index) => (
					<Card
						key={index}
						className="cardItem"
						style={ItemStyle}
						bordered={true}
						hoverable={true}
						onClick={() => itemClick(item, index)}
						cover={
							cardCover ? (
								<div className="cover" style={coverStyle}>
									<div className="cardCover">
										<img alt={item.name} src={item.img} />
									</div>
								</div>
							) : null
						}>
						{item.meta && (
							<Meta description={renderMeta(item, index)} />
						)}
					</Card>
				))}
			</div>
		);
	}
}

export default AutoCard;
