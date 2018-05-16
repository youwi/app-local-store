import { request } from '../utils'
import config from "../../config"


export async function asyncProjectList(params) {
  return request(config.index.allProduct, {
    method: 'get',
    data:params,
  })
}

