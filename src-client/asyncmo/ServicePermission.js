import { request } from '../utils'

import config from "../../config"

export async function asyncGetMyPermisssion(params) {
  return request(config.index.permission, {
    method: 'get',
    data:params,
  })
}
