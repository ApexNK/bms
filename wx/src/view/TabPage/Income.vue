<template>
  <Scroller>
    <div class="card dashboard">
      <div class="text-center">总收益(元)</div>
      <h2 class="text-center warn-color">{{toFixed(memberInfo.totalRevenue)}}</h2>
      <div class="total-bar row row-no-padding">
        <div class="col">
          今日收益(元)<br/>
          <span class="warn-color">{{toFixed(memberInfo.dailyRevenue,true)}}</span>
          </div>
        <div class="col">
          当月收益(元)<br/>
          <span class="warn-color">{{toFixed(memberInfo.monthlyRevenue,true)}}</span>
          </div>
        <div class="col">业绩奖励(元)<br/><span class="warn-color">{{toFixed(memberInfo.bonus,true)}}</span></div>
      </div>
    </div>
    <ul class="list">
      <li class="item">
        <span class="">投资收益率:</span>
        <span class="fr main-color">{{toFixed(memberInfo.revenueRate*100)}}%</span>
      </li>
      <li class="item">
        <span class="">积分:</span>
        <span class="fr warn-color"><span v-show="memberInfo.score > 0">+</span>{{memberInfo.score}}</span>
      </li>
      <li class="item">
        <span class="">盈亏提现:</span>
        <span class="fr warn-color">{{toFixed(memberInfo.withdraw,true)}}元 </span>
      </li>
      <li class="item">
        <span class="">总提现金额:</span>
        <span class="fr warn-color">{{toFixed(memberInfo.totalWithdraw)}}元</span>
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
          curState: 'userCenter',
          memberInfo: {
            monthlyRevenue:0,
            dailyRevenue: 0,
            revenueRate: 0,//收益率
            score:0,
            totalWithdraw:0,
            totalRevenue:0, //总收入
           // winLose: 0, //盈亏
            withdraw: 0,//盈亏提现
            bonus: 0 //业绩奖励
          }
        }
      },
      mounted () {
        var self = this;
        this._http.get("user/revenue").then(res => {
          console.info(res);
          if(res.code !== 0){
            console.info(res.message);
            return;
          }
          for(let k in self.memberInfo) {
            self.memberInfo[k] = res.value[k];
          }
        });
      },
      methods: {
        toFixed(value, isSymbol){
          var result = value.toFixed(2);
          if(!isSymbol){
            return result;
          }
          if(result > 0){
            return ("+" + result);
          }
          return result;
        }
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
