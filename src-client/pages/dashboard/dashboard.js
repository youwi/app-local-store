import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'dva'
import {Link} from 'dva/router'
import {Row, Col, Icon, Card} from 'antd'
import NumberCard from '../../components/dashboard/numberCard'
import Quote from '../../components/dashboard/quote'
import Sales from '../../components/dashboard/sales'
import Weather from '../../components/dashboard/weather'
import RecentSales from '../../components/dashboard/recentSales'
import Comments from '../../components/dashboard/comments'
import Completed from '../../components/dashboard/completed'
import Browser from '../../components/dashboard/browser'
import Cpu from '../../components/dashboard/cpu'
import User from '../../components/dashboard/user'
import styles from './dashboard.less'
import {color} from '../../utils'
import RootLayout from "../RootLayout";

const bodyStyle = {
  bodyStyle:{
    height: 432,
    background: '#fff',
  }
}

function Dashboard({dashboard}) {
  const {weather, sales, quote, numbers, recentSales, comments, completed, browser, cpu, user} = dashboard
  const numberCards = numbers.map((item, key) => <Col key={key} lg={6} md={12}>
    <NumberCard {...item}/>
  </Col>)

  return (
    <RootLayout>
    <Row gutter={24}>
      {numberCards}
      <Col lg={18} md={24}>
        <Card bordered={false} bodyStyle={{
          padding: '24px 36px 24px 0'
        }}>
          <Sales data={sales}/>
        </Card>
      </Col>
      <Col lg={6} md={24}>
        <Row gutter={24}>
          <Col lg={24} md={12}>
            <Card bordered={false} className={styles.weather} bodyStyle={{
              padding: 0,
              height: 204,
              background: color.blue
            }}>
              <Weather {...weather}/>
            </Card>
          </Col>
          <Col lg={24} md={12}>
            <Card bordered={false} className={styles.quote} bodyStyle={{padding: 0,height: 204,background: color.peach}}>
              <Quote {...quote}/>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col lg={12} md={24}>
        <Card bordered={false} {...bodyStyle}>
          <RecentSales data={recentSales}/>
        </Card>
      </Col>
      <Col lg={12} md={24}>
        <Card bordered={false} {...bodyStyle}>
          <Comments data={comments}/>
        </Card>
      </Col>
      <Col lg={24} md={24}>
        <Card bordered={false} bodyStyle={{padding: '24px 36px 24px 0'}}>
          <Completed data={completed}/>
        </Card>
      </Col>
      <Col lg={8} md={24}>
        <Card bordered={false} {...bodyStyle}>
          <Browser data={browser}/>
        </Card>
      </Col>
      <Col lg={8} md={24}>
        <Card bordered={false} {...bodyStyle}>
          <Cpu {...cpu}/>
        </Card>
      </Col>
      <Col lg={8} md={24}>
        <Card bordered={false} bodyStyle={{...bodyStyle.bodyStyle,padding:0}}>
            <User {...user}/>
        </Card>
      </Col>
    </Row>
    </RootLayout>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object
}

function mapStateToProps({dashboard}) {
  return {dashboard}
}

export default connect(mapStateToProps)(Dashboard)
