<template>
  <div>
    <!--<transition
    name="custom-classes-transition"
    enter-active-class="animated flipInY"
    leave-active-class="animated flipOutY"
    >
     
    </transition>-->
     <router-view class="child-view"></router-view>
    
  </div>
</template>

<script>
</script>
<style lang="scss">
  @import '~STYLE/components/container.scss';
  @import '~STYLE/flex.scss';
  @import '~STYLE/reset.scss';
  .child-view{
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>