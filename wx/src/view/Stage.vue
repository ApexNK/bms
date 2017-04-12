<template>
    <div>
      <header-bar></header-bar>
      <div class="has-header timer-bar"  v-show="startGame">
          <div class="title text-center margin-top-far">
              {{title}}
          </div>
          <div style="margin-top:-30px;">
            <span class="larger-time">{{gameTime | digitalClock}}</span>
          </div>
      </div>
      <Scroller class="container has-timer-bar" v-if="startGame">
          <div class="row row-wrap no-padding">
            <div
              :disabled="card.isHidden"
              @click="cardClick(card.id, index)"
              :class="[{'rotateOut': card.isHidden, 'chosen': card.isChosen, 'errchosen': card.isError}, card.styleType]"
              class="col-25-rem animated" v-for="(card, index) in cardList">
              <div class="col-container" style="overflow:auto"><span>{{card.keyword}}</span></div>
            </div>
           </div>
      </Scroller>
      <div class="container has-header" v-show="!startGame">
          <div style="width:80%; border: 1px sienna solid; height: 300px; margin: 50px auto; position: relative;" class="text-center">
              <div class="title">
                  {{modelName}}
              </div>
              <div>
                游戏马上开始，准备好了吗？
              </div>
              <div class="timezone">
                  <span class="time">{{time}}</span>
              </div>
          </div>
      </div>
    </div>
</template>

<script>
    import HeaderBar from 'components/Header.vue';
    import dataServer from 'PLUGINS/dataServer.js';
    import Scroller from 'components/Scroller.vue';
    import config from '../config.js';
    const normalObj = {
      title: '欢迎挑战《普通模式》',
      time: 45
    };
    const strangeObj = {
      title: '欢迎挑战《变态模式》',
      time: 30
    };
    const totalPairs = 10;
    export default {
      data () {
        return {
          title: config.TitleName,
          startGame: false,
          time: 3,
          gameTime: 0,
          modelName: '',
          wordList: [],
          cardList: [],
          startTime: new Date().getTime(),
          wastedTime: 0,
          correctNum: 0,
          isNormal: true,
          timeHandler: null,
          prevSelected: null,
          readyTimer: null,
          currentObj: null
        };
      },
      components: {
        'HeaderBar': HeaderBar,
        Scroller
      },
      mounted () {
        this.getWordList().then(function (data) {
          this.wordList = data;
          this.initListData();
          dataServer.setWordList(this.wordList);
        }.bind(this));
        this.readyGo();
      },
      destroyed () {
        if (this.readyTimer) {
          clearInterval(this.readyTimer);
          this.readyTimer = null;
        }
        if (this.timeHandler) {
          clearInterval(this.timeHandler);
          this.timeHandler = null;
        }
      },
      methods: {
        initListData () {
          let self = this;
          this.isNormal = (this.$route.name === 'normalModel');
          this.currentObj = this.isNormal ? normalObj : strangeObj;
          this.modelName = this.currentObj.title;
          this.gameTime = this.currentObj.time;
          let types = ['type1st', 'type2nd', 'type3rd', 'type4th', 'type5th'];
          let allTypes = [];
          if (!this.isNormal) {
            for (let i = 0; i < 4; i++) {
              allTypes = allTypes.concat(types);
            }
            allTypes.sort((o1, o2) => {
              return Math.floor(Math.random() * 10) > 5 ? 1 : -1;
            });
          }
          this.wordList.forEach((item, index) => {
            let card = {
              id: item.id,
              keyword: item.name,
              isHidden: false,
              isChosen: false,
              isError: false
            };
            if (!this.isNormal) {
              card.styleType = allTypes[index];
            }
            self.cardList.push(card);
          });
        },
        getWordList () {
          let startIndex = this.$route.params.startindex;
          let endIndex = this.$route.params.endindex;
          console.info(this.$route.params);
          return this._http.get('wordlist', {startindex: startIndex, endindex: endIndex}).then(function (data) {
            console.info(data);
            let wlist = data.value;
            wlist.sort((o1, o2) => {
              return Math.floor(Math.random() * 10) > 5 ? 1 : -1;
            });
            return wlist;
          });
        },
        cardClick (id, index) {
          let item = this.cardList[index];
          if (item.isHidden) {
            return;
          }
          if (!this.prevSelected) {
            item.isChosen = true;
            this.prevSelected = {
              key: index,
              value: item
            };
            return;
          }

          if (this.prevSelected.key === index) {
            item.isChosen = false;
            this.prevSelected = null;
            return;
          }

          if (id === this.prevSelected.value.id) {
            item.isHidden = true;
            this.prevSelected.value.isHidden = true;
            this.prevSelected = null;
            this.correctNum++;
            console.info('correctNum:' + this.correctNum);
            if (this.correctNum === totalPairs) {
              this.gameOver(true);
            }
            return;
          }
          item.isError = true;
          this.prevSelected.value.isError = true;
          dataServer.setErrorId(id);
          dataServer.setErrorId(this.prevSelected.value.id);
          setTimeout(function () {
            item.isError = false;
            this.prevSelected.value.isError = false;
            this.prevSelected.value.isChosen = false;
            this.prevSelected = null;
          }.bind(this), 400);
          this.$forceUpdate();
        },
        readyGo () {
          this.readyTimer = setInterval(function () {
            if (this.time === 0) {
              clearInterval(this.readyTimer);
              this.readyTimer = null;
              this.startGame = true;
              this.startTimer();
            } else {
              this.time--;
            }
          }.bind(this), 1000);
        },
        gameOver (success) {
          clearInterval(this.timeHandler);
          this.timeHandler = null;
          success ? this.goToSuccessPage() : this.goToFailPage();
        },
        startTimer () {
          this.timeHandler = setInterval(function () {
            if (this.gameTime === 0) {
              this.gameOver(false);
            } else {
              this.gameTime--;
            }
          }.bind(this), 1000);
        },
        goToSuccessPage () {
          this.goToFinishPage(true);
        },
        goToFailPage () {
          this.cardList.forEach((item) => {
            if (!item.isHidden) {
              dataServer.setErrorId(item.id);
            }
          });
          this.goToFinishPage(false);
        },
        goToFinishPage (isSuccessed) {
          let name = this.isNormal ? 'normalModel' : 'strangeModel';
          let startIndex = this.$route.params.startindex;
          let endIndex = this.$route.params.endindex;
          let time = this.currentObj.time - this.gameTime;
          this.$router.replace({name: 'finish', params: {startindex: startIndex, endindex: endIndex, modelname: name, state: (isSuccessed ? 1 : 0), time: time}});
        }
      }
    }
</script>
<style lang="scss" scoped>
  @import '~STYLE/mixin.scss';
  @import '~STYLE/components/NineGrid.scss';
  @import '~STYLE/common.scss';
  .hidden {
    opacity: 0;
  }
  .timer-bar{
    position: absolute;
    left: 0;
    right: 0;
    height: 130px;
  }
  .has-timer-bar{
    top: 180px;
  }
  .title {
    font-size: 1.4em;
    margin: 20px auto;
  }
  .timezone {
    position: absolute;
    width: 100px;
    height: 100px;
    left: 50%;
    top: 50%;
    margin-top: -50px;
    margin-left: -50px;
  }
  .time {
    font-size: 70px;
    font-weight: 400;
    color: #2f2f2f;
    display: block;
    width: 100%;
    text-align: center;
  }
  .larger-time {
    font-size: 65px;
    font-weight: 800;
    color: #2f2f2f;
    display: block;
    width: 100%;
    text-align: center;
  }
</style>
