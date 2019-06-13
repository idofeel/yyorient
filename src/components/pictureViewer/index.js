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
            ScaleValue: 0,
            minScale: 0,
            maxScale: 0,
            fullScreen: false
        });
    }
    renderTools() {
        return (
            <div className={Styles.sliderRange} style={{ paddingRight: this.state.aerialViewShow ? this.AerialViewWidth : 0 }}>
                <Row>
                    <Col span={16}>
                        <div className="slider-wrapper">
                            <Icon type="minus-circle" />
                            <Slider
                                disabled={false}
                                value={this.state.ScaleValue}
                                tooltipVisible={false}
                                onChange={this.sliderChange.bind(this)}
                            />
                            {/* <Icon type="plus-circle"
                                onMouseDown={() => { this.scaleClick(this.state.ScaleValue += 1) }}
                            /> */}
                            <Icon type="plus-circle" />
                        </div>
                    </Col>
                    <Col span={8}>
                        <div className="slider-wrapper">
                            <Icon type="home" onClick={this.initPicture.bind(this)} />

                            <Icon type={this.state.fullScreen ? 'fullscreen-exit' : 'fullscreen'} onClick={this.handleFullScreen.bind(this)} />
                        </div>
                    </Col>
                </Row>

            </div>

        )
    }

    handleFullScreen() {
        this.state.fullScreen ? this.exitFullscreen() : this.fullScreen();
        this.setState({
            fullScreen: !this.state.fullScreen
        })
    }

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

    scaleClick() {
        console.log(this)
        this.reset()
    }

    sliderChange(val) {
        if (Number.isNaN(val)) return;
        this.setState({
            ScaleValue: val,
        });
    }





}

