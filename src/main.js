import Vue from 'vue'
import App from './App.vue'
// import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
import {
  Table,
  TableColumn,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  Input,
  Message,
  Loading,
} from 'element-ui'
import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/zh-cn.js'

import router from './router'
import store from './store'

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Button)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Tooltip)
Vue.use(Input)
Vue.use(Loading)
Vue.prototype.$message = Message
Vue.config.productionTip = false
// Vue.use(ElementUI, {
//   size: "mini",
// });

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
