import React, { Component } from 'react';
import { Modal, Drawer, Icon } from 'antd';
import { DescList, DetailCarousel } from '../BannerList/BannerList';

import './fullscreenModal.less';

class FullscreenModal extends Component {
	static defaultProps = {
		title: '',
		detailData: [],
	};

	constructor(props) {
		super(props);
		const { detailData } = props;
		this.state = {
			translateY: 0,
			dataSource: [
				{
					currentIndex: 1,
					totalLen: detailData.length,
					title: props.title,
					desc: (detailData[0] && detailData[0].desc) || '',
				},
			],
		};
		console.log(window.innerWidth);

		this.resizeBind = this.resize.bind(this); //绑定窗口改变事件
	}

	render() {
		const { title, detailData, visible, onCancel = () => {} } = this.props;
		const { translateY, dataSource } = this.state;
		if (!detailData.length) return null;
		return (
			<Modal
				visible={visible}
				title={title}
				width={'100%'}
				mask={false}
				style={{
					paddingBottom: translateY,
				}}
				bodyStyle={{ background: '#000' }}
				footer={null}
				title={null}
				closable={false}
				centered={true}
				wrapClassName='Ymodal'
				onCancel={() => onCancel()}
				maskClosable={true}>
				<Icon
					type='close'
					className='modalClose'
					onClick={() => onCancel()}
				/>
				<DetailCarousel
					source={detailData}
					title={title}
					height={window.innerHeight + 'px'}
					beforeChange={(prev, next) => {
						this.setState(
							{
								dataSource: [
									{
										currentIndex: next + 1,
										totalLen: detailData.length,
										title,
										desc: detailData[next].desc,
									},
								],
							},
							() => this.setTransLate(),
						);
					}}
				/>
				<Drawer
					title={null}
					placement={'bottom'}
					closable={false}
					mask={false}
					height='auto'
					className='yDrawer'
					onClose={this.onClose}
					afterVisibleChange={(visible) =>
						visible && this.setTransLate()
					}
					visible={visible}>
					<div ref={(ref) => (this.drawerDom = ref)}>
						<DescList dataSource={dataSource} />
					</div>
				</Drawer>
			</Modal>
		);
	}

	componentDidMount() {
		console.log(window.innerWidth);
		this.screenChange(); // 监听屏幕改变
	}

	setTransLate() {
		this.setState({
			translateY: this.getDrawerHeight().height,
		});
	}

	getDrawerHeight() {
		const { clientWidth = 0, clientHeight = 0 } = this.drawerDom || {};
		console.log(clientHeight);
		return {
			width: clientWidth,
			height: clientHeight,
		};
	}

	resize() {
		this.setTransLate();
	}
	// 监听窗口发生改变
	screenChange() {
		window.addEventListener('resize', this.resizeBind);
	}

	componentWillUnmount() {
		// 销毁监听事件
		window.removeEventListener('resize', this.resizeBind);
	}
}

export default FullscreenModal;
