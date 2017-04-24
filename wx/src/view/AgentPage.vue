<template>
  <div class="loading-box">

      获取用户信息中......

  </div>
</template>
<script>
  import { WECHAT_OPENID } from '../config.js';
  export default {
    data () {
      return {
      };
    },

    mounted () {
//      this._http.get('user/detail').then(res => {
//        if (res.code === 6) {
//          window.location.href = WECHAT_OPENID;
//          return Promise.resolve(res);
//        }
//        this.$router.replace({name: 'Tab'});
//        return Promise.reject();
//      });
      //window.location.href = WECHAT_OPENID;
      location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd2124dd20a541894&redirect_uri=http%3a%2f%2fhjy.tunnel.2bdata.com%2fwechat%2fgrant&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
    },
    destroyed () {

    },
    methods: {
    }
  }
</script>
<style lang="scss" scoped>
  .loading-box{
    padding-top: 100px;
    text-align: center;
    color: #fff;
  }
</style>
