import pathToRegexp from 'path-to-regexp';
import {addBreadMenu} from "../utils"
import {
  asyncRealTimeList,
  asyncToggleEnvByDevice,
  asyncGetCurrentEnv,
  asyncGetEnvList,
  asyncGetModuleIpList,
  asyncGetprojectModuleList,
  asyncReloadRealTime
} from "../asyncmo/RealTime"
import {asyncAllRule, asyncUpdateCurrentRule, asyncGetRuleById, asyncGetRuleBy,asyncGetSddmAPI} from "../asyncmo/ruleAsync"
import {STATE} from "../../config";
import _ from "lodash"
export default {

  namespace: 'realtime',

  state: {
    currentDevice: "inRealTime",
    currentEnv: "inRealTime",
    currentEnvIsloading: false,
    currentProject: "inRealTime",
    currentEntry: {},//当前选中的目标行!
    currentRule: {},//当前影响的规则
    currentSddmAPI:{},
    envList: [],//环境列表
    globalindex: 0,//实时列表计数器
    doingChanging: false,
    pauseState: true,//为true时进行刷新,为false时不运行!
    entries: [
      /*{id:1,"startedDateTime": "2016-12-30T05:53:11.930Z","time": 232.49500000383705,"request": {"method": "GET","url": "http://sddm.wkzf/1.chart.js","httpVersion": "HTTP/1.1","headers": [{      "name": "Pragma",      "value": "no-cache"    },      {        "name": "Accept-Encoding",        "value": "gzip, deflate, sdch"      },      {        "name": "Host",        "value": "sddm.wkzf"      },      {        "name": "Accept-Language",        "value": "zh-CN,zh;q=0.8"      },      {        "name": "User-Agent",        "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36"      },      {        "name": "Accept",        "value": "*!/!*"      },      {        "name": "Referer",        "value": "http://sddm.wkzf/"      },      {        "name": "Connection",        "value": "keep-alive"      },      {        "name": "Cache-Control",        "value": "no-cache"      }],"queryString": [],"cookies": [],"headersSize": 358,"bodySize": 0},"response": {"status": 200,"statusText": "OK","httpVersion": "HTTP/1.1","headers": [],"cookies": [],"content": {"size": 2706104,"mimeType": "application/javascript","compression": 0},"redirectURL": "","headersSize": 258,"bodySize": 2706104,"_transferSize": 2706362},"cache": {},"timings": {"blocked": 7.57900002645329,"dns": -1,"connect": -1,"send": 0.09300000965594979,"wait": 1.86700001358986,"receive": 222.95599995413795,"ssl": -1},"serverIPAddress": "10.0.18.56","connection": "61684"},
       {id:6,"startedDateTime": "2016-12-30T05:53:11.930Z","time": 232.49500000383705,"request": {"method": "GET","url": "http://sddm.wkzf/6.chart.js","httpVersion": "HTTP/1.1","headers": [{      "name": "Pragma",      "value": "no-cache"    },      {        "name": "Accept-Encoding",        "value": "gzip, deflate, sdch"      },      {        "name": "Host",        "value": "sddm.wkzf"      },      {        "name": "Accept-Language",        "value": "zh-CN,zh;q=0.8"      },      {        "name": "User-Agent",        "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36"      },      {        "name": "Accept",        "value": "*!/!*"      },      {        "name": "Referer",        "value": "http://sddm.wkzf/"      },      {        "name": "Connection",        "value": "keep-alive"      },      {        "name": "Cache-Control",        "value": "no-cache"      }],"queryString": [],"cookies": [],"headersSize": 358,"bodySize": 0},"response": {"status": 200,"statusText": "OK","httpVersion": "HTTP/1.1","headers": [],"cookies": [],"content": {"size": 2706104,"mimeType": "application/javascript","compression": 0},"redirectURL": "","headersSize": 258,"bodySize": 2706104,"_transferSize": 2706362},"cache": {},"timings": {"blocked": 7.57900002645329,"dns": -1,"connect": -1,"send": 0.09300000965594979,"wait": 1.86700001358986,"receive": 222.95599995413795,"ssl": -1},"serverIPAddress": "10.0.18.56","connection": "61684"},
       {id:7,"startedDateTime": "2016-12-30T05:53:11.930Z","time": 232.49500000383705,"request": {"method": "GET","url": "http://sddm.wkzf/7.chart.js","httpVersion": "HTTP/1.1","headers": [{      "name": "Pragma",      "value": "no-cache"    },      {        "name": "Accept-Encoding",        "value": "gzip, deflate, sdch"      },      {        "name": "Host",        "value": "sddm.wkzf"      },      {        "name": "Accept-Language",        "value": "zh-CN,zh;q=0.8"      },      {        "name": "User-Agent",        "value": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36"      },      {        "name": "Accept",        "value": "*!/!*"      },      {        "name": "Referer",        "value": "http://sddm.wkzf/"      },      {        "name": "Connection",        "value": "keep-alive"      },      {        "name": "Cache-Control",        "value": "no-cache"      }],"queryString": [],"cookies": [],"headersSize": 358,"bodySize": 0},"response": {"status": 200,"statusText": "OK","httpVersion": "HTTP/1.1","headers": [],"cookies": [],"content": {"size": 2706104,"mimeType": "application/javascript","compression": 0},"redirectURL": "","headersSize": 258,"bodySize": 2706104,"_transferSize": 2706362},"cache": {},"timings": {"blocked": 7.57900002645329,"dns": -1,"connect": -1,"send": 0.09300000965594979,"wait": 1.86700001358986,"receive": 222.95599995413795,"ssl": -1},"serverIPAddress": "10.0.18.56","connection": "61684"},
       */],
    realtimeList: [
      /*  {id:1,responseCode:"200",protocol:"HTTP",host:"10.10.10.1",url:"/abc/abc",responseType:"json",server:"AppServer",rule:"direct",active:true},
       {id:8,responseCode:"200",protocol:"HTTP",host:"10.10.10.1",url:"/abc/abc",responseType:"json",server:"AppServer",rule:"direct"},
       {id:9,responseCode:"200",protocol:"HTTP",host:"10.10.10.1",url:"/abc/abc",responseType:"json",server:"AppServer",rule:"direct"}*/
    ],
    projectModuleList: [],//当前产品下所有的模块信息,名称,id等
    ruleAcionList: [], //后台规则配置!
  },

  subscriptions: {

    setup({dispatch, history}) {
      history.listen(location => {
        let reg = pathToRegexp('/project/:projectid/:devceid')
        if (reg.test(location.pathname)) {
          let deviceIdd = reg.exec(location.pathname)[2];
          let project = reg.exec(location.pathname)[1];
          addBreadMenu("project", {key: project, name: project})
          addBreadMenu("project", {key: project + "/" + deviceIdd, name: deviceIdd})
          dispatch({type: 'pureUpdate', globalindex: 0, currentEntry: {}, currentRule: {}})
          dispatch({type: 'selectDevice', device: deviceIdd})
          dispatch({type: 'selectproject', project: project})
          // dispatch({type: 'queryLast100'})
          dispatch({type: 'getEnvList', project, device: deviceIdd})
          dispatch({type: 'getCurrentEnv', project, device: deviceIdd})
          dispatch({type: 'queryAllRule'})
          // dispatch({type: 'getprojectModuleList',project,device:deviceIdd})
        }
      })
    },
  },

  effects: {
    *querySddmAPI({moduleId, apiUrl},{call,put}){
      let data = yield asyncGetSddmAPI({moduleId, apiUrl})
      if (data.state == STATE.SUCCESS ) {
        yield  put({type: "pureUpdate", currentSddmAPI: data.api})
      }
    },
    *getRuleByModuleIdApiUrlModelId({moduleId, apiUrl, deviceId}, {call, put}){
      let data = yield asyncGetRuleBy({moduleId, apiUrl, deviceId})
      if (data.state == STATE.SUCCESS && data.rule != null) {
        yield  put({type: "pureUpdate", currentRule: data.rule, ruleMsg: "最新规则"})
      }
    },
    *getRuleById({id}, {call, put}){
      let data = yield asyncGetRuleById({id})
      if (data.state == STATE.SUCCESS) {
        yield  put({type: "pureUpdate", currentRule: data.rule, ruleMsg: "最新规则"})
      }
    },
    *fetch({payload}, {call, put}) {  // eslint-disable-line
      yield put({type: 'save'});
    },
    *toggleEnvByDevice({env, device, project}, {call, put}){
      yield put({type: "currentEnvIsloading", currentEnvIsloading: true});
      let data = yield asyncToggleEnvByDevice({env, device, project});
      if (data.state == STATE.SUCCESS) {
        yield put({type: "toggleEnvByDeviceOK", env: data.env});
      }
    },
    *getEnvList({project, device}, {call, put}){
      let data = yield asyncGetEnvList()
      if (data.state == STATE.SUCCESS) {
        yield put({type: "envListOk", list: data.list})
        yield put({type: 'getCurrentEnv', project, device})
      }
    },
    *queryAllRule({a, b}, {call, put}){
      let data = yield asyncAllRule();
      if (data.state == STATE.SUCCESS) {
        yield  put({type: "pureUpdate", ruleAcionList: data.list})
      }
    },
    *getCurrentEnv({project, device}, {call, put}){
      let data = yield asyncGetCurrentEnv({project, device})
      if (data.state == STATE.SUCCESS) {
        yield put({type: "currentEnvOk", env: data.env})
      }
    },
    *queryLast100({device, project}, {call, put}){

      let data = yield call(asyncRealTimeList, {device, project}) //获取最新100条数据,当前设备
      if (data.state == STATE.SUCCESS) {
        yield put({type: "queryListFull", entries: data.entries})
        yield put({type: "updateRealTimeList", entries: data.entries})
      }
    },
    *queryModlueIpList({projectShortName, device}, {call, put}){
      let data = yield call(asyncGetModuleIpList, {device, projectShortName}) //获取最新100条数据,当前设备
      if (data.state == STATE.SUCCESS) {
        yield put({type: "queryIPListOK", list: data.moduleList})
        yield put({type: "updateRealTimeList", entries: data.entries})
      }
    },
    *getprojectModuleList({projectId}, {call, put}){
      let data = yield call(asyncGetprojectModuleList, {projectId}) //获取最新100条数据,当前设备
      if (data.state == STATE.SUCCESS) {
        yield put({type: "queryModuleListOK", list: data.list})
      }
    },
    *updateCurrentRule({rule}, {call, put}){
      let data = yield  call(asyncUpdateCurrentRule, rule);
      if (data.state == STATE.SUCCESS) {
        yield put({type: "pureUpdate", ruleMsg: "保存成功", currentRule: data.rule})
      }
    },
    *reload(obj, {call, put}){
      let data = yield call(asyncReloadRealTime, obj)
      if (data.state == STATE.SUCCESS) {

      }
    }
  },

  reducers: {
    queryModuleListOK(state, action){
      return {...state, projectModuleList: action.list}
    },
    envListOk(state, action){
      return {...state, envList: action.list}
    },
    pureUpdate(state, action) {
      return {...state, ...action};
    },
    currentEnvIsloading(state, action) {
      return {...state, ...action};
    },
    toggleEnvByDeviceOK(state, action){
      return {...state, currentEnv: action.env || "", currentEnvIsloading: false};
    },
    selectDevice(state, action){
      return {...state, currentDevice: action.device, entries: [], realtimeList: []}
    },
    selectproject(state, action){
      return {...state, currentProject: action.project}
    },
    selectExchangeHar(state, action){
      return {...state, currentEntry: action.entry}
    },
    reload(state, action){
      return {...state, currentEntry: {}, entries: [], realtimeList: [], globalindex: 0}
    },
    togglePause(state, action){
      return {...state, pauseState: action.pauseState}
    },
    showRuleConfigPanel(state, action){
      return {...state, showRuleConfigPanel: !state.showRuleConfigPanel, currentRule: action.rule}
    },
    addOneEntry(state, action){
      let newstate = {...state}
      findEntryAndReplaceByStartTime(newstate.entries, action.entry);
      _.sortBy(newstate.entries, "startedDateTime")
      buildHashForArrayObject(newstate.entries)
      for (let i = 0; i < newstate.entries.length; i++) {
        if (newstate.entries[i].id == null) {
          newstate.entries[i].id = newstate.globalindex
          newstate.globalindex++
        }
      }
      //_sortBy(newstate)
      return newstate
    },
    updateRealTimeList(state, action){


      return {
        ...state, realtimeList: state.entries.map((item, i) => {
          let hostIP = item.mockTargetIP || item.mockClientIP || "- - -"
          // if(hostIP=="0.0.0.0") hostIP="- - -"
          return {
            id: item.id,
            responseCode: item.response.status || "-",
            protocol: item.request.url.indexOf("https://") > -1 ? "HTTPS" : "HTTP",
            host: hostIP,
            url: item.mockApiUrl || "-",
            responseType: item.response.content.mimeType || "",
            active: state.currentEntry.id == item.id,
            server: item.mockTargetServer || "",
            rule: item.mockRuleInfo,
            ruleType: item.ruleType || 0,
            ruleTips: item.mockRuleTips
          }
        })
      }
      // let actionRealTimeList=
      // newstate.realtimeList= actionRealTimeList.concat(newstate.realtimeList);
    },
    selectEntryByIndex(state, action){
      // return {...state,currentEntry:state.entries[state.entries.length-action.id]}
      for (let entry of state.entries) {
        if (entry.id == action.id) {
          return {...state, currentEntry: entry, currentRule: giveARuleByStateOrInfo(state, entry, entry.mockRuleInfo)}
        }
      }
      return state
    },
    queryListFull(state, action){
      let newstate = {...state};
      /*
       let limit=100
       if(newstate.entries.length>limit){
       newstate.entries.length=limit
       newstate.realtimeList.length=limit
       }*/
      _.sortBy(action.entries, "startedDateTime")
      buildHashForArrayObject(action.entries)
      action.entries = deleteDup(action.entries, state.entries)
      //需要去重
      for (let i = 0; i < action.entries.length; i++) {
        if (action.entries[i].id == null) {
          action.entries[i].id = newstate.globalindex
          newstate.globalindex++
        }
      }

      //newstate.entries.push.apply(newstate.entries,action.entries);// 合并方式1
      //newstate.entries.splice(0,0,action.entries) //合并方式2
      action.entries.reverse()
      newstate.entries = action.entries.concat(newstate.entries) //合并方式3
      // newstate.entries = newstate.entries.concat(action.entries)
      return newstate;
    },
    buildRealTime(state, action){

    },
    doChanging(state, action){
      return {...state, doingChanging: !state.doingChanging} //showRuleConfigPanel:!state.showRuleConfigPanel
    },
    clearCurrentEntry(state, action){
      return {...state, currentEntry: {}}
    },
    currentRuleValueChange(state, action){
      return {...state, currentRule: {...state.currentRule, ...action}}
    },
    currentEnvOk(state, action){
      return {...state, currentEnv: action.env || ""}
    }
  },

};
/**
 * 通过记录时间和唯一确定是否要更新替换
 */
function findEntryAndReplaceByStartTime(entries, entry) {
  let isHandled = false;
  for (let item of entries) {
    if (item.mockGlobalId == entry.mockGlobalId) {
      isHandled = true
      for (let key in entry) {
        item[key] = entry[key]
      }
    }
  }
  if (!isHandled)
    entries.splice(0, 0, entry)
}
function sortEntryAndHash(entries) {
  buildHashForArrayObject(entries);
  for (let i = 0; i < action.entries.length; i++) {
    if (action.entries[i].id == null) {
      action.entries[i].id = newstate.globalindex
      newstate.globalindex++
    }
  }
}
function cutUrl(fullurl) {
  if (fullurl != null) {
    fullurl.split(":")
  }
}
function getMineType() {

}
/**
 * 把arr2添加到arr1后面
 * @param arr1
 * @param arr2
 */
function appendTo(arr1, arr2) {
  /// arr1.
}
function indserBefore(arr1, arr2) {
  for (let s of arr1) {

  }

}
function isNull(str) {
  return str == null || str.value == "";
}

/**
 * java String hashCode 的实现
 * @param strKey
 * @return intValue
 */
function hashCode(strKey) {
  var hash = 0;
  if (!isNull(strKey)) {
    for (var i = 0; i < strKey.length; i++) {
      hash = hash * 31 + strKey.charCodeAt(i);
      hash = intValue(hash);
    }
  }
  return hash;
}

/**
 * 将js页面的number类型转换为java的int类型
 * @param num
 * @return intValue
 */
function intValue(num) {
  var MAX_VALUE = 0x7fffffff;
  var MIN_VALUE = -0x80000000;
  if (num > MAX_VALUE || num < MIN_VALUE) {
    return num &= 0xFFFFFFFF;
  }
  return num;
}
/**
 * 对数组每个元素做计算hash,直接保存在对象中
 * @param array
 */
function buildHashForArrayObject(array) {
  for (let item of array) {
    if (item != null && item.hashCode == null) {
      let newhash = hashCode(JSON.stringify(item));
      item.hashCode = newhash;
    }
  }
}
/**
 * 从数组中删除hashCode一样的元素
 * @param arrryPend 新加入的元素,不会被修改
 * @param arrayExist 已经存在的元素,不修改
 * @return Array 返回不重复的数组!
 */

function deleteDup(arrryPend, arrayExist) {
  let newArray = [];
  arrryPend.forEach((item, i) => {
    if (item == null) return
    for (let itemExist of arrayExist) {
      if (item.hashCode == itemExist.hashCode) {
        return;
      }
    }
    if (item != null)
      newArray.push(item)
  })
  return newArray
}


function getRuleTPLfromEntry(rule, entry){
  if ((rule.id == null)) {
    let contentObj = {}
    contentObj.headers = entry.response.headers
    contentObj.code = 200
    contentObj.content = entry.response.content.text
    rule.ruleContent = JSON.stringify(contentObj)
  }
}
function giveARuleByStateOrInfo(state, entry, ruleString) {
  if (ruleString == null || ruleString == "") {

    let out = {
      "apiId": 0,
      "history": 0,
      "deviceIdentifier": state.currentDevice,
      "apiUrl": entry.mockApiUrl,
      "address": "0.0.0.0",
      "port": 8080,
      "moduleId": entry.mockTargetServerId || 0,
      "ruleContent": "<默认是直连规则>",
      "ruleType": 0
    }
    if (out.apiUrl == null) {
      console.log(out)
    }
    getRuleTPLfromEntry(out, entry)
    return out
  } else {
    let out = JSON.parse(ruleString)
    if (out.ruleType == null) {
      out.ruleType = 0
    }
    return out
  }
}
