import dva from 'dva';
import './index.html';
import './index.less';
import 'antd/dist/antd.css';
import {ip,httpip} from "./env.json"

import RouteConfig from "./router"

import { message } from 'antd';

require("./mock")
const app = dva({
    onError(e) {
      if(JSON.stringify(e)==JSON.stringify({readyState: 0, responseJSON: undefined, status: 0, statusText: "error"}) ){
        message.error("连接错误:"+httpip, /* duration */3);
      }else{
        message.error("无响应:"+e, /* duration */3);
        console.error(e)
      }
    }
  }
 );
app.router(RouteConfig);

app.model(require('./models/UserMo'))
app.model(require('./models/PermissionMo'))
app.model(require('./models/DashboardMo'))
app.model(require('./models/PimTypePageMo'))
app.model(require('./models/PimItemPageMo'))
app.model(require('./models/PimViewItemPageMo'))
app.model(require('./models/PimTocPageMo'))
app.model(require('./models/PimOperationMo'))


app.start('#root')

if(app._store!=null) window._dispatch= app._store.dispatch

