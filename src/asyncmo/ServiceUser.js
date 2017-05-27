import { request } from '../utils'
import qs from 'qs'
import config from "../../config"

export async function login(params) {
  return request(config.index.login, {
    method: 'post',
    data:params,
  })
}

export async function logout(params) {
  return request(config.index.logout, {
    method: 'post',
    data:params,
  })
}

export async function userInfo(params) {
  return request(config.index.userinfo, {
    method: 'get',
    data:params,
  })
}
