import React, { Component } from 'react';
import { queryString, joinUrlEncoded } from '@/utils';
import ReactDOM from 'react-dom';
import { get } from '@/utils/request';
import API from '@/services/api';
import {
    Spin,
    Card,
    Typography,
    Icon,
    message,
    Divider,
    Empty,
    Breadcrumb,
} from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import Autoresponsive from 'autoresponsive-react';
import ReactBarrel from '@/components/react-barrel';
import ImgModal from '@/pages/ImgModal';


import '../PhotoGallery/photoGallery.less';

const { Meta } = Card;


const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1466546_e5rpye7uors.js',
});





class SearchResult extends Component {

    state = {
        keyword: queryString(this.props.location.search).k || '',
        list: [],
        status: 'loadmore',
        // 
        visible: false,
        source: [],
        detailid: null,
        scaleImgOptions: {
            bounding: true,
            offset: 80,
        },
    }
    startNum = 0;

    componentDidMount () {
        this.getData()
        window.addEventListener('resize', () => {
            if (!this.container) return;
            this.setState({
                containerWidth: ReactDOM.findDOMNode(this.container).clientWidth,
            });
        }, false);

    }

    async getData () {
        if (this.state.status === 'nomore') return;
        const params = {
            sw: this.state.keyword,
            start: this.startNum
        }
        const res = await get(API.photoGallery.search, params)

        if (res.success) {
            this.startNum = res.next;

            this.setState({
                list: this.state.list.concat(res.data.map(o => {
                    o.src = o.img
                    return o
                })),
                status: res.next < 0 ? 'nomore' : 'loadmore',

            });
        } else {
            this.setState({
                status: res.faildesc === '资源空' ? 'empty' : 'loadmore',
            });
        }

        console.log(this.state.status);

    }



    render () {
        const { status, list, keyword, source, visible,
            scaleImgOptions,detailid } = this.state;

        if (list.length === 0 && status === 'empty') {
            return <>
                <Breadcrumb separator='>' style={{ margin: 20, textAlign: 'left' }}>
                    <Breadcrumb.Item href="/">
                        首页
                    </Breadcrumb.Item>
                    <Breadcrumb.Item >
                        搜索"{keyword}"
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={`未找到“${this.state.keyword}” 相关数据`}
                />
            </>


        }

        const AutoResponsiveProps = this.getAutoResponsiveProps();

        return (

            <div className='AutoresponsiveContainer'>
                <Breadcrumb separator='>' style={{ margin: 20, textAlign: 'left' }}>
                    <Breadcrumb.Item href="/">
                        首页
                    </Breadcrumb.Item>
                    <Breadcrumb.Item >
                        搜索"{keyword}"
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div
                    style={{
                        width: AutoResponsiveProps.containerWidth,
                        margin: '0 auto',
                    }}>
                    <InfiniteScroll
                        initialLoad={false}
                        pageStart={this.start}
                        loadMore={this.loadMore.bind(this)}
                        hasMore={status === 'loadmore'}
                        loader={<Spin key='loader' />}>

                        <Autoresponsive {...AutoResponsiveProps}>
                            {list.map((i, index) => (
                                <Card
                                    hoverable
                                    key={index}
                                    style={{
                                        width: i.imgw + 'px',
                                        height: i.imgh * 1 + 80,
                                    }}
                                    className='picitem'
                                    cover={
                                        <img
                                            src={i.img}
                                            alt={i.pname}
                                            onClick={() => {
                                                this.clickItemHandle(i);
                                            }}
                                        />
                                    }>
                                    <Meta
                                        title={i.pname}
                                        description={
                                            <Typography.Paragraph
                                                ellipsis
                                                alt={i.pname}>
                                                {this.getAuthorsName(i.authors)}
                                            </Typography.Paragraph>
                                        }
                                        onClick={() => {
                                            this.clickItemHandle(i);
                                        }}
                                    />
                                    <IconFont
                                        type='icon-collect'
                                        className={`yy-collect ${i.fav ? 'yy-collect-active' : ''
                                            }`}
                                        onClick={() => {
                                            i.fav = !i.fav;
                                            this.setState({
                                                list,
                                            });
                                            i.fav
                                                ? message.success('收藏成功')
                                                : message.info('取消收藏');
                                        }}
                                    />
                                </Card>
                            ))}
                        </Autoresponsive>

                    </InfiniteScroll>

                    {source.length ? (
                        <ImgModal
                            visible={visible}
                            options={scaleImgOptions}
                            dataSource={source}
                            detailid={detailid}
                            hideModal={() => {
                                this.handleImg();
                            }}
                        />
                    ) : null}


                    <Divider hidden={status !== 'nomore'} className='noMore'>
                        别扒拉了，我们是有底线的！
                    </Divider>

                </div>
            </div>
        );
    }

    loadMore (next) {
        this.getData(next)
    }

    getAuthorsName (authors = []) {
        return authors.map((item) => item.aname).join();
    }

    getAutoResponsiveProps () {
        const containerWidth =
            this.state.containerWidth ||
            this.props.containerWidth ||
            document.body.clientWidth;

        const cols = Math.floor((containerWidth - 261) / 270);

        // containerMargin = containerMargin < 20 ? 20 : containerMargin;
        return {
            itemMargin: 20,
            containerWidth: (cols + 1) * 270,
            itemClassName: 'item',
            transitionDuration: '.2',
            // closeAnimation:true,
            // gridWidth: containerMargin,
            transitionTimingFunction: 'easeIn',
        };
    }

    async clickItemHandle(item = {}) {
		this.setState({ loading: true });

		const { pgid } = item;
		const files = await get(API.photoGallery.files, { pid:pgid });
		files.data.splice(0, 1);
		this.setState({
			loading: false,
			visible: true,
			source: files.data,
			detailid: pgid,
		});
		// this.handleImg(true);
	}
    handleImg(e = false) {
		this.setState({
			visible: e,
		});
	}

    componentWillUnmount () {
        // 销毁监听事件
        window.removeEventListener('resize', this.resize);
        this.setState = (state, callback) => {
            return;
        };
    }
}

export default SearchResult;
