



module.exports = {
  STATE:{
    SUCCESS:1,
    ERROR:-1,
    LOGIN_FAIL:0
  },
  crowd:{
    applicationName:"appdistributionsys",
    applicationAuth:"appdistributionsys",
    findUser:"http://crowd.wkzf:8095/crowd/rest/usermanagement/1/user",
    auth:"http://crowd.wkzf:8095/crowd/rest/usermanagement/1/authentication",
    sessionOnline:"http://crowd.wkzf:8095/crowd/rest/usermanagement/1/session"
  },

  name: 'UED & App',
  prefix: 'uid',
  footerText: ' Test-Team © lieluobo',
  logoSrc: "UA Store",
  logoText: 'UA Store',
  needLogin: true,
  uploadPath:"/opt/upload",
  index: {
    login: "/login.rest",
    permission: "/permissions.rest",
    logout: "/logout.rest",
    userinfo: "/userinfo.rest",
    dashbroad:"/api/dashboard",
    uploadzip:"/upload.rest",
    allProduct:"/products.rest",
    versionList:"/versions.rest",
    allVersionImage:"/versions/images.rest",  //获取所有图片,用于预览
  },
  pim: {
    products:"http://pim.wkzf:8102/products",
  },
  env:{
    envServer:"/_mock_/env/serverlist.rest"
  },
  device: {

    allDevices:"/_mock_/device/list.rest",
    updateDevice:"/_mock_/device/update.rest"
  },
  rule: {
    addRule: "/_mock_/add_rule.rest",
    updateRule: "/_mock_/update_rule.rest",
    allRules:"/_mock_/all_rule.rest",
    updatRule:"/_mock_/update_rule.rest",
    getRule:"/_mock_/get_rule.rest",
    getSddmApI:"/_mock_/sddm/get_sddm_api.rest"
  },
  server: {
    importData: "/_mock_/import.rest"
  },
  monitor: {
    last: "/_mock_/last.rest",
    deviceToenv:"/_mock_/devicetoenv.rest",
    currentEnv:"/_mock_/deviceenv.rest",
    envList:"/_mock_/envlist.rest",
    reloadClear:"/_mock_/reload.rest"
  },
  menu: [
    {key: 'dashboard',name: '仪表盘',icon: 'laptop'},
    {key: 'users',name: '用户管理',icon: 'user',},
    {key: 'project',      name: '主页',
      icon: 'home',
      child: [
        {key: '*',name: '设备选择',icon: 'user',},
        {key: 'test1',name: '设备页面',icon: 'user',},
      ]
    },

    {key: 'ui',name: 'UI组件',icon: 'camera-o',clickable: false,
      child: [{key: 'ico', name: '业务图标',},]
    },
    {
      key: 'navigation',name: '测试导航',icon: 'setting',
      child: [
        {key: 'navigation1', name: '二级导航1',},
        {key: 'navigation2', name: '二级导航2',
          child: [
            {key: 'navigation21',name: '三级导航1',},
            {key: 'navigation22',name: '三级导航2',},
          ],
        },
      ],
    },
  ]
};
