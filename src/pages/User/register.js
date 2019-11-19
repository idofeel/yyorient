import React, { Component } from 'react';
import { Form, Input, Icon, Row, Col, Button } from 'antd';
import logo from 'images/logo.png';
import { get } from '../../utils/request';
import api from '../../services/api';

// 样式加载
import './register.less';
import {
	email_reg,
	user_name,
	pwd_reg,
	phone_number,
} from '../../utils/Regexp';

// const { Option } = Select;
// const AutoCompleteOption = AutoComplete.Option;
class Register extends Component {
	state = {
		confirmDirty: false,
		autoCompleteResult: [],
		regCode: '',
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
			}
		});
	};

	handleConfirmBlur = (e) => {
		const value = e.target.value;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
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
		const { getFieldDecorator } = this.props.form;
		// const { autoCompleteResult } = this.state;

		// const formItemLayout = {
		// 	labelCol: {
		// 		xs: { span: 24 },
		// 		sm: { span: 8 },
		// 	},
		// 	wrapperCol: {
		// 		xs: { span: 24 },
		// 		sm: { span: 16 },
		// 	},
		// };
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
		// const prefixSelector = getFieldDecorator('prefix', {
		// 	initialValue: '86',
		// })(
		// 	<Select style={{ width: 70 }}>
		// 		<Option value="86">+86</Option>
		// 		<Option value="87">+87</Option>
		// 	</Select>,
		// );

		// const websiteOptions = autoCompleteResult.map((website) => (
		// 	<AutoCompleteOption key={website}>{website}</AutoCompleteOption>
		// ));

		return (
			<Form
				// {...formItemLayout}
				onSubmit={this.handleSubmit}
				className='registerForm'>
				<h3>立即注册</h3>
				已是会员？<a href='#/login'>立即登录</a>
				<Form.Item extra=''>
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
					{getFieldDecorator('password1', {
						rules: [
							{
								required: true,
								message: '请再次确认您的密码！',
							},
							{
								validator: this.compareToFirstPassword,
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
				<Form.Item>
					{getFieldDecorator('phone', {
						rules: [
							{
								required: true,
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
					<Row gutter={8}>
						<Col span={15}>
							{getFieldDecorator('captcha', {
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
									placeholder='请输入右侧验证码'
								/>,
							)}
						</Col>
						<Col span={9}>
							<img src={api.auth.regCode} width='100%' alt='' />
						</Col>
					</Row>
				</Form.Item>
				<Form.Item>
					<Row gutter={8}>
						<Col span={12}>
							{getFieldDecorator('captcha', {
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

	async componentDidMount() {
		console.log('?????');
		const res = await get(api.auth.regCode);
		this.setState({
			regCode: res,
		});
	}
}

export default Form.create({ name: 'register' })(Register);
