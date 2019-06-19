// import React, { Component } from 'react'
import ScaleImg from '../ScaleImg';
import Styles from './index.less'
import { Slider, Icon, Row, Col } from 'antd';
/**
 * 基于图片缩放 使用ant design 给图片查看器提供一个工具组件。
 * 
 * 
 */
export default class PictureTool extends ScaleImg {
    constructor(props) {
        super(props, {
            ScaleValue: 0, //进度条的值
            // minScale: 0, // 最小
            // maxScale: 0,
            hideTools: false, //是否隐藏工具条
            fullScreen: false,  //是否全屏
            paddingRight: 0, // 进度条右边的填充 （当出现鸟瞰图时设置，留出鸟瞰图显示的距离）
        });
    }
    renderTools() {

        return (
            <div className={Styles.sliderRange} style={{ paddingRight: this.state.paddingRight }}>
                <Icon type="appstore" onClick={() => {
                    // this.zoomProgress();
                }} />
                <Row className={Styles.toolsBox}>
                    <Col span={16}>
                        <div className="slider-wrapper">
                            <Icon type="minus-circle" onClick={() => { this.ScalePlus(-0.1) }} />
                            <Slider
                                disabled={false}
                                value={this.state.ScaleValue}
                                tooltipVisible={false}
                                onChange={this.dragScale.bind(this)}
                            />
                            <Icon type="plus-circle" onClick={() => { this.ScalePlus(0.1) }} />
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="slider-wrapper">
                            <Icon type="home" onClick={this.reset.bind(this)} />

                            <Icon type={this.state.fullScreen ? 'fullscreen-exit' : 'fullscreen'} onClick={this.handleFullScreen.bind(this)} />
                        </div>
                    </Col>
                </Row>

            </div>

        )
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
            paddingRight = this.state.aerialViewShow ? this.AerialViewWidth : 0;
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

    // 全屏显示
    fullScreen() {
        const de = document.documentElement;
        if (de.requestFullscreen) {
            de.requestFullscreen();
        } else if (de.mozRequestFullScreen) {
            de.mozRequestFullScreen();
        } else if (de.webkitRequestFullScreen) {
            de.webkitRequestFullScreen();
        }

    };

    // 退出全屏
    exitFullscreen() {

        const de = document;
        if (de.exitFullscreen) {
            de.exitFullscreen();
        } else if (de.mozCancelFullScreen) {
            de.mozCancelFullScreen();
        } else if (de.webkitCancelFullScreen) {
            de.webkitCancelFullScreen();
        }
    };

    // 判断是否在全屏状态
    isFullscreen() {
        return document.fullscreenElement ||
            document.msFullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement || false;
    }


    // 拖动进度条缩放
    dragScale(val) {
        if (Number.isNaN(val)) return;
        const scaleState = this.getRangeToScale(val);
        this.setState(scaleState);
    }





}

