import { createApp, Plugin } from 'vue'
import "./style.css"
import App from './App.vue'
import './samples/node-api'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import router from './route';
import {store}  from "./store/store";
import VueI18n from './language/index'


createApp(App)
  .use(Antd)
  .use(router)
  .use(store)
  .use(VueI18n)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
