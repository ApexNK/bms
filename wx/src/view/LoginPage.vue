<template>
  <div>
    
    <form novalidate @submit.prevent="submit" class="login-container">
      <h4 class="text-center logo">恒玖盈</h4>
      <label for="mobile">
        <input type="text" id="mobile" placeholder="手机号" v-model.trim="mobile">
      </label>
      <label for="mobile">
        <input type="text" id="mobile" placeholder="账号" v-model.trim="username">
      </label>
      <label for="submit">
        <button type="submit">验证</button>
      </label>
    </form>
  
</div>
</template>
<script>
   
    
   
    export default {
      data () {
        return {
          mobile: '',
          username: ''
        };
      },
     
      mounted () {
        
      },
      destroyed () {
        
      },
      methods: {
        submit () {
          console.log(this);

          this.$router.push('Tab');
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
    label{
      margin-top: 15px;
      display: block;
      height: 40px;
      background: rgba(255,255,255,.3);
      border-radius: 4px;
      input {
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
