import {asyncGetAllTypes,asyncSaveType,asyncAddLink,asyncAddView,asyncGetTypeByTypeShortName,asyncDeleteType} from "../asyncmo/ServicePimTypePage"
import {STATE} from "../../config"
import {mergeArrayByIndex} from "../utils/ArrayUtil";

import { message } from 'antd';
message.config({
  top: 100,
  duration: 4,
});
export default {

  namespace: 'typePage',

  state: {
    pimTypes:[],
    currentType:{}
  },

  subscriptions: {
    setup({dispatch, history}) {
      dispatch({type: 'getAllTypes'})
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *getAllTypes(arg,{call,put}){
      let data=yield call(asyncGetAllTypes)
      if(data.state==STATE.SUCCESS){
        data.list.forEach((a)=>{a.key=a.typeId})
        yield put({type:"pureUpdate",pimTypes:data.list})
      }else{
        message.error(data.msg)
      }
    },
    *getTypeByShortName({shortName},{call,put}){
      let data=yield call(asyncGetTypeByTypeShortName,{shortName})
      if(data.state==STATE.SUCCESS){
        yield put({type:"pureUpdate",currentType:data.type,currentTypeBackUp:data.type})
      }else{
        message.error(data.msg)
      }
    },
    *queryList(arg,{call,put}){

    },
    *commitSaveType({item},{call,put}){
      let data=yield call(asyncSaveType,item)
      if(data.state==STATE.SUCCESS){
        if(data.item){
          data.item.key=data.item.typeId
        }
        yield put({type:"mergeTypeAfter",item:data.item,id:item.typeId})
        yield put({type:"pureUpdate",currentType:data.item,currentTypeBackUp:data.item})
      }else{
        message.error(data.msg)
      }
    },
    *commitDeleteType({typeId},{call,put}){
      let data=yield call(asyncDeleteType,{typeId})
      if(data.state==STATE.SUCCESS){
        yield put({type:"mergeDeltetTypeById",typeId})
      }else{
        message.error(data.msg)
      }
    }
  },

  reducers: {
    pureUpdate(state, action){
      return { ...state, ...action };
    },
    addOnePropOnCurrentType(state, action){
      let newstate={...state}
      if(newstate.currentType){
        let kvList=safeParse(newstate.currentType.typeProps)||[]
        kvList.push({key:"",value:"",__editable__:true,id:Math.random()})
        newstate.currentType.typeProps=JSON.stringify(kvList)
      }
      newstate.updateId=Math.random()
      return newstate
    },
    mergeDeltetTypeById(state, {typeId}){
      let newstate={...state}
      for(let i=0;i<newstate.pimTypes.length;i++){
        let o=newstate.pimTypes[i]
        if(o.typeId==typeId){
          newstate.pimTypes.splice(i,1,)
          break
        }
      }
      return newstate
    },
    mergeTypeAfter(state, action){
      let newstate={...state}
      for(let i=0;i<newstate.pimTypes.length;i++){
        if(newstate.pimTypes[i].typeId==action.id){
          newstate.pimTypes.splice(i,1,action.item)
        }
      }
      //mergeArrayByIndex(newstate.pimTypes,action.item,"typeId",action.id)
      return newstate
    },
    addEmptyType(state){
        let newstate={...state}
        newstate.pimTypes.splice(0,0, giveNewType())
       // newstate.pimTypes.push( )
        return newstate
    },

    hideBreadLink(state, action){
      return { ...state}
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

function giveNewType(){
  return {
    key:Math.ceil(Math.random()*10000*-1),
    typeMainParentId:"",
    "typeId":Math.ceil(Math.random()*10000*-1),
    "typeName":"",
    "typeShortName":"",
    "typeDesc":"",
    _editable:true,
  }
}
