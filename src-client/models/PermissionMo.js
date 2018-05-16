import {asyncGetMyPermisssion} from "../asyncmo/ServicePermission";
import {STATE} from "../../config"
export default {

  namespace: 'permission',

  state: {permissionList:[]},

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({type: 'getPermisssion'})
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'save' });
    },
    *getPermisssion({ payload }, { call, put }) {
      let data=yield call(asyncGetMyPermisssion)
      if(data.state===STATE.SUCCESS){
        yield put({type:"pureUpdate",permissionList:data.list})
      }
    },
  },

  reducers: {
    pureUpdate(state, action){
      return { ...state, ...action };
    },
  },

};
