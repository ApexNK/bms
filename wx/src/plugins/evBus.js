let events = {};
const globalEvBus = {
  install (Vue) {
    Vue.globalEvBus = createEvBus();
    Object.defineProperties(Vue.prototype, {
      globalEvBus: {
        get: function () {
          return createEvBus()
        }
      }
    })
  }
};
function createEvBus () {
  return {
    $on (type, callBack) {
      if (events[type]) {
        events[type].push(callBack);
        return;
      }
      events[type] = [callBack];
    },
    $onece (type, callBack) {
      callBack.isOnce = true;
      this.on(type, callBack);
    },
    $emit (type) {
      if (events[type]) {
        events[type].forEach(function (callBack, idx) {
          if (callBack.isOnce) {
            callBack();
            events[type].splice(idx, 1);
            return;
          }
          callBack();
        })
      }
    },
    $remove (type, callBack) {
      if (!callBack) {
        events[type] = [];
        return;
      }
      for (let i = 0; i < events[type].length; i++) {
        if (events[type][i] === callBack) {
          events[type].splice(i, 1);
        }
      }
    }
  }
}
export default globalEvBus;
