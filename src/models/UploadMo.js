import { asyncUpload} from "../asyncmo/ServiceUpload"
import {STATE} from "../../config"

import {ip,httpip} from "../env.json"
export default {

  namespace: 'upload',

  state: {
    links:[]
  },

  subscriptions: {
    setup({dispatch, history}) {

    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *getAllProducts(){

    },
    *upload(obj,{call,put}){
      let req=yield asyncUpload(obj)
      let data=req.body
      if(data.state=STATE.SUCCESS){
        let newLinks=data.links&&data.links.map((link)=>{
          return httpip+"/"+link
        })
        yield put({type:"pureUpdate",links:newLinks||[]})
        yield put({type:"product/getProductVersions",product:obj.product})
        yield put({type:"pureUpdate",uploadingMsg:"Upload Success",uploading:3})
        yield put({type:"pureUpdate",uploadingMsg:"Upload Success",uploading:0})
      }else{
        yield put({type:"pureUpdate",uploadingMsg:"Upload Failed",uploading:-1})
      }
    }
  },

  reducers: {
    pureUpdate(state, action){
      return {...state, ...action};
    }
  }

};

