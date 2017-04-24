<template>
    <Scroller>
        <div class="row row-no-padding tab-btns">

          <router-link class="col text-center"  to="/Tab/UserCenter">个人中心</router-link>
          <router-link class="col text-center"  to="/Tab/Income">收益概况</router-link>
        </div>
        <div class=" container has-tabs-top padding">
          <transition :name="transitionName">
            <keep-alive>
              <router-view class="child-view"></router-view>
            </keep-alive>
          </transition>
        </div>
    </Scroller>
</template>

<script>

    import Scroller from 'components/Scroller.vue';
    export default {
      components: {
        Scroller
      },
      data () {
        return {
          curState: 'userCenter',
          transitionName: 'slide-left'
        }
      },

      mounted () {
        this._http.get("user/revenue").then(res => {
          console.info(res);
        });
        this._http.get("user/detail").then(res => {
          console.info(res);
        });
      },
      methods: {

      }
    }
</script>
<style lang="scss" scoped>
  @import '~STYLE/mixin.scss';
  @import '~STYLE/common.scss';
  @import '~STYLE/components/NineGrid.scss';

  .tab-btns {
    position: absolute;
    /* left: 15px; */
    /* right: 15px; */
    top: 15px;
    height: 40px;
    padding: 0 15px;
    box-sizing: border-box;
    .col {
      //border-radius: 10px;
      text-decoration: none;
      box-sizing: border-box;
      line-height: 40px;
      color: $mainColor;
      border:1px solid $mainColor;
      -webkit-transition: all 0.3s ease-in;
      transition: all 0.3s ease-in;
      &.router-link-active{
        background: $mainColor;
        color: #040000;
      }
      &:nth-of-type(1){
        border-bottom-left-radius: 10px;
        border-top-left-radius: 10px;
      }
      &:nth-last-of-type(1){
        border-bottom-right-radius: 10px;
        border-top-right-radius: 10px;
      }
    }
  }
  .has-tabs-top {
    color:#fff;
    position: absolute;
    top: 80px;
    left: 15px;
    right: 15px;
    overflow-x:hidden;
  }

</style>
