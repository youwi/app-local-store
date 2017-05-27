import {asyncAddLink, asyncAddView, asyncGetAllToc, asyncGetAllView, asyncDelView, asyncDelLink} from "../asyncmo/ServicePimTypePage"
import {STATE} from "../../config"
import {mergeArrayByIndex} from "../utils/ArrayUtil";
export default {

  namespace: 'tocPage',

  state: {
    kvList:[],  // 过滤参数标识,defualt参数
    viewList:[],
    tocList:[]
  },

  subscriptions: {
    setup({dispatch, history}) {
      dispatch({type: 'getAllToc'})
      dispatch({type: 'getAllView'})
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *getAllToc(arg,{call,put}){
      let data=yield call(asyncGetAllToc)
      if(data.state==STATE.SUCCESS){
        yield put({type:"pureUpdate",tocList:data.list})
      }
    },
    *getAllView(arg,{call,put}){
      let data=yield call(asyncGetAllView)
      if(data.state==STATE.SUCCESS){
        yield put({type:"pureUpdate",viewList:data.list})
      }
    },
    *link({src,target,tmpId},{call,put}){
      let data=yield call(asyncAddLink,{src,target})
      if(data.state==STATE.SUCCESS){
         yield put({type:"mergeCommitedId",tmpId,link:data.link})
         yield put({type:"currUpdateId",updateId:tmpId})
      }
    },
    *saveView({name,cover,tmpId},{call,put}){
      let data=yield call(asyncAddView,{name,cover})
      if(data.state==STATE.SUCCESS){
        yield put({type:"mergeCommitedIdView",tmpId,view:data.view})
        yield put({type:"currUpdateId",updateId:tmpId})
      }
    },
    *delView({id},{call,put}){
      let data=yield call(asyncDelView,{id})
      if(data.state==STATE.SUCCESS){
        yield put({type:"delViewById",id})
        yield put({type:"currUpdateId",updateId:id})
      }
    },
    *delLink({id},{call,put}){
      let data=yield call(asyncDelLink,{id})
      if(data.state==STATE.SUCCESS){
        yield put({type:"delLinkById",id})
        yield put({type:"currUpdateId",updateId:id})
      }
    }
  },

  reducers: {
    pureUpdate(state, action){
      return { ...state, ...action }
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
    mergeCommitedIdView(state,action){
      let newstate={...state}
      action.view.__editable__=false
      replaceTocItemByKey(newstate.viewList,action.view,"viewId",action.tmpId)
      deleteDupItemByKey(newstate.viewList,"viewId")
      let newstate2={...newstate}
      return newstate2
    }
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
