import { Typography, Avatar, List } from 'antd';
import { connect } from 'dva';
import Page from '../common/Page';
import { get } from '../../utils/request';
import api from '../../services/api';
import { joinUrlEncoded } from '../../utils';
const { Title } = Typography;
@connect()
class FamousList extends Page {
	constructor(props) {
		const { famous = [], agoFamous = [] } = props;
		super(props, {
			famous,
			agoFamous,
		});
	}

	pageId = '5'; // 图库页对应名称
	pageName = 'famous'; // 图库页对应名称

	renderBody() {
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
		console.log(item);
		const detailPath = joinUrlEncoded('/famous/detail' + this.getPath(), {
			detailId: item.id,
		});
		console.log('跳转详情页' + detailPath);
		this.props.history.push(detailPath);

		// urlEncoded
	}
	selectTags(ids) {
		this.loadData(ids);
	}

	async loadData(ids) {
		this.setState({ loading: true, empty: false });
		const reqFamousList = [
			get(api.famous.now, { ids }),
			get(api.famous.ago, { ids }),
		];
		// 并行请求 当代名家 和 历史名家
		const [famous, agoFamous] = await Promise.all(reqFamousList);
		console.log(famous, agoFamous);
		this.replaceState();

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
		// this.setPageStatus({ loading: false, empty: false });
		this.setState({ loading: false, ...data });
	}
}

const ListProps = ({ famous, menus }) => ({ ...famous, menus });

export default connect(ListProps)(FamousList);
