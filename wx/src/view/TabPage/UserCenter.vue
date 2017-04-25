<template>
  <Scroller>
    <div class="card">
      <div class="row row-no-padding row-wrap">
        <div class="col-50">账号：{{member.loginName}}</div>
        <div class="col-50">姓名：{{member.name}}</div>
        <div class="col-50">代码：690891</div>
        <div class="col-50">名称：恒玖盈</div>
        <div class="col-50">类型：{{member.grand ? "优先级" : "劣后级"}}</div>
        <div class="col-50">数量：{{member.quantity}}</div>
        <div class="col-50">成本：{{toFixed(member.cost)}}元</div>
        <div class="col-50">买入日期：{{filterDate(member.purchaseDate)}}</div>
        <div class="col-50">投资金额：{{toFixed(revent.investValue)}}</div>
      </div>
    </div>
    <div class="card">
      <div class="row row-no-padding row-wrap">
        <div class="col-50">最新价格：<span class="warn-color">{{toFixed(member.currentPrice)}}</span></div>
        <div class="col-50">当前价值：<span class="main-color">{{toFixed(revent.curentValue)}}元</span></div>
        <div class="col-50">盈亏：<span class="warn-color">{{toFixed(revent.winLose)}}</span></div>
        <div class="col-50">盈亏比例：<span class="warn-color">{{toFixed(revent.winLoseRate * 100)}}%</span></div>
        <div class="col-50">回购日期：<span class="main-color">{{filterDate(member.buybackDate)}}</span></div>
        <div class="col-50">最低回购价：<span class="main-color">{{toFixed(member.buybackPrice)}}元</span></div>

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
          member: {
            name:"",
            loginName:"",
            grand: 0,
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
        toFixed(value){
          var temp = value + "";
          let index  = temp.indexOf(".");
          if(index < 0 ) {
            return (value + ".00");
          }
          let str = temp.substring(0,temp.indexOf(".") + 3);
          return str;
        },
        filterDate(value){
          var date = new Date(value);
          let Y = date.getFullYear() + '-';
          let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          let D = date.getDate();
          return (Y+M+D);
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
