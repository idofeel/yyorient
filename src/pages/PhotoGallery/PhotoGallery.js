import React, { Component } from 'react'
import ImgModal from '../ImgModal'
import HomeBanner from '../Home/Banner';
export default class PhotoGallery extends Component {
    state = {
        visible: false
    }
    render() {
        return (
            <div >
                <a href="javascript:;" onClick={this.handleImg.bind(this)}>
                    <HomeBanner />
                </a>

                <ImgModal visible={this.state.visible} />
            </div>

        )
    }
    handleImg(e) {
        this.setState({
            visible: true
        });
    }
}
