import {asyncGetAllItems, asyncUpdateItem, asyncAddItem, asyncGetAllItemsByTypeShortName,asyncDeleteItem} from "../asyncmo/ServicePimTypePage"
import {STATE} from "../config"
import {mergeArrayByIndex} from "../utils/ArrayUtil";
import { message } from 'antd';
export default {

  namespace: 'viewPage',

  state: {
    items:[]
  },

  subscriptions: {
    setup({dispatch, history}) {

    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *getAllItemsByTypeShortName({shortName}, {call,put}){
      let para={}
      para[shortName]=null
      let data=yield call(asyncGetAllItemsByTypeShortName,para)
      if(data.state==STATE.SUCCESS){
        //data.list.forEach((a)=>{delete a.typeId})
        data.list.forEach((a)=>{a.key=a.itemId})
        yield put({type:"pureUpdate",items:data.list})
      }
    },
    *commitSaveItem(arg,{call,put}){
      let data=yield call(asyncUpdateItem,arg.item)
      if(data.state==STATE.SUCCESS){
        yield put({type:"mergeItemAfter",item:data.item,id: arg.item.itemId})
      }else{
        message.error(data.msg)
      }
    },
    *commitDelete({item},{call,put}){
        if(item.id<0){
          yield put({type:"mergeDeleteItem",id:item.itemId})
        }else{
          let data=yield call(asyncDeleteItem,{itemId:item.itemId})
          if(data.state==STATE.SUCCESS){
            yield put({type:"mergeDeleteItem",id:item.itemId})
          }
        }
      }

  },

  reducers: {
    pureUpdate(state, action){
      return { ...state, ...action };
    }
    ,
    addEmptyItem(state,{item}){
      let newstate={...state}
      newstate.items.splice(0,0,item)
      return newstate
    },
    mergeDeleteItem(state,{id}){
      let newstate={...state}
      for(let i=0;i<newstate.items.length;i++){
        let o=newstate.items[i]
        if(o.itemId==id){
          newstate.items.splice(i,1)
          break
        }
      }
      return newstate
    },
    mergeItemAfter(state, action){
      let newstate={...state}
      for(let i=0;i<newstate.items.length;i++){
        if(newstate.items[i].itemId==action.id){
          newstate.items.splice(i,1,action.item)
        }
      }
      //mergeArrayByIndex(newstate.items,action.item,"itemId",action.id)
      return newstate
    },
  },

};



