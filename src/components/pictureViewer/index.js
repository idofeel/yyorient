// import React, { Component } from 'react'
import PicViewer from '../ScaleImg';
import Styles from './index.less'
import { Slider } from 'antd';

// 增加图片查看器工具
/**
 * 使用ant design 给图片查看器提供一个工具组件。
 * 
 * 
 */
export default class PictureTool extends PicViewer {
    renderTools() {
        return (
            <div
                className={Styles.toolsBox}
            >
                <Slider defaultValue={30} vertical disabled={false} />

            </div>
        )
    }
}

