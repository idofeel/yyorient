import React, { Component } from 'react'
import HomeBanner from '../Home/Banner';
import { Special } from '../YZone/list';

import api, { RootBase } from '@/services/api';
import { get } from '@/utils/request';
import { joinUrlEncoded } from '@/utils';

export default function Home (props) {


    return (
        <div style={{ textAlign: 'center' }}>
            <HomeBanner />
            <HomeSpecial {...props}/>
        </div>
    )
}



class HomeSpecial extends Component {

    state = {
        data: [],
        start: 0,
    }

    async getData () {
        if (this.state.start === -1) return;
        const res = await get(api.zone.list, {
            ids: [126],
            start: this.state.start,
        });

        if (!res.success) return;

        this.setState({
            data: res.data.map((item) => {
				return {
					title: item.sname,
					desc: item.sname1,
					img: item.cover,
					id: item.sid,
				};
			}),
            start: res.data.next
        })
    }

    goDetailPage(item) {
		const detailPath = joinUrlEncoded('/zone/detail', {
            cid:126,
            c:0,
			detailId: item.id,
			name: item.title,
		});
        
		this.props.history.push(detailPath);

	}

    componentDidMount () {
        this.getData()
    }
    render () {
        return (
            <Special
                source={this.state.data}
                title={
                    <div className='pageTitle'>
                        <h3>空间精选</h3>
                        <h4>···· SPECIAL ····</h4>
                    </div>
                }
                onClick={(item, index) => {
                    this.goDetailPage(item, index);
                }}
            />
        );
    }
}

export { HomeSpecial }
