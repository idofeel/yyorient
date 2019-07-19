// import React, { Component } from 'react'
import ScaleImg from '../ScaleImg';
import Styles from './index.less'
import { Slider, Icon, Row, Col, Drawer, Descriptions, Button, List, Divider } from 'antd';
// import InfiniteScroll from 'react-infinite-scroller';
/**
 * 基于图片缩放 使用ant design 给图片查看器提供一个工具组件。
 * 
 * 
 */

export default class PictureTool extends ScaleImg {
    constructor(props) {
        const { drawerChange = () => { }, visible = false } = props;
        super(props, {
            ScaleValue: 0, //进度条的值
            hideTools: false, //是否隐藏工具条
            paddingRight: 0, // 进度条右边的填充 （当出现鸟瞰图时设置，留出鸟瞰图显示的距离）
            drawerShow: true,
            visible: visible
        });
        this.drawerChange = drawerChange;
    }


    // data= {
    //     title:'',
    //     author:'',
    // }

    renderTools() {
        const container = this.state.hideTools ? 'sliderRange hideTools' : 'sliderRange';
        return (
            <div className={container} style={{ paddingRight: this.state.paddingRight }}>
                <Row className="toolsBox">
                    <Col md={1} sm={2} xs={3}>
                        <Icon type="home"
                            onClick={this.reset.bind(this)}
                            title="全图显示"
                        />
                    </Col>
                    <Col md={20} sm={16} xs={12} className="tools-scale">
                        <Icon type="minus-circle" onClick={() => { this.ScalePlus(-0.1) }} />
                        <Slider
                            disabled={false}
                            value={this.state.ScaleValue}
                            tooltipVisible={false}
                            onChange={this.dragScale.bind(this)}
                            className="slide_scale"
                        />
                        <Icon type="plus-circle" onClick={() => { this.ScalePlus(0.1) }} />
                    </Col>
                    <Col md={1} sm={2} xs={3}>
                        <Icon type={this.state.fullScreen ? 'fullscreen-exit' : 'fullscreen'}
                            onClick={this.handleFullScreen.bind(this)}
                            title="全屏/退出全屏"
                        />
                    </Col>
                    <Col md={1} sm={2} xs={3}>
                        <Icon type={this.state.hideTools ? 'appstore' : 'border'}
                            className={this.state.hideTools ? 'icon_hideTools showTools' : 'icon_hideTools'}
                            // style={{ right: this.state.paddingRight + 13 + 'px' }}
                            onClick={this.toggleTools.bind(this)}
                            title="隐藏/显示工具栏" />
                    </Col>
                    <Col md={1} sm={2} xs={3}>
                        <Icon type="info-circle"
                            onClick={() => {
                                this.toggleDrawer();
                            }}
                            title="图片简介信息"
                        />
                    </Col>


                </Row>
                {this.renderImgInfo()}
            </div>

        )
    }

    renderImgInfo(info) {
        // console.log(this.props.visible)
        const { visivbleHeight } = this.getVisivbleWidthAndHeight(); //用于动态设置抽屉的 

        const data = [
            {
                title: '作者简介',
                desc: '作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介作者简介'
            },
            {
                title: '作品详情',
                desc: '作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情作品详情'
            }


        ];
        return (
            <div className="imgInfo">
                <Drawer
                    title={
                        <div>
                            作品介绍
                            <Icon type="left" style={{ float: 'right' }} onClick={() => { this.toggleDrawer() }} />
                        </div>
                    }
                    visible={(this.state.drawerShow && this.props.visible)} //
                    mask={false}
                    maskStyle={{ opacity: 0, background: 'none' }}
                    closable={false}
                    placement="left"
                    className="imgDetails"
                    afterVisibleChange={this.drawerChange}
                    zIndex={1000}
                    width={310}
                    bodyStyle={
                        {
                            overflow: 'auto',
                            height: visivbleHeight - 100
                        }
                    }
                    onClose={() => {
                        this.toggleDrawer()
                    }}
                >
                    <Descriptions title="京畿瑞雪图" column={1} className="imgDesc">
                        <Descriptions.Item label="作者">弘忍法师</Descriptions.Item>
                        <Descriptions.Item label="年代">南北朝</Descriptions.Item>
                        <Descriptions.Item label="规格">80*150cm</Descriptions.Item>
                    </Descriptions>

                    <div className="btn-group">
                        <Button type="primary">
                            <Icon type="menu" /> 返回列表
                        </Button>
                        <Button type="primary">
                            <Icon type="heart" /> 添加收藏
                        </Button>
                    </div>
                    <h3 className="imgDescTitle">更多详情</h3>
                    <Divider style={{ margin: '10px 0', }} />
                    <div className="listbox">
                        <List
                            dataSource={data}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.title}
                                        description={item.desc}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>




                </Drawer>
            </div>
        );
    }

    // 切换显示工具栏
    toggleDrawer() {
        this.setState({
            drawerShow: !this.state.drawerShow,
        });
    }

    // 切换显示工具栏
    toggleTools() {
        this.setState({
            aerialShow: !this.state.aerialShow,
            hideTools: !this.state.hideTools,
        });
    }

    // 初始化前 的钩子函数 处理state 
    initBefore(nextState) {
        return Object.assign(nextState, this.getScaleToRange());
    }

    // 缩放前钩子函数 处理state
    scaleBefore(nextState) {
        return Object.assign(nextState, this.getScaleToRange());
    }
    // 更新完 钩子函数
    onUpdate() {
        let paddingRight, { aerialView } = this.refs;

        if (aerialView && window.getComputedStyle(aerialView).display === 'none') {
            paddingRight = 0;
        } else {
            paddingRight = this.state.aerialViewShow && this.state.aerialShow ? this.AerialViewWidth : 0;
        }
        if (this.state.paddingRight !== paddingRight) {
            // 视图更新完后，工具条和鸟瞰图宽度冲突。设置一个工具栏的padding
            this.setState({
                paddingRight: paddingRight
            });
        }

    }

    // 扩大/缩小 
    ScalePlus(scale = 0) {
        const nextScale = this.currentScale + scale;
        const nextScaleState = this.scale(nextScale);
        this.setState(nextScaleState);
    }

    // 获取进度转换的缩放。
    getRangeToScale(rangeVal = this.state.ScaleValue) {
        const totalScale = this.maxScale - this.minScale, //总缩放比例
            nextScale = totalScale * rangeVal / 100 + this.minScale;
        return {
            ScaleValue: rangeVal,
            ...this.scale(nextScale)
        }
    }
    // 获取缩放转换的进度。
    getScaleToRange(scale = this.currentScale) {
        const totalScale = this.maxScale - this.minScale,
            nextRange = 1 - (this.maxScale - scale) / totalScale;
        return {
            ScaleValue: nextRange * 100
        }
    }

    // 全屏事件处理
    handleFullScreen() {
        this.state.fullScreen ? this.exitFullscreen() : this.fullScreen();

        this.setState({
            fullScreen: !this.state.fullScreen
        });
    }

    // 窗口发生改变时 钩子函数
    onResize() {
        // 当全屏图标显示的状态 和 实际状态不一致时 重置图标
        if (this.state.fullScreen === !!this.isFullscreen()) return;
        this.setState({
            fullScreen: !this.state.fullScreen
        });
    }

    // 拖动进度条缩放
    dragScale(val) {
        if (Number.isNaN(val)) return;
        const scaleState = this.getRangeToScale(val);
        this.setState(scaleState);
    }





}

