import React from 'react'
import PropTypes from 'prop-types';

import {
  Icon,
  message,
  Button,
  Row,
  Col,
  Form,
  Input,
} from 'antd'
import styles from './login.less'

const FormItem = Form.Item

const login = ({
                 loginButtonLoading,
                 onOk,
                 form: {
                   getFieldDecorator,
                   validateFieldsAndScroll
                 },
                 msg
               }) => {

  function handleOk() {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      onOk(values)
    })
  }

  //document.onkeyup = e => e.keyCode===13 &&  handleOk()

  return (
    <div className={styles.form} onKeyUp={e => e.keyCode === 13 && handleOk()}>
      <div className={styles.logo}>
        {/*<img src={config.logoSrc}/>*/}
        <span>Pim</span>
      </div>
      <form>
        <FormItem hasFeedback>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: '请填写用户名'
              }
            ]
          })(<Input size="large" placeholder="用户名"/>)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('passwd', {
            rules: [
              {
                required: true,
                message: '请填写密码'
              }
            ]
          })(<Input size="large" type="password" placeholder="密码"/>)}
        </FormItem>
        <Row>
          <Button type="primary" size="large" onClick={handleOk} loading={loginButtonLoading}>
            登录
          </Button>
        </Row>
        <p>
          <span style={{color: "red"}}>{msg}</span>
        </p>
      </form>
    </div>
  )
}

login.propTypes = {
  form: PropTypes.object,
  loginButtonLoading: PropTypes.bool,
  onOk: PropTypes.func,
  msg: PropTypes.string
}

export default Form.create()(login)
