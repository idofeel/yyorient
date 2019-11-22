import React, { Component } from 'react';
import { connect } from 'dva';
import { Typography, Avatar, List } from 'antd';
import TopMenus from '../../layout/page';
import { get } from '../../utils/request';
import api from '../../services/api';
import { joinUrlEncoded } from '../../utils';

const { Title } = Typography;

class list extends Component {
	pageName = 'famous';
	state = {
		loading: true,
	};
	render() {
		const { famous, agoFamous } = this.state;

		return (
			<>
				<TopMenus
					pageName={this.pageName}
					{...this.props}
					cateIdsLoad={this.cateIdsLoad}
					tabChange={this.tabChange}
					showBreadcrumb={true}
					loading={this.state.loading}>
					<div className='famousContent'>
						<Title level={4}>当代名家</Title>
						<List
							grid={{
								// gutter: 20,
								xs: 2,
								sm: 3,
								lg: 5,
							}}
							dataSource={famous}
							renderItem={(item) => (
								<List.Item
									style={{
										textAlign: 'center',
										margin: '20px 0',
									}}
									onClick={() => {
										this.goDetailPage(item);
									}}>
									<Avatar src={item.avatar} size={130} />
									<p>{item.name}</p>
								</List.Item>
							)}
						/>
					</div>
					<div className='agoFamous'>
						<Title level={4}>历代名家</Title>
						<List
							grid={{
								// gutter: 20,
								xs: 4,
								md: 6,
								lg: 8,
								xxl: 10,
							}}
							dataSource={agoFamous}
							renderItem={(item) => (
								<List.Item
									onClick={() => {
										this.goDetailPage(item);
									}}>
									{item.name}
								</List.Item>
							)}
						/>
					</div>
				</TopMenus>
			</>
		);
	}
	componentDidMount() {
		console.log(this.props);
	}

	cateIdsLoad = ({ selectIds }) => {
		this.lastIds = selectIds;
		this.loadData(selectIds);
	};
	goDetailPage(item) {
		const { location } = this.props;
		const path = joinUrlEncoded('/famous/detail/' + location.search, {
			detailId: item.id,
		});
		this.props.history.push(path);
	}
	tabChange() {}

	async loadData(ids) {
		this.setState({ loading: true, empty: false });
		const reqFamousList = [
			get(api.famous.now, { ids }),
			get(api.famous.ago, { ids }),
		];
		// 并行请求 当代名家 和 历史名家
		const [famous, agoFamous] = await Promise.all(reqFamousList);

		const data = {
			famous: [
				{ avatar: '', name: 'ddd', id: 1 },
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
				{ avatar: '', name: 'ddd' },
			],
			agoFamous: [
				{ name: '123' },
				{ name: '123' },
				{ name: '123' },
				{ name: '123' },
				{ name: '123' },
				{ name: '123ddddd' },
				{ name: '123ddddd' },
				{ name: '大叔大叔大叔的' },
				{ name: '123ddddd' },
				{ name: '123ddddd' },
				{ name: '123' },
				{ name: '123' },
				{ name: '123' },
				{ name: '123' },
				{ name: '123' },
				{ name: '123' },
				{ name: '123' },
				{ name: '123' },
			],
		};
		this.setState({ loading: false, ...data });
	}
}

export default list;
