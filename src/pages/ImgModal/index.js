import React from 'react';
import { Modal, Button, Icon } from 'antd';
import PicView from '../../components/PictureViewer';
import './index.less';

/**
 * 带modal的查看器
 */

class ModalPic extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: props.visible || false
        }
    }

    render() {
        return <Modal
            footer={null}
            visible={this.state.visible || false}
            onOk={this.hideModal.bind(this)}
            onCancel={this.hideModal.bind(this)}
            okButtonProps={null}
            maskClosable={false}
            width={this.props.width || "100%"}
            wrapClassName={this.props.wrapClassName || "modalWarp"}
            className="modalpic"
            style={this.props.style}
            bodyStyle={{ height: '100%', padding: 0 }}
            cancelButtonProps={<Icon type="left" />}
        >
            {this.state.visible && <PicView
                uri={this.props.uri}
                options={this.props.options}
            />}
        </Modal>
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.state.visible !== nextProps.visible && this.setState(nextProps);
    }

    hideModal(e) {
        this.setState({
            visible: false
        });
        return false;
    }

}
export default ModalPic;