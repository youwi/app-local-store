import {asyncprojectList,asyncProjectList} from "../asyncmo/ServiceProject"
import {STATE} from "../../config"
export default {

  namespace: 'project',

  state: {
    projectList:[
    /*  {id:1,projectName:"Test1",projectDesc:"描述1",projectShortName:"test1",projectIcon:"abc.png",link:"/project/test1"},
      {id:2,projectName:"Test2",projectDesc:"描述2",projectShortName:"test2",projectIcon:"abc.png",link:"/project/test2"},
      {id:3,projectName:"Test1",projectDesc:"描述1",projectShortName:"test1",projectIcon:"abc.png",link:"/project/test3"},
      {id:4,projectName:"Test2",projectDesc:"描述2",projectShortName:"test2",projectIcon:"abc.png",link:"/project/test4"},
      {id:5,projectName:"Test1",projectDesc:"描述1",projectShortName:"test1",projectIcon:"abc.png",link:"/project/test5"},
      {id:6,projectName:"Test2",projectDesc:"描述2",projectShortName:"test2",projectIcon:"abc.png",link:"/project/test6"},
      {id:7,projectName:"Test1",projectDesc:"描述1",projectShortName:"test1",projectIcon:"abc.png",link:"/project/test7"},
      {id:8,projectName:"Test2",projectDesc:"描述2",projectShortName:"test2",projectIcon:"abc.png",link:"/project/test8"},
      {id:9,projectName:"Test3",projectDesc:"描述3",projectShortName:"test2",projectIcon:"abc.png",link:"/project/test9"}*/]
  },

  subscriptions: {

    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/project' || location.pathname=="/") {
          dispatch({type: 'app/hideBreadLink'})
          dispatch({type:"queryList"})
        }else{
          dispatch({type: 'app/showBreadLink'})
        }
      })
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *queryList(arg,{call,put}){
      let data=yield call(asyncProjectList)
      if(data.state==STATE.SUCCESS){
        yield put({type:"newprojectList",list:data.list})
      }
    }
  },

  reducers: {
    pureUpdate(state, action){
      return { ...state, ...action };
    },
    newprojectList(state,action){
      let newstate={ ...state}
      newstate.projectList=[];
      if(action.list!=null){
          let tmpList=action.list.map((item,i)=>{
          if(item.projectType==2){
            return {id:item.id,link:"/project/"+(item.projectShortName||"all"),projectShortName:item.projectShortName,projectName:item.name,projectDesc:item.desc}
          } // ForMock
          else{
            return null;
          }
        //  return {id:item.id,link:"/project/"+item.projectShortName,projectShortName:item.projectShortName,projectName:item.projectName,projectDesc:item.projectDesc}
        })
        let newList=[];
        for(let item of tmpList){
          if(item!=null) newList.push(item)
        }
        newstate.projectList=newList
      }
      return newstate
    },
    hideBreadLink(state, action){
      return { ...state}

    }
  },

};
