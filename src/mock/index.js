
import  config from "../../config"

const Mock = require('mockjs')

/*Mock.mock(RegExp(config.index.logout),  require("./logout.rest.json"))

Mock.mock(RegExp(config.index.login),  require("./login.rest.json"))*/

Mock.mock(RegExp(config.index.dashbroad),  require("./doashbroad.rest"))
Mock.mock(RegExp(config.index.allProduct),  require("./product.rest.json"))
Mock.mock(RegExp(config.index.userinfo),  require("./userinfo.rest.json"))
