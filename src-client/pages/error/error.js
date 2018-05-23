import React from 'react'
import styles from './error.less'
import Icon from 'antd/lib/icon';

const Error = () => <div className="content-inner">
  <div className={styles.error}>
    <Icon type="frown-o"/>
    <h1>404 Not Found</h1>
  </div>
</div>

export default Error
