<template>
  <div class="root-container">
    <!--<transition
    name="custom-classes-transition"
    enter-active-class="animated flipInY"
    leave-active-class="animated flipOutY"
    >
     
    </transition>-->
    <transition :name="transitionName">
        <router-view class="child-view"></router-view>
    </transition>
    
  </div>
</template>

<script>
  export default {
    data () {
      return {
        transitionName: 'slide-left'
      }
    },
    watch: {
      '$route' (to, from) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      }
    },
  }
</script>
<style lang="scss">
  @import '~STYLE/components/container.scss';
  @import '~STYLE/flex.scss';
  @import '~STYLE/reset.scss';
  .child-view {
    position: absolute;
    transition: all .5s cubic-bezier(.55,0,.1,1);
  }
  .slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(30px, 0);
    transform: translate(30px, 0);
  }
  .slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-30px, 0);
    transform: translate(-30px, 0);
  }
  .root-container{

  }
  .child-view{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow-x: hidden;
    // width: 100%;
    // height: 100%;
    // overflow: hidden;
  }
</style>