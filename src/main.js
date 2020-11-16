// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'//對應到下面建立的實體new Vue({})和Vue.use，如果有更改變數名稱，上述地方也都要修改成跟變數名稱一樣
import axios from 'axios';
import VueAxios from 'vue-axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner, faUserSecret, faBoxOpen, faListAlt, faTicketAlt, faShoppingCart, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';//這邊bootstrap 還需要npm install --save jquery popper.js(因為Bootstrap團隊開發時有針對webpack做優化，因此只需要直接import 'bootstrap'即可抓到下載BS資源)
//npm 套件內容
import { ValidationObserver, ValidationProvider, extend, localize, configure } from 'vee-validate';//ValidationProvider是input驗證元件、ValidationObserver是整體<form>驗證元件
import TW from 'vee-validate/dist/locale/zh_TW.json'
import * as rules from 'vee-validate/dist/rules';//把驗證規則全部導入

import App from './App'
import router from './router'//自動找到資料夾中的 index.js 檔案
import './bus';
import currencyFilter from './filters/currency';
import dateFilter from './filters/date';
//自訂義

//全部規則導出並加到vee-validate的擴充裡面
Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});

//運用繁體中文的語系檔
localize('zh_TW', TW);

Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
Vue.component('Loading', Loading);//全域的方式啟用Loading這個元件，前面為自訂義名稱，供其他元件使用時會使用這個自訂義的名稱。
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('ValidationObserver', ValidationObserver)// 將 VeeValidate 完整表單 驗證工具載入 作為全域註冊
Vue.component('ValidationProvider', ValidationProvider)// 將 VeeValidate input 驗證工具載入 作為全域註冊

// Class 設定檔案
configure({
  classes: {
    valid: 'is-valid',//針對bootstrap所進行驗證的class name的設定
    invalid: 'is-invalid'
  }
});

Vue.filter('currency', currencyFilter);
Vue.filter('date', dateFilter);
library.add(faUserSecret, faSpinner, faBoxOpen, faListAlt, faTicketAlt, faShoppingCart, faTrashAlt);

/* eslint-disable no-new */
new Vue({
  el: '#app',//表示這個 vue instance 創建後會掛載取代 id="app" 的元素
  router,//傳入 vue-router 組件 (ES6 屬性簡寫語法糖，原本為router: router)
  components: { App },//載入 App.vue 這個元件
  template: '<App/>'//是表示將 el 定義的標籤取代為此 HTML 模板
})

router.beforeEach((to, from, next) => {
  console.log('to', to, 'from', from, 'next', next);
  // ...
  if(to.meta.requiresAuth === true){
    console.log('這裡需要驗證');
    const api= `${process.env.APIPATH}/api/user/check`;
    axios.post(api).then((response) => {//執行環境在router下，故不能使用this，this是在vue元件內才能使用(所以this.$http要換成axios)
      console.log(response.data);
      if (response.data.success) {
        next();
      }else{
        next({
          path:'/login',
        });
      }
    });
  } else {
    next();
  }
});