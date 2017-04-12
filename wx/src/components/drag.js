class DragX {
  constructor (oEle, min = 0, max = 100, start = 0) {
    this.oEle = oEle;
    this.curX = start;
    this.lastMoveX = start;
    this.min = min;
    this.max = max;
    this.start = start;
    this.onDragCallBacks = [];
    this.onDragEndCallBacks = [];
    this.init();
  }
  init () {
    this.setOffsetX();
    this.oEle.addEventListener('touchstart', this.touchStartCb.bind(this));
  }
  touchStartCb (ev) {
    ev.preventDefault();
    let curTouch = ev.touches[0];
    this.lastMoveX = curTouch.pageX;
    // this.startX = this.lastMoveX;
    this.oEle.classList.add('active');
    this.oEle.addEventListener('touchmove', this.touchMoveCb.bind(this));
    this.oEle.addEventListener('touchend', this.touchEndCb.bind(this));
  }
  touchMoveCb (ev) {
    ev.preventDefault();
    let curTouch = ev.touches[0];
    let nowX = curTouch.pageX;
    this.curX += (nowX - this.lastMoveX);
    this.setOffsetX(this.curX);
    this.lastMoveX = nowX;
  }
  touchEndCb (ev) {
    ev.preventDefault();
    this.oEle.classList.remove('active');
    let curTouch = ev.changedTouches[0];
    let nowX = curTouch.pageX;
    this.curX += (nowX - this.lastMoveX);
    this.setOffsetX(this.curX);
    this.oEle.removeEventListener('touchmove', this.touchMoveCb.bind(this));
    this.oEle.removeEventListener('touchend', this.touchEndCb.bind(this));
  }
  add (num = 1) {
    this.curX += num;
    this.setOffsetX(this.curX);
  }
  dec (num = 1) {
    this.curX -= num;
    this.setOffsetX(this.curX);
  }
  setOffsetX (curX = 0) {
    if (this.curX <= this.min) {
      console.log(this.curX, this.min);
      this.curX = this.min;
    }
    if (this.curX > this.max) {
      this.curX = this.max;
    }
    this.onDragCallBacks.forEach(fn => fn(this.curX));
    this.oEle.style.left = `${this.curX}px`;
  }
  onDrag (fn, isExcuteNow = false) {
    if (isExcuteNow) {
      fn(this.curX);
    }
    this.onDragCallBacks.push(fn);
  }
  onDragEnd (fn, isExcuteNow = false) {
    fn(this.curX);
    this.onDragEndCallBacks.push(fn);
  }
}
const dragX = {
  bind (el, binding, vnode, oldVnode) {
    setTimeout(function () {
      let max = parseFloat(el.parentNode.offsetWidth);
      let min = max * parseFloat(el.dataset.min) / 100 || 0;
      let start = max * parseFloat(el.dataset.start) / 100 || 0;
      let dragEle = new DragX(el, min, max, start);
      if (binding.value && typeof binding.value === 'function') {
        dragEle.onDrag(binding.value, true);
      }
    }, 0);
  }
};
export default dragX;

