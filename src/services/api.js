const domain = 'http://yy.aijk.xyz/';

exports.RootBase = domain;

export default {
	menus: '/?y=common&d=menu', // 无   一级、二级菜单
	category: '/?y=common&d=category', // {id}  三级分类
	logo: '/?y=common&d=logo', // logo
	footer: '/?y=common&d=footer', // 底部
	// 图库类接口
	photoGallery: {
		list: '/?y=pic&d=list', //  {ids} 图库列表
		detail: '/?y=pic&d=detail', // {pid}   图片详情
		files: '/?y=pic&d=files', //  {pid}    图片文件信息
		author: '/?y=pic&d=author', // {pid}   图片创作者详情
	},
	// 名家类接口
	famous: {
		now: '/?y=author&d=list&t=now', // {ids,letter} 当代名家
		ago: '/?y=author&d=list&t=ago', // {ids,letter} 历代名家
		detail: '/y=author&d=detail', // {aid} 获得创作者详情
		works: '/y=author&d=img&o=columns', //  {aid} 名家作品
	},
	// 视频类接口
	video: {
		list: '/y=video&d=list', //{ids,start} 视频列表
	},
	zone: {
		list: '/?y=space&d=list', //{ids,start} 空间列表
		info: '/?y=space&d=info', // {sid} 获得某一空间简介
		detail: '/?y=space&d=detail', // {sid} 空间详情
	},
	// 鉴权类接口
	auth: {
		login: '/?y=user&d=login&m=name', //{username,password,period :1|0 }  #period 登录是否长期有效
		isUserName: '/?y=user&d=register&o=isusername', // {username} //请求验证用户名是否存在
		isLogin: '/?y=user&d=islogin', //是否登录
		register: '/?y=user&d=register&o=submit', // 提交注册
		logOut: '/?y=user&d=logout', //退出登录
		region: '/?y=user&d=register&o=region', // 获取区域信息
		organization: '/?y=user&d=register&o=org', //{regid} 获得区域机构信息
		regCode: '/?y=user&d=register&o=getseccode', // 获取图片验证码
		matchRegCode: '/?y=user&d=register&o=isseccode', //{seccode} 验证图片验证码
		qqLogin: '/?y=qcloginstep1',
		qqLogin2: '/?y=user&d=login&m=qq',
	},
	// 收藏类接口
	collect: {
		pic: '/?y=fav&d=pic&o=add', // {pid} 添加图片收藏
		zone: '/?y=fav&d=set&o=add', //  {sid} 添加空间收藏
		video: '/?y=fav&d=video&o=add', // {vid} 添加视频收藏
		delPic: '/?y=fav&d=pic&o=del', // {pid} 取消图片收藏
		delZone: '/?y=fav&d=set&o=del', //  {sid} 删除空间收藏
		delVideo: '/?y=fav&d=video&o=del', // {vid} 删除视频收藏
		picList: '/?y=fav&d=pic&o=list', // {start} 图片收藏列表
		zoneList: '/?y=fav&d=set&o=list', // {start} 获得空间收藏列表
		videoList: '/?y=fav&d=video&o=list', // {start} 获得视频收藏列表
		picIs: '/?y=fav&d=pic&o=isfav', // {pid} 图片是否收藏
		zoneIs: '/?y=fav&d=set&o=isfav', // {sid} 空间是否收藏
		videoIs: '/?y=fav&d=video&o=isfav', // {vid} 视频是否收藏
	},
};
