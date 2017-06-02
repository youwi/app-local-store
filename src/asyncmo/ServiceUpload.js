import  {request }  from '../utils'
import qs from 'qs'
import config from "../../config"


export async function asyncUpload(params) {
  let files=params.files
  delete params.files
  return request(config.index.uploadzip, {
    method: 'POST',
    data:params,
    files:files,
    isPostFile:true,
  })
}
