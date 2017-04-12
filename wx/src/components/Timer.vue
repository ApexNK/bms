<template>
    <div>
        <span class="time">{{time | digitalClock}}</span>
    </div>
</template>
<script>
    const defaultSeconds = 10;
    var isTiming = false;
    
    export default {
      data () {
        return {
          time: defaultSeconds
        }
      },
      created () {
        this.globalEvBus.$on('startTimer', function () {
          this.time = defaultSeconds;
          debugger;
          this.start();
        }.bind(this));
      },
      mounted () {

      },
      destroyed () {
        console.info('destroyed');
        debugger;
      },
      methods: {
        start: function () {
          if (isTiming) {
            debugger;
            return;
          }
          isTiming = true;
          // let clock = setInterval(function () {
          //   console.info(this.time);
          //   if (this.time === 0) {
          //     isTiming = false;
          //     window.clearInterval(clock);
          //     this.globalEvBus.$emit('gametimeout');
          //   } else {
          //     this.time--;
          //   }
          // }.bind(this), 1000);
          var self = this;
          minusTime();
          function minusTime () {
            setTimeout(function () {
              console.info(self.time);
              if (self.time === 0) {
                isTiming = false;
                self.globalEvBus.$emit('gametimeout');
              } else {
                self.time--;
                minusTime();
              }
            }, 1000);
          }
        }
      }
    }
</script>
<style  lang="scss" scoped>
  .time {
    font-size: 45px;
    font-weight: 700;
    color: #2f2f2f;
    display: block;
    width: 100%;
    text-align: center;
  }
</style>