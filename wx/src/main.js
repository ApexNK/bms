
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import routes from './routers.js';
import httpPlg from 'PLUGINS/http.js';
import evBus from 'PLUGINS/evBus.js';

/* eslint-disable no-new */

// 初始化依赖
[VueResource, VueRouter, httpPlg, evBus].map((plugin) => {
  Vue.use(plugin);
});
const router = new VueRouter({
  routes
});

router.beforeEach(function (to, from, next) {
  console.log(to, from)
  next()
});

Vue.filter('digitalClock', (seconds) => {
  let m = Math.floor(seconds % 3600 / 60);
  let s = Math.floor(seconds % 3600 % 60);
  let timeFormated = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  return timeFormated;
});

new Vue({
  router,
  components: {
    App
  }
}).$mount('#app');
// window.fullScreen = true;
