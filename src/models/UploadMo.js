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
    *upload(files,{call,put}){
      let req=yield asyncUpload(files)
      let data=req.body
      if(data.state=STATE.SUCCESS){
        let newLinks=data.links&&data.links.map((link)=>{
          return httpip+"/"+link
        })
        yield put({type:"pureUpdate",links:newLinks||[]})
      }
    }
  },

  reducers: {
    pureUpdate(state, action){
      return {...state, ...action};
    }
  }

};


