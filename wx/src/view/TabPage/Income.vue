<template>
  <Scroller>
    <div class="card dashboard">
      <div class="text-center">总收益(元)</div>
      <h2 class="text-center warn-color">4000.00</h2>
      <div class="total-bar row row-no-padding">
        <div class="col">
          今日收益<br/>
          <span class="warn-color">+5846.00</span>
          </div>
        <div class="col">
          当月累计收益<br/>
          <span class="warn-color">+5846.00</span>
          </div>
        <div class="col">业绩奖励<br/><span class="warn-color">+30000</span></div>
      </div>
    </div>
    <ul class="list">
      <li class="item">
        <span class="">投资收益率:</span>
        <span class="fr main-color">9.9</span>
      </li>
      <li class="item">
        <span class="">积分:</span>
        <span class="fr warn-color">+3000.00 </span>
      </li>
      <li class="item">
        <span class="">盈亏提现:</span>
        <span class="fr warn-color">+3000.00 </span>
      </li>
      <li class="item">
        <span class="">总提现金额:</span>
        <span class="fr warn-color">9000.00</span>
      </li>
    </ul>
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
        
      },
      methods: {
        
      }
    }
</script>
<style lang="scss" scoped>
  @import '~STYLE/mixin.scss';
  @import '~STYLE/common.scss';
  @import '~STYLE/components/NineGrid.scss';
  .dashboard{
    position: relative;
    padding-bottom: 60px;
    overflow: hidden;
    
    h2{
      margin: 10px 0;
      font-size:42px;
      font-weight: 400;
    }
    .total-bar{
      position: absolute;
      left: 0;
      right: 0;
      bottom:0;
      height: 60px;
      text-align: center;
      background: rgba(255,255,255,.2);
      padding-top: 12px;
      box-sizing: border-box;
    }
  }
  .list {
    padding: 0 10px;
    .item {
      height: 40px;
      line-height: 40px;
      color: #fff;
      padding-right: 10px;
      border-bottom: 1px solid #fff;
    }
  }
  .warn {
    color:#F13533;
  }
  .down {
    color:#3DC881;
  }
</style>
