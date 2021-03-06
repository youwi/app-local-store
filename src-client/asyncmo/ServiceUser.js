import { request } from '../utils'
import config from "../../config"

export async function login(params) {
  return request(config.index.login, {
    method: 'post',
    data:{username:params.username,password:params.passwd},
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
