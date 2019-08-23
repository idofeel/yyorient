import React, { Component } from 'react';
import { Typography, Avatar, List } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import sessionData from '../../utils/sessionData';
const { Title } = Typography;

@connect()
class FamousList extends Component {
	constructor(props) {
		super(props);
		const { famous = [], agoFamous = [] } = props;
		this.state = {
			famous,
			agoFamous,
		};
	}
	render() {
		const { famous, agoFamous } = this.state;
		return (
			<>
				<div className="famousContent">
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
				<div className="agoFamous">
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
			</>
		);
	}

	goDetailPage(item) {
		const detailId = Math.random();
		sessionData.set('detailId', detailId);
		this.props.dispatch(
			routerRedux.push({
				pathname: '/famous/detail',
				state: { detailId },
			}),
		);
		//     .then(() => {
		//         // 页面跳转
		//         this.props.history.push('/famous/detail');
		//     });
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { famous: sfamous, agoFamous: sagoFamous } = this.state;
		const { famous, agoFamous } = nextProps;
		const data = {};

		if (famous.toString() !== sfamous.toString()) {
			data.famous = sfamous;
		}

		if (sagoFamous.toString() !== agoFamous.toString()) {
			data.agoFamous = sagoFamous;
		}
	}
}

export default connect(({ famous }) => ({ ...famous }))(FamousList);
