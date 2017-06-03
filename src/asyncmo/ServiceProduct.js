import { request } from '../utils'
import qs from 'qs'
import config from "../../config"

export async function asyncGetAllProduct(params) {
  return request(config.index.allProduct, {
    method: 'get',
    data:{}
  })
}

export async function asyncGetProductVersion(params) {
  return request(config.index.versionList, {
    method: 'get',
    data:params
  })
}

export async function asyncGetAllImages(params) {
  return request(config.index.allVersionImage, {
    method: 'get',
    data:params
  })
}
