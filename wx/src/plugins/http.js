import config from '../config.js';

const URL = config.SiteURL;
let VueObj = null;
var timer = null;
let httpPlg = {
  install (Vue) {
    VueObj = Vue;
    setInterceptors(Vue);
    VueObj._http = getHttpMethod();
    Object.defineProperties(Vue.prototype, {
      _http: {
        get: function () {
          return getHttpMethod(this)
        }
      }
    })
  }
}

function getRequestUrl (api) {
  return `${URL}${api}`;
}

function getHttpMethod (obj) {
  return {
    get: function (api, params) {
      if (!api) {
        return Promise.reject('this is empty url');
      }
      if (obj) {
        return obj.$http.get(getRequestUrl(api), {params})
          .then(httpSuccessCB, httpErrorCB);
      } else {
        return VueObj.http.get(getRequestUrl(api), {params}).then(httpSuccessCB, httpErrorCB);
      }
    },
    post: function (api, params, isShowLoading = true) {
      if (!api) {
        return Promise.reject('this is empty api');
      }
      if (isShowLoading) {
        timer = setTimeout(function () {
          VueObj.globalEvBus.$emit('showLoading');
        }, 300);
      }
      if (obj) {
        return obj.$http.post(getRequestUrl(api), params)
          .then(httpSuccessCB, httpErrorCB).finally(function () {
            hideLoading(timer);
          });
      } else {
        return VueObj.http.post(getRequestUrl(api), params)
          .then(httpSuccessCB, httpErrorCB).finally(function () {
            hideLoading(timer);
          });
      }
    }
  }
}
function hideLoading (timer) {
  if (timer) {
    clearTimeout(timer);
    VueObj.globalEvBus.$emit('hideLoading');
  }
};
function httpSuccessCB (response) {
  return Promise.resolve(response.body);
}

function httpErrorCB (err) {
  console.log(err);
  return Promise.reject(err)
}

function setInterceptors (Vue) {
  Vue.http.options.timeout = 20 * 1000;
  Vue.http.interceptors.push(function (request, next) {
    next(function (response) {
    });
  });
}

export default httpPlg;
