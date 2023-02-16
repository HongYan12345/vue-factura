import { createApp, Plugin } from 'vue'
import "./style.css"
import App from './App.vue'
import './samples/node-api'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import router from './route';


 

createApp(App)
  .use(Antd)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
