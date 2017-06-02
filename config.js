



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

  name: 'UED',
  prefix: 'uid',
  footerText: ' UED-Team © wkzf',
  logoSrc: "UED store",
  logoText: 'UED Store System',
  needLogin: true,
  uploadPath:"/opt/upload",
  index: {
    login: "/pim/login.rest",
    permission: "/pim/permissions.rest",
    logout: "/pim/logout.rest",
    userinfo: "/pim/userinfo.rest",
    dashbroad:"/api/dashboard",
    uploadzip:"/pim/upload.rest",
    allProduct:"/pim/products.rest",
    versionList:"pim/versions.rest"
  },
  pim: {
    deleteType:"/pim/delete_type.rest",
    allTypes: "/pim/T",
    allItems:"/pim/A",
    getAllUsers:"/pim/all_users.rest",
    itemUpdate:"/pim/update_item.rest",
    typeUpdate:"/pim/update_type.rest",
    getAllItemByShortName:"/pim/TA",
    addLink:"/pim/link_item.rest",
    deleteLink:"/pim/delete_link.rest",
    addView:"/pim/add_view.rest",
    delView:"/pim/delete_view.rest",
    getAllToc:"/pim/get_all_toc.rest",
    deleteItem:"/pim/delete_item.rest",
    getAllView:"/pim/get_all_view.rest",
    getOneItemByName:"/pim/S",
    getAllOperationByItem:"/pim/get_op_by_item.rest",
    getAllOperation:"/pim/get_all_operation.rest",
    updateOperation:"/pim/update_operation.rest",
    deleteOperation:"/pim/delete_operation.rest",
    getAllOperationByType:"/pim/get_all_operation_by_type.rest",
    getTypeByShortName:"/pim/get_type_by_short_name.rest"
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
