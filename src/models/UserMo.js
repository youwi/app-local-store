import {login, userInfo, logout} from '../asyncmo/ServiceUser'
import {parse} from 'qs'
import Cookie from 'js-cookie'

export default {
  namespace : 'app',
  state : {
    login: false,
    loading: false,
    user: {
      name: "吴彦祖"
    },
    showBread:true,
    loginButtonLoading: false,
    siderFold:localStorage.getItem("antdAdminSiderFold") === "true",
    darkTheme:localStorage.getItem("antdAdminDarkTheme") !== "false",
  },
  subscriptions : {
    setup({dispatch}) {
      window.addEventListener('resize', () => {

      })

      dispatch({type: 'queryUser'})
    }
  },
  effects : {
    *login({ payload }, {call, put}) {
      yield put({type: 'showLoginButtonLoading'})
      const data = yield call(login, parse(payload))
      if (data.state==1) {
        window.localStorage.token=data.token
        yield put({type: 'loginSuccess', payload: {data}})
        yield put({type: 'queryUser'})
        yield put({type: 'permission/getPermisssion'})
      } else {
        yield put({type: 'loginFail', payload: {data}})
      }
    },
    *queryUser({
      payload
    }, {call, put}) {
      yield put({type: 'showLoading'})
      const data = yield call(userInfo, parse(payload))
      if (data.state==1) {
        yield put({type: 'loginSuccess',payload: {user: {name: data.name}}
        })
      } else {
        yield put({type: 'hideLoading'})
      }
    },
    *logout({
      payload
    }, {call, put}) {
      const data = yield call(logout, parse(payload))
      if(data.state==1){
        delete window.localStorage.token
        yield put({type: 'logoutSuccess'})
      }
    },
    *switchSider({
      payload
    }, {put}) {
      console.log("switchSider");
      yield put({
        type: 'handleSwitchSider'
      })
    },
    *changeTheme({
      payload
    }, {put}) {
      console.log("changeTheme");
      yield put({
        type: 'handleChangeTheme'
      })
    },
  },
  reducers : {
    loginSuccess(state, action) {
      return {
        ...state,
        ...action.payload,
        login: true,
        loginButtonLoading: false
      }
    },
    logoutSuccess(state){
      return {
        ...state,
        login: false,
        loading:false
      }
    },
    loginFail(state) {
      return {
        ...state,
        login: false,
        msg:"用户名或密码错误",
        loginButtonLoading: false
      }
    },
    showLoginButtonLoading(state) {
      return {
        ...state,
        loginButtonLoading: true
      }
    },
    showLoading(state) {
      return {
        ...state,
        loading: true
      }
    },
    showBreadLink(state) {
      return {
        ...state,
        showBread: true
      }
    },
    hideBreadLink(state) {
      return {
        ...state,
        showBread: false
      }
    },
    hideLoading(state) {
      return {
        ...state,
        loading: false
      }
    },
    handleSwitchSider(state) {
      localStorage.setItem("antdAdminSiderFold",!state.darkTheme)
      return {
        ...state,
        siderFold: !state.siderFold
      }
    },
    handleChangeTheme(state) {
      localStorage.setItem("antdAdminDarkTheme",!state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme
      }
    },
  }
}
