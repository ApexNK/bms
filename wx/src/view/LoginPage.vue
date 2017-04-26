<template>
  <div>

    <form novalidate @submit.prevent="submit" class="login-container">
      <h4 class="text-center logo">恒玖盈</h4>
      <label for="username">
        <input type="text" id="username" placeholder="账号" v-model.trim="username">
      </label>
      <label for="password">
        <input type="password" id="password" placeholder="密码" v-model.trim="password">
      </label>
      <label for="submit">
        <button type="submit">验证</button>
      </label>
    </form>

</div>
</template>
<script>
    // import { Toast } from 'mint-ui';
  import showToast from 'components/Toast';
	import { WECHAT_OPENID } from '../config.js';
    export default {
      data () {
        return {
          password: '',
          username: ''
        };
      },

      mounted () {

      },
      destroyed () {

      },
      methods: {
        submit () {
          // console.log(Toast);
          if (!this.username || !this.password) {
            showToast({message: '请输入完整用户信息'});
            return;
          }
          this._http.post("user/signin",{loginName:this.username,password:this.password}).then(res => {
            console.info(res);
            if (res.code === 0) {
				        window.location.href = WECHAT_OPENID;
                //this.$router.replace({name: 'Tab'});
            } else {
                showToast({message: res.message()});
            }
          });
           // this.$router.push('Tab');
        }
      }
    }
</script>
<style lang="scss" scoped>
  @import '~STYLE/mixin.scss';
  @import '~STYLE/components/NineGrid.scss';
  @import '~STYLE/common.scss';
  .logo {
    color:#fff;
    font-size: 24px;
    font-weight: 300;
  }
  .login-container{
    position: absolute;
    top:35%;
    margin-top: -45px;
    right: 20px;
    left:20px;
    font-size:($baseFontSize );
    label{
      margin-top: 15px;
      display: block;
      height: 40px;
      background: rgba(255,255,255,.3);
      border-radius: 4px;
      input {
        font-size:($baseFontSize );
        color: #fff;
        padding-left:10px;
        line-height: 40px;
        border: none;
        background:transparent;

        &:focus{
          outline:none;

        }
      }
      button {
        width:100%;
        height: 40px;
        background: $mainColor;
        border-radius: 4px;
        font-size:($baseFontSize );
        border:1px solid $mainColor;
        color: #040000;
        letter-spacing: 5px;
      }
    }
  }
  ::-webkit-input-placeholder {
          color:#fff;
   }
</style>
