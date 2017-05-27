import {asyncGetAllItems,asyncUpdateItem,asyncAddItem,
  asyncGetAllOperationByTypeId,asyncGetItem,
  asyncDeleteItem,
  asyncGetAllOperationByItemId,asyncUpdateOperation,
  asyncDeleteOperation,
  asyncGetAllUsers} from "../asyncmo/ServicePimTypePage"
import {STATE} from "../../config"
import {mergeArrayByIndex} from "../utils/ArrayUtil";
import { message } from 'antd';
export default {

  namespace: 'itemPage',

  state: {
    allItem:[],
    currOperationList:[],
    allUsers:[]
  },

  subscriptions: {
    setup({dispatch, history}) {
      dispatch({type: 'getAllItems'})
      dispatch({type: 'getAllUsers'})
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *getAllItems(arg,{call,put}){
      let data=yield call(asyncGetAllItems)
      if(data.state==STATE.SUCCESS){
        data.list.forEach((a)=>{a.key=a.itemId})
        yield put({type:"pureUpdate",allItem:data.list})
      }else{
        message.error(data.msg)
      }
    },
    *getAllUsers(arg,{call,put}){
      let data=yield call(asyncGetAllUsers)
      if(data.state==STATE.SUCCESS){
        data.list.forEach((a)=>{a.key=a.itemId})
        yield put({type:"pureUpdate",allUsers:data.list})
      }else{
        message.error(data.msg)
      }
    },
    *commitSaveItemTmp({item},{call,put}){
      let data=yield call(asyncUpdateItem,item)
      if(data.state==STATE.SUCCESS){
        yield put({type:"pureUpdate",tmpModalLoading:false,tmpModalShouldClose:true})
        yield put({type:"getAllItems"})
      }else{
        message.error(data.msg)
      }
    },
    *commitSaveItem(arg,{call,put}){
      let data=yield call(asyncUpdateItem,arg.item)
      if(data.state==STATE.SUCCESS){
        yield put({type:"mergeItemAfter",item:data.item,currentItemBackUp:data.item,id: arg.item.itemId})
        yield put({type:"pureUpdate",currentItem:data.item,currentItemBackUp:data.item,})
      }else{
        message.error(data.msg)
      }
    },
    *getItemByShortName({shortName},{call,put}){
      let obj={}
      obj[shortName]=""
      let data=yield call(asyncGetItem,obj)
      if(data.state==STATE.SUCCESS){
        yield put({type:"pureUpdate",currentItem:data.item,currentItemBackUp:data.item,})
      }else{
        message.error(data.msg)
      }
    },
    *getAllOperationByItem({itemId},{call,put}){
      let data=yield call(asyncGetAllOperationByItemId,{itemId})
      if(data.state==STATE.SUCCESS){
        yield put({type:"pureUpdate",currOperationList:data.list,})
      }else{
        message.error(data.msg)
      }
    },
    *getAllOperationByType({typeId},{call,put}){
      let data=yield call(asyncGetAllOperationByTypeId,{typeId})
      if(data.state==STATE.SUCCESS){
        yield put({type:"pureUpdate",currOperationList:data.list,})
      }else{
        message.error(data.msg)
      }
    },
    *commitSaveOperation({op},{call,put}){
      let data=yield call(asyncUpdateOperation,op)
      if(data.state==STATE.SUCCESS){
        yield put({type:"mergeOpertionList",operation:data.operation,oldId:op.opId})
      }else{
        message.error(data.msg)
      }
    },
    *commitDeleteOperation({id},{call,put}){
      if(id<0){
        yield put({type:"mergeDeleteOpertionList",id})
      }else{
        let data=yield call(asyncDeleteOperation,{opId:id})
        if(data.state==STATE.SUCCESS){
          yield put({type:"mergeDeleteOpertionList",operation:data.operation,id})
        }else{
          message.error(data.msg)
        }
      }
    },
    *commitDelete({item},{call,put}){
      if(item.id<0){
        yield put({type:"mergeDeleteItem",id:item.itemId})
      }else{
        let data=yield call(asyncDeleteItem,{itemId:item.itemId})
        if(data.state==STATE.SUCCESS){
          yield put({type:"mergeDeleteItem",id:item.itemId})
        }else{
          message.error(data.msg)
        }
      }
    }

  },

  reducers: {

    pureUpdate(state, action){
      return { ...state, ...action };
    },
    addEmptyItem(state,{item}){
      let newstate={...state}
      newstate.allItem.splice(0,0,item)
      return newstate
    },
    mergeDeleteItem(state,{id}){
      let newstate={...state}
      for(let i=0;i<newstate.allItem.length;i++){
        let o =newstate.allItem[i]
        if(o.itemId==id){
          newstate.allItem.splice(i,1)
          break
        }
      }
      return newstate
    },
    mergeDeleteOpertionList(state, action){
      let newstate={...state}
      for(let i=0;i<newstate.currOperationList.length;i++){
        let o =newstate.currOperationList[i]
        if( o.opId==action.id){
          newstate.currOperationList.splice(i,1)
          break
        }
      }
      return newstate
    },
    mergeOpertionList(state,action){
      let newstate={...state}
      for(let i=0;i<newstate.currOperationList.length;i++){
        let o =newstate.currOperationList[i]
        if( o.opId==action.oldId){
          newstate.currOperationList.splice(i,1,action.operation)
          break
        }
      }
      return newstate
    }
   ,
    mergeItemAfter(state, action){
      let newstate={...state}
      for(let i=0;i<newstate.allItem.length;i++){
        if(newstate.allItem[i].itemId==action.id){
          newstate.allItem.splice(i,1,action.item)
        }
      }
      //mergeArrayByIndex(newstate.allItem,action.item,"itemId",action.id)
      return newstate
    },
    hideBreadLink(state, action){
      return { ...state}
    },
    addOnePropOnCurrentItem(state, action){
      let newstate={...state}
      if(newstate.currentItem){
        let kvList=safeParse(newstate.currentItem.itemProps)
        kvList.push({key:"",value:"",__editable__:true,id:Math.random()})
        newstate.currentItem.itemProps=JSON.stringify(kvList)
      }
      return newstate
    },
    addOneOperationOnCurrentOperation(state, action){
      let newOp=giveNewOperation(action.itemId)
      let newState={...state}
      newState.currOperationList.splice(0,0,newOp)
      return newState
    }
  },

};

function safeParse(str){
  try{
    return JSON.parse(str)
  }catch(e){
    return []
  }
}

function giveNewOperation(itemId) {
  return {
    "opId":Math.ceil(Math.random()*10000*-1),
    __editable__:true,
    "opItem":itemId,
    "opType":0,
    "opState":0,
    "opName":"",
    "opTime":"",
    "updateTime":""
  }
}
