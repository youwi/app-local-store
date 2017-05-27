import {asyncAddLink, asyncAddView, asyncGetAllToc, asyncGetAllView, asyncDelView, asyncDelLink,asyncGetAllOperation, asyncUpdateOperation, asyncDeleteOperation} from "../asyncmo/ServicePimTypePage"
import {STATE} from "../config"
import {mergeArrayByIndex} from "../utils/ArrayUtil";
export default {

  namespace: 'operation',

  state: {
    kvList:[],  // 过滤参数标识,defualt参数
    viewList:[],
    operationList:[]
  },

  subscriptions: {
    setup({dispatch, history}) {
      dispatch({type: 'getAllOperation'})
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *getAllOperation(arg,{call,put}){
      let data=yield call(asyncGetAllOperation)
      if(data.state==STATE.SUCCESS){
        yield put({type:"pureUpdate",operationList:data.list})
      }
    },
    *commitSaveOperation({op},{call,put}){
      let data=yield call(asyncUpdateOperation,op)
      if(data.state==STATE.SUCCESS){
        yield put({type:"mergeOpertionList",operation:data.operation,oldId:op.opId})
      }
    },
    *commitDeleteOperation({id},{call,put}){
      if(id<0){
        yield put({type:"mergeDeleteOpertionList",id})
      }else{
        let data=yield call(asyncDeleteOperation,{opId:id})
        if(data.state==STATE.SUCCESS){
          yield put({type:"mergeDeleteOpertionList",operation:data.operation,id})
        }
      }
    }
  },

  reducers: {

    pureUpdate(state, action){
      return { ...state, ...action }
    },
    mergeDeleteOpertionList(state,{id}){
      let newstate={...state}
      for(let i=0;i<newstate.operationList.length;i++){
        let tmp=newstate.operationList[i]
        if(tmp.opId==id){
          newstate.operationList.splice(i,1)
        }
      }
      return newstate
    },
    addTmpOperation(state, action){
      let newstate={...state}
      newstate.operationList.splice(0,0,action.operation)
      return newstate
    },
    delLinkById(state,action){
      let newstate={...state}
      for(let i=0;i< newstate.tocList.length;i++){
        let sk=newstate.tocList[i]
        if(sk.tocId==action.id){
          newstate.tocList.splice(i,1)
          break;
        }
      }
      return newstate
    },
    delViewById(state,action){
      let newstate={...state}
      for(let i=0;i< newstate.viewList.length;i++){
        let sk=newstate.viewList[i]
        if(sk.viewId==action.id){
          newstate.viewList.splice(i,1)
          break;
        }
      }
      return newstate
    },
    mergeCommitedId(state,action){
      let newstate={...state}
      action.link.__editable__=false
      replaceTocItemByKey(newstate.tocList,action.link,"tocId",action.tmpId)
      deleteDupItemByKey(newstate.tocList,"tocId")
      let newstate2={...newstate}
      return newstate2
    },
    currUpdateId(state,action){
      return { ...state, ...action }
    },
    mergeOpertionList(state,action){
      let newstate={...state}
      replaceTocItemByKey(newstate.operationList,action.operation,"opId",action.oldId)
      deleteDupItemByKey(newstate.operationList,"opId")
      let newstate2={...newstate}
      return newstate2
    },

  },
};

function deleteDupItemByKey(arr,key){
  if(arr==null ||  key==null) return
  for(let i=0;i<arr.length;i++){
    let tmp=arr[i]
    for(let j=i+1;j<arr.length;j++){
      let tmp2=arr[j]
      if(tmp[key]==tmp2[key]){
        arr.splice(j,1)
        j--
      }
    }

  }
}
function replaceTocItemByKey(arr,item,kkey,tmpId){
  if(arr==null || item==null ||tmpId==null) return
  for(let i=0;i<arr.length;i++){
    let tmp=arr[i]
    if(tmp[kkey]==tmpId){
      arr.splice(i,1,item)
    }
  }
}

function replaceArrayItemByKey(arr,item,key){
  if(arr==null || item==null ||key==null) return
  for(let i=0;i<arr.length;i++){
    let tmp=arr[i]
    if(tmp[key]==item[key]){
      arr.splice(i,1,item)
    }
  }
}
