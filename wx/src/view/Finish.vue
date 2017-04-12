<template>
    <div>
        <header-bar></header-bar>
        <div class="container has-header">
          <div class="title text-center margin-top-far">
              {{titleName}}
          </div>
          <div class="result" :class="{'success': isSuccessed,'fail': !isSuccessed}">
            <i class="" :class="{'icon-emo-happy': isSuccessed,'icon-emo-unhappy': !isSuccessed}"></i>
            {{title}}
          </div>
          <div style="margin: 20px auto; width: 300px; text-align: left;">
              本次游戏中，用时{{time}}秒，答错{{ErrorList.length}}单词
              <div v-if="ErrorList.length > 0"  ref="copyEle" @click="copy" contentReadOnly="true" >   
                <ul style="margin: 20px 0px; list-style-type:none; width: 100%; text-align: left;" >
                  <li v-for="word in ErrorList">
                    {{word.enName}} : {{word.zhName}}
                  </li>
                </ul>
              </div>
          </div>
          <div class="row row-wrap no-padding">
            <div class="model">
              <div style="padding: 0px 20px; text-align: right">
                  <button type="button" @click="tryAgain()" class="fr model-btn"><i class="icon-angellist"></i>再来一次</button>
              </div>
            </div>
            <div class="model">
              <div style="padding: 0px 20px">
                  <button type="button" @click="goHomePage()" class="fl model-btn"><i class="icon-home-outline"></i>回到首页</button>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
    import HeaderBar from 'components/Header.vue';
    import dataServer from 'PLUGINS/dataServer.js';
    import config from '../config.js';
    export default {
      components: {
        'HeaderBar': HeaderBar
      },
      data: function () {
        return {
          titleName: config.TitleName,
          ErrorList: [],
          title: '',
          time: 0,
          isSuccessed: false
        }
      },
      mounted () {
        if (this.$route.params.state === 1) {
          this.title = ' 恭喜你，挑战通过';
          this.isSuccessed = true;
        } else {
          this.title = ' 非常遗憾，挑战失败';
        }
        this.ErrorList = dataServer.getErrorList();
        this.time = this.$route.params.time;
      },
      methods: {
        tryAgain () {
          let start = this.$route.params.startindex;
          let end = this.$route.params.endindex;
          let pagename = this.$route.params.modelname;
          this.$router.replace({name: pagename, params: {startindex: start, endindex: end}});
        },
        goHomePage () {
          this.$router.replace({name: 'home'});
        },
        copy () {
          let copyEle = this.$refs.copyEle;
          copyEle.contentEditable = 'true';
          document.execCommand('selectAll');
          document.execCommand('copy');
          copyEle.contentEditable = 'false';
          window.alert('复制成功');
        }
      }
    }
</script>
<style lang="scss" scoped>
  @import '~STYLE/mixin.scss';
  @import '~STYLE/common.scss';
  .slider { 
  /* overwrite slider styles */
    width: 80%;
  }
  .model {
    float: left;
    width: 50%;
    clear: both;
  }
  .model-btn {
    width: 90px;
    height: 32px;
  }
  .success {
    color: #00ff00
  }
  .fail {
    color:#ff0000
  }
  .result {
    margin: 20px auto;
    text-align: center;
  }
  .result i {
    font-size: 30px;
    display: block;
  }
</style>
