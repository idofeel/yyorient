import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, Icon } from 'antd';
import { email_reg } from '../../utils/Regexp';
import styles from './login.less'
class Login extends Component {

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '请输入您的用户名' }, {
                            pattern: email_reg,
                            validator: this.validatorForm,
                            message: '请输入正确的邮箱格式,如: 375163888@qq.com'
                        }],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="请输入您的手机号/邮箱"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入您的密码!' }],
                    })(
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="请输入密码"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(<Checkbox>记住我</Checkbox>)}
                    <a className="login-form-forgot" href="">
                        忘记密码
                    </a>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                    </Button>
                    <a href="">现在注册！</a>
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create({ name: 'normal_login' })(Login);