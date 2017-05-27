import { request } from '../utils'
import qs from 'qs'
import config from "../config"

export async function myCity(params) {
  return request('http://www.zuimeitianqi.com/zuimei/myCity', {
    method: 'get',
    cross:true,
    data:params,
  })
}

export async function queryWeather(params) {
  return request('http://www.zuimeitianqi.com/zuimei/queryWeather', {
    method: 'get',
    cross:true,
    data:params,
  })
}

export async function query(params) {
  return request(config.index.dashbroad, {
    method: 'get',
    data:params,
  })
}
