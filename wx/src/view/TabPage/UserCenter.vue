<template>
  <Scroller>
    <div class="card">
      <div class="row row-no-padding row-wrap">
        <div class="col-50">账号：<span class="main-color">{{member.loginName}}</span></div>
        <div class="col-50">姓名：<span class="main-color">{{member.name}}</span></div>
        <div class="col-50">代码：<span class="main-color">690891</span></div>
        <div class="col-50">名称：<span class="main-color">恒玖盈</span></div>
        <div class="col-50">类型：<span class="main-color">{{gradeName[member.grade]}}</span></div>
        <div class="col-50">数量：<span class="main-color">{{member.quantity}}</span></div>
        <div class="col-50">成本：<span class="main-color">{{(member.cost)}}元</span></div>
        <div class="col-50">买入日期：<span class="main-color">{{filterDate(member.purchaseDate)}}</span></div>
        <div class="col-80">投资金额：<span class="main-color">{{(revent.investValue)}}元</span></div>
      </div>
    </div>
    <div class="card">
      <div class="row row-no-padding row-wrap">
        <div class="col-50">最新价格：<span class="warn-color">{{member.currentPrice}}元</span></div>
        <div class="col-50" v-if="revent.curentValue <= 1000000">当前价值：<span class="main-color">{{revent.curentValue}}元</span></div>
		<div class="col-50" v-else style="margin-left:-12px;">当前价值：<span class="main-color" style="margin-left:-8px;">{{revent.curentValue}}元</span></div>
        <div class="col-50">盈亏：<span class="warn-color">{{toInt(revent.winLose)}}元</span></div>
        <div class="col-50">盈亏比例：<span class="warn-color">{{toFixed(revent.winLoseRate * 100)}}%</span></div>
        <div class="col-50">回购日期：<span class="main-color">{{filterDate(member.buybackDate)}}</span></div>
        <div class="col-50">最低回购价：<span class="main-color">{{member.buybackPrice}}元</span></div>
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
          curState: 'userCenter',
          gradeName: ['劣后级','优先级'],
          member: {
            name:"",
            loginName:"",
            grade: 0,
            quantity: 0,
            cost: 0,
            purchaseDate: "",
            currentPrice: 0,
            buybackPrice: 0,
            buybackDate: "",
            withdraw: 0
          },
          revent: {
            winLose: 0,
            winLoseRate: 0,
            curentValue: 0,
            investValue: 0
          }
        }
      },
      mounted () {
        var self = this;
        this._http.get("user/detail").then(res => {
          console.info(res);
          if(res.code !== 0){
            console.info(res.message);
            return;
          }
          for(let k in self.member) {
            self.member[k] = res.value[k];
          }
        });
        this._http.get("user/revenue").then(res => {
        if(res.code !== 0){
          console.info(res.message);
          return;
        }
        for(let k in self.revent) {
          self.revent[k] = res.value[k];
        }
      });
      },
      methods: {
        toFixed(value, isSymbol){
          if(!value){
            return 0.00;
          }
          var result = value.toFixed(2);
          if(!isSymbol){
            return result;
          }
          if(result > 0){
            return ("+" + result);
          }
          return result;
        },
        filterDate(value){
          if(!value){
            return "";
          }
          var date = new Date(value);
          let Y = date.getFullYear() + '.';
          let M = (date.getMonth()+1) + '.';
          let D = date.getDate();
          return (Y+M+D);
        },
        toInt(value){
          if(!value){
            return 0;
          }
          return parseInt(value);
        }
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
