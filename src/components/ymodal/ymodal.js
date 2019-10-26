import React, { Component } from 'react';
import { Modal } from 'antd';
import './ymodal.less';
class YModal extends Component {
	render() {
		return (
			<Modal
				wrapClassName="yymodal"
				width="100%"
				bodyStyle={{ padding: 0 }}
				footer={null}
				maskClosable={false}
				destroyOnClose={true}
				centered={true}
				maskStyle={{ background: 'rgba(0,0,0,0.9)' }}
				{...this.props}
			/>
		);
	}
}

export default YModal;
