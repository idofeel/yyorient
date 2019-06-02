
import React from 'react';
import logo from 'images/logo.png';
import { Carousel } from 'antd';
import './banner.less'

class HomeBanner extends React.Component {

    render() {
        return <Carousel autoplay>
            <div>
                <img src={logo} />
            </div>
            <div>
                <h3>2</h3>
            </div>
            <div>
                <h3>3</h3>
            </div>
            <div>
                <h3>4</h3>
            </div>
        </Carousel>
    }
}
export default HomeBanner;