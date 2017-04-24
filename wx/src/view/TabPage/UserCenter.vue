<template>
  <Scroller>
    <div class="card">
      <div class="row row-no-padding row-wrap">
        <div class="col-50">账号：900001</div>
        <div class="col-50">姓名：吕杰</div>
        <div class="col-50">代码：690891</div>
        <div class="col-50">名称：恒玖盈</div>
        <div class="col-50">类型：劣后级</div>
        <div class="col-50">数量：2000万</div>
        <div class="col-50">成本：0.5</div>
        <div class="col-50">买入日期：2017.1.1</div>

      </div>
    </div>
    <div class="card">
      <div class="row row-no-padding row-wrap">
        <div class="col-50">最新价格：<span class="warn-color">900001</span></div>
        <div class="col-50">当前价值：<span class="main-color">9000万元</span></div>
        <div class="col-50">盈亏：<span class="warn-color">900001</span></div>
        <div class="col-50">盈亏比例：<span class="warn-color">401%</span></div>
        <div class="col-50">回购日期：<span class="main-color">900001</span></div>
        <div class="col-50">最低回购价：<span class="main-color">900001</span></div>

      </div>
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
          curState: 'userCenter'
        }
      },
      mounted () {
        this._http.get("user/revenue").then(res => {
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
  .col-50{
    line-height: 40px;
  }
</style>
