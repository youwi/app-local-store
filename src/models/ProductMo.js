import { asyncGetAllProduct,asyncGetProductVersion,asyncGetAllImages} from "../asyncmo/ServiceProduct"
import {STATE} from "../../config"

import {ip,httpip} from "../env.json"
import config from "../../config"
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
        yield put({type:"pureUpdate",versions:data.versions,versionT:data.versionT})
      }
    },
    *scanAllImages(arg,{call,put}){
      let data=yield asyncGetAllImages(arg)
      if(data.state=STATE.SUCCESS){
        // let allImagesLink=data.links.map(link=>{
        //   if(!link.endWith(".html"))
        //     return  httpip+link
        //   else return null
        // }).filter((a)=>a!=null)
        data.links.sort((link)=>link.endWith(".html"))
        let allImagesLink=data.links.map(link=>httpip+link)
        yield put({type:"pureUpdate",allImages:allImagesLink})
      }
    }
  },

  reducers: {
    pureUpdate(state, action){
      return {...state, ...action};
    }
  }

};


String.prototype.startWith=function(str){
  var reg=new RegExp("^"+str);
  return reg.test(this);
}
//测试ok，直接使用str.endWith("abc")方式调用即可
String.prototype.endWith=function(str){
  var reg=new RegExp(str+"$");
  return reg.test(this);
}
