import './index.less';
import {ip, httpip} from "./env.json"
import RouteConfig from "./pages/RouterConfig"
import config from "../config"
import "babel-polyfill";
import message from "antd/lib/message"
import "react-image-gallery/styles/css/image-gallery.css"
import dva from 'dva';
import models from "./models/UserMo";
import models012 from "./models/UploadMo";
import models0123 from "./models/ProductMo";

const app = dva({
    onError(e) {
      if (JSON.stringify(e) == JSON.stringify({readyState: 0, responseJSON: undefined, status: 0, statusText: "error"})) {
        message.error("连接错误:" + httpip, /* duration */3);
      } else {
        message.error("无响应:" + e, /* duration */3);
        console.error(e)
      }
    }
  }
);
app.router(RouteConfig);

app.model(models)
app.model(models012)
app.model(models0123)
// app.model(require('./models/PimTypePageMo'))
// app.model(require('./models/PimItemPageMo'))
// app.model(require('./models/PimViewItemPageMo'))
// app.model(require('./models/PimTocPageMo'))
// app.model(require('./models/PimOperationMo'))


app.start('#root')

if (app._store != null) {
  window._dispatch = app._store.dispatch;
}

if (document != null) {
  document.title = config.logoText;
}
