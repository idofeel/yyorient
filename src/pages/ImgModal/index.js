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
        const { visible = false } = props;
        this.state = {
            visible: visible
        }
    }
    dataSource = [];

    UNSAFE_componentWillMount() {
        // 请求数据
        let dataSource = [
            {
                sizeid: '01x',
                imgw: 250,
                imgh: 82,
                rows: 1,
                cols: 1,
                wmax: 250,
                hmax: 82,
                baseurl: './',
                imgid: 'abcdef'
            },
            {
                sizeid: '05x',
                imgw: 1445,
                imgh: 480,
                rows: 1,
                cols: 1,
                wmax: 1445,
                hmax: 480,
                baseurl: './',
                imgid: 'abcdef'
            },
            {
                sizeid: '1x',
                imgw: 4337,
                imgh: 1440,
                rows: 1,
                cols: 1,
                wmax: 4337,
                hmax: 1440,
                baseurl: './',
                imgid: 'abcdef'
            },
            {
                sizeid: '2x',
                imgw: 6299,
                imgh: 2091,
                rows: 9,
                cols: 25,
                wmax: 255,
                hmax: 255,
                baseurl: './',
                imgid: 'abcdef'
            }
        ];
        dataSource.splice(0, 1);
        this.dataSource = dataSource;
    }

    render() {
        return <Modal
            footer={null}
            visible={this.state.visible}
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
            destroyOnClose={this.state.visible}
        >
            <PicView
                uri={this.props.uri}
                options={this.props.options}
                drawerChange={(isShow) => {
                    isShow ? this.rmShowPop() : this.showPop();
                }}
                visible={this.state.visible}
                dataSource={this.dataSource}
            />
        </Modal>
    }



    stopScroll(e) {
        e.preventDefault();
    }
    showPop() {
        document.body.addEventListener("touchmove", this.stopScroll, { passive: false });
    }
    rmShowPop() {
        document.body.removeEventListener("touchmove", this.stopScroll, { passive: true });
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.visible) {
            this.showPop();
        } else {
            this.rmShowPop();
        }
        // console.log(...arguments)
        return true;
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