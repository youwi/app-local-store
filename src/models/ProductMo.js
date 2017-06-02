import { asyncGetAllProduct,asyncGetProductVersion} from "../asyncmo/ServiceProduct"
import {STATE} from "../../config"

import {ip,httpip} from "../env.json"
export default {

  namespace: 'product',

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
    *getAllProducts(arg, { call, put }){
      let data=yield asyncGetAllProduct()
      if(data.state=STATE.SUCCESS){
        yield put({type:"pureUpdate",products:data.products})
      }
    },
    *getProductVersions(arg, { call, put }){
      let data=yield asyncGetProductVersion(arg)
      if(data.state=STATE.SUCCESS){
        yield put({type:"pureUpdate",versions:data.versions})
      }
    }
  },

  reducers: {
    pureUpdate(state, action){
      return {...state, ...action};
    }
  }

};



