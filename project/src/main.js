import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';

import '@/assets/css/reset.css'
import '@/assets/iconfont/iconfont.css'


Vue.use(ElementUI);

Vue.config.productionTip = false

import './assets/css/reset.css'


const resizeObserverErr = window.onerror;
window.onerror = function(err) {
  if (err === 'ResizeObserver loop completed with undelivered notifications.') {
    return false;
  } else {
    if (resizeObserverErr) return resizeObserverErr.apply(this, arguments);
  }
};
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
