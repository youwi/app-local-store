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
      dispatch({type:"getAllProducts"})
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *getAllProducts(arg, { call, put }){
      let data=yield asyncGetAllProduct()
      if(data.state=STATE.SUCCESS){
        data.list.forEach((item)=>{
          item.projectShortName=item.itemShortName
          item.projectName=item.itemDesc
          item.link="/product/"+item.itemShortName
        })
        yield put({type:"pureUpdate",products:data.list})
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



