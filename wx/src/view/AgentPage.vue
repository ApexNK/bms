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
      this._http.get('user/detail').then(res => {
        if (res.code === 6) {
          window.location.href = WECHAT_OPENID;
          return Promise.resolve(res);
        }
        this.$router.replace({name: 'Tab'});
        return Promise.reject();
      });
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
