import React, { Component } from 'react';
import {
	Form,
	Input,
	Icon,
	Row,
	Col,
	Button,
	Message,
	Select,
	Radio,
} from 'antd';
import { connect } from 'dva';
import { get, post } from '../../utils/request';
import api, { RootBase } from '../../services/api';
import {
	email_reg,
	user_name,
	pwd_reg,
	phone_number,
} from '../../utils/Regexp';
import logo from 'images/logo.png';

// 样式加载
import './register.less';

// const { Option } = Select;
// const AutoCompleteOption = AutoComplete.Option;

const { Option } = Select;
@connect()
class Register extends Component {
	state = {
		confirmDirty: false,
		autoCompleteResult: [],
		imgCode: RootBase + api.auth.regCode,
		region: [],
		orgNames: [],
		registerMode: 'authority',
	};

	compareToFirstPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && value !== form.getFieldValue('password')) {
			callback('两次密码输入不一致!');
		} else {
			callback();
		}
	};

	validateToNextPassword = (rule, value, callback) => {
		// const form = this.props.form;
		// if (value && this.state.confirmDirty) {
		// 	form.validateFields(['confirm'], { force: true });
		// }
		// callback();
	};

	handleSelectChange = (value) => {
		this.getOrg(value);
	};

	registerModeChange = (a, b, c) => {
		console.log(a, b, c);
	};

	async getOrg(orgName) {
		// 获得区域机构信息
		const res = await get(api.auth.organization, { regname: orgName });
		if (res.success) {
			this.setState({
				// orgNames: [{ orgid: 1, orgname: '123131' }],
				orgNames: res.data,
			});
		}
	}
	//  用户名验证
	async validatorUser(rule, val, callback) {
		if (!rule.pattern.test(val)) {
			const { success, faildesc } = await get(api.auth.isUserName, {
				username: val,
			});
			callback(success ? undefined : faildesc);
		} else {
			callback('请输入2-32位字符，不能包含特殊字符');
		}
	}

	render() {
		const { getFieldDecorator, getFieldValue } = this.props.form;
		const { imgCode, region, orgNames } = this.state;
		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 24,
					offset: 0,
				},
				sm: {
					// span: 16,
					// offset: 8,
				},
			},
		};
		return (
			<Form
				// {...formItemLayout}
				onSubmit={this.handleSubmit}
				className='registerForm'>
				<h3>立即注册</h3>
				已是会员？<a href='#/login'>立即登录</a>
				<Form.Item hasFeedback>
					{getFieldDecorator('username', {
						rules: [
							{ required: true, message: '请输入您的用户名' },
							{
								pattern: user_name,
								validator: this.validatorUser,
							},
						],
					})(
						<Input
							prefix={<Icon type='user' />}
							placeholder='请输入用户名'
						/>,
					)}
				</Form.Item>
				<Form.Item hasFeedback>
					{getFieldDecorator('password', {
						rules: [
							{
								required: true,
								message: '请输入您的密码!',
							},
							{
								pattern: pwd_reg,
								// validator: this.validateToNextPassword,
								message: '密码不能包含特殊字符',
							},
						],
					})(
						<Input.Password
							prefix={<Icon type='lock' />}
							type='password'
							placeholder='请输入密码'
						/>,
					)}
				</Form.Item>
				<Form.Item hasFeedback>
					{getFieldDecorator('password2', {
						rules: [
							{
								required: true,
								message: '请再次输入密码！',
							},
							{
								validator: this.compareToFirstPassword,
							},
						],
					})(
						<Input.Password
							prefix={<Icon type='lock' />}
							type='password'
							placeholder='请再次输入密码！'
						/>,
					)}
				</Form.Item>
				<Form.Item hasFeedback>
					{getFieldDecorator('email', {
						rules: [
							{
								required: true,
								message: '请输入您的邮箱账户',
							},
							{
								pattern: email_reg,
								message: '邮箱输入不正确!',
							},
						],
					})(
						<Input
							prefix={<Icon type='mail' />}
							// addonBefore={prefixSelector}
							style={{ width: '100%' }}
							placeholder='请输入您的邮箱'
						/>,
					)}
				</Form.Item>
				<Form.Item hasFeedback>
					{getFieldDecorator('phone', {
						rules: [
							{
								required: false,
								message: '请输入您的手机号码!',
							},
							{
								pattern: phone_number,
								message: '手机号输入不正确!',
							},
						],
					})(
						<Input
							prefix={<Icon type='mobile' />}
							// addonBefore={prefixSelector}
							style={{ width: '100%' }}
							placeholder='请输入手机号码'
						/>,
					)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('register_mode', {
						initialValue: 'other',
					})(
						<Radio.Group buttonStyle='solid'>
							<Radio.Button value='other'>
								高校,公共图书馆注册
							</Radio.Button>
							<Radio.Button value='authority'>
								其它机构/注册码方式
							</Radio.Button>
						</Radio.Group>,
					)}
				</Form.Item>
				{getFieldValue('register_mode') === 'other' ? (
					<>
						<Form.Item hasFeedback>
							{getFieldDecorator('region', {
								rules: [
									{
										required: true,
										message: '请选择区域!',
										// validator: this.validateToNextRegion,
									},
								],
							})(
								<Select
									showSearch
									placeholder='请选择区域'
									onChange={this.handleSelectChange}>
									{region.map((item) => (
										<Option value={item}>{item}</Option>
									))}
								</Select>,
							)}
						</Form.Item>

						<Form.Item hasFeedback>
							{getFieldDecorator('orgid', {
								rules: [
									{
										required: true,
										message: '请选择单位/机构!',
										// validator: this.validateToNextRegion,
									},
								],
							})(
								<Select
									showSearch
									placeholder='请选择单位/机构'
									notFoundContent={`未找到 ${(getFieldValue('region') || '')} 相关的单位/机构`}>
									{orgNames.map((item) => (
										<Option value={item.orgid}>
											{item.orgname}
										</Option>
									))}
								</Select>,
							)}
						</Form.Item>
					</>
				) : (
					<Form.Item>
						{getFieldDecorator('authority_code', {
							rules: [
								{ required: true, message: '请填写注册码' },
							],
						})(
							<Input
								prefix={<Icon type='code' />}
								placeholder='请填写注册码'
							/>,
						)}
					</Form.Item>
				)}
				<Form.Item>
					<Row gutter={8}>
						<Col span={10}>
							{getFieldDecorator('seccode', {
								rules: [
									{
										required: true,
										message:
											'Please input the captcha you got!',
									},
								],
							})(
								<Input
									prefix={<Icon type='message' />}
									placeholder='验证码'
								/>,
							)}
						</Col>
						<Col span={7}>
							<img
								src={imgCode}
								width='100%'
								alt=''
								className='regCodeImg'
							/>
						</Col>
						<Col span={7}>
							<a href='javascript:;' onClick={this.changeRegCode}>
								看不清?换一张
							</a>
						</Col>
					</Row>
				</Form.Item>
				<Form.Item>
					<Row gutter={8}>
						<Col span={12}>
							{getFieldDecorator('phonecode', {
								rules: [
									{
										// required: true,
										message: '请输入手机验证码!',
									},
								],
							})(
								<Input
									prefix={<Icon type='message' />}
									placeholder='请输入手机验证码'
								/>,
							)}
						</Col>
						<Col span={12}>
							<Button>获取验证码</Button>
						</Col>
					</Row>
				</Form.Item>
				<Form.Item {...tailFormItemLayout}>
					<Button
						type='primary'
						htmlType='submit'
						className='register-button'>
						立即注册
					</Button>
				</Form.Item>
			</Form>
		);
	}

	componentDidMount() {
		this.SetRegisterNeedInfo();
	}

	async SetRegisterNeedInfo() {
		// const authInfo = [get(api.auth.organization), get(api.auth.region)];
		// const [organ, region] = await Promise.all(authInfo);
		// console.log(organ, region);
		const res = await get(api.auth.region);
		if (res.success) {
			this.setState({
				region: res.data,
			});
		}
	}

	changeRegCode = () => {
		this.setState({
			imgCode: RootBase + api.auth.regCode + '&rand=' + Math.random(),
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll(async (err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
			}
			// 开始注册
			const res = await post(api.auth.register, { ...values });

			if (!res.success) {
				return Message.error(res.faildesc || '注册失败');
			}

			// this.dispatch({
			// 	type:
			// })
			console.log(values);
		});
	};
}

export default Form.create({ name: 'register' })(Register);
