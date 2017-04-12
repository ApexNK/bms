<template>
    <div class="ranger-box" >
        <div class="progress-bar" :style="style"></div>
        <div :style="{left: style.left}" style="position:absolute;height:20px; width:20px;margin-top:-40px">
          <div class="bubble tip-bubble-bottom">{{vals.start}}</div>
        </div>
        <div :style="{right: style.right}" style="position:absolute;height: 20px; width:20px;margin-top:-40px">
          <div class="bubble tip-bubble-bottom">{{vals.end}}</div>
        </div>
        <span v-drag-x="ondrag1" :data-min="dragMin" :data-start="startdefault/max*100" class="pointer"></span>
        <span v-drag-x="ondrag2" :data-min="dragMin" :data-start="enddefault/max*100" class="pointer"></span>
    </div>
</template>
<script>
    // TODO 最小值控制仍然优点问题， 后续优化
    import dragX from 'components/drag.js';
    export default {
      directives: {dragX},
      data () {
        return {
          val1: 0,
          val2: 0,
          width: 0,
          dragMin: 0
        }
      },
      props: {
        min: {
          type: Number,
          default: 0
        },
        max: {
          type: Number,
          default: 100
        },
        startdefault: {
          type: Number,
          default: 1
        },
        enddefault: {
          type: Number,
          default: 80
        }
      },
      mounted () {
        // document.body.addEventListener('touchstart', this.preventDefault);
        // document.body.addEventListener('touchmove', this.preventDefault);
        // document.body.addEventListener('touchend', this.preventDefault);
        this.width = this.$el.offsetWidth;
        this.dragMin = this.min / this.max * 100;

        console.dir(this.$refs.pointer1);
      },
      computed: {
        style () {
          return {
            left: `${(Math.min(this.val1, this.val2) - 10) / this.width * 100}%`,
            right: `${((this.width - Math.max(this.val1, this.val2)) - 10) / this.width * 100}%`
          };
        },
        vals () {
          return {
            start: Math.ceil(Math.min((this.val1 || this.min), this.val2) / this.width * this.max),
            end: Math.ceil(Math.max(this.val1, this.val2) / this.width * this.max)
          };
        }
      },
      methods: {
        ondrag1 (x) {
          this.val1 = x;
          this.emitVal();
        },
        ondrag2 (x) {
          this.val2 = x;
          this.emitVal();
        },
        emitVal () {
          let self = this;
          this.$emit('change', {
            start: self.vals.start,
            end: self.vals.end
          });
        },
        preventDefault (event) {
          event.preventDefault();
        }
      }
    }
</script>
<style lang="scss" scoped>
    
    .ranger-box{
        display: block;
        position: relative;
        margin: 0 auto;
        min-width: 150px;
        width: 100%;
        height: 6px;
        border-radius: 2px;
        background: #e2e2e2;
        .progress-bar {
            position: absolute;
            height: 6px;
            border-radius: 2px;
            background: #21fb92;
        }
        .pointer {
          display: block;
          position: absolute;
          top: 50%;
          left: 0;
          box-sizing: border-box;
          height: 20px;
          width: 20px;
          border: 1px solid #f5f5f5;
          border-radius: 50%;
          background-color: #fff;
          box-shadow: 1px 1px rgba(0, 0, 0, 0.2);
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          -webkit-transition: transform 0.2s ease-in;
          transition: transform 0.2s ease-in;
          cursor: pointer;
          &.active{
            -webkit-transform: translate(-50%, -50%) scale(2);
            -ms-transform: translate(-50%, -50%) scale(2);
            transform: translate(-50%, -50%) scale(2);
          }
          &.add,&.dec {
            position: absolute;
            top: -10px;
            font-size: 22px;
            line-height: 20px;
            width: 22px;
            height: 22px;
            transform: none;
            text-align: center;
          }
          &.dec{
            left: -30px;
          }
          &.add {
            left: inherit;
            right: -30px;
          }
        }
        .bubble {
              display: inline-block;
              position: relative;
              background-color: #21fb92;
              width: 20px;
              height: 20px;
              padding: 2px;
              color: #0d8249;
              text-align: center;
              border-width: 1px 1px 1px 1px;
              border-radius: 100%;
              font-size: 10px;
              line-height: 22px;
        }
        .bubble:before {
          content:'';
          position:absolute;
          width:0;
          height: 0;
          border:8px solid;
          color:transparent;
        }
        .tip-bubble-bottom:before {
          border-top-color:#21fb92;
          left:50%;
          bottom:-13px;
          margin-left:-8px;
        }
    }
</style>
