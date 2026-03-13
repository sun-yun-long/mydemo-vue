/**
 * 蜘蛛触手动画引擎
 * 基于 Canvas 2D 的粒子触手效果
 */

// 计算两点之间的距离
function dist(p1x, p1y, p2x, p2y) {
  const dx = p2x - p1x;
  const dy = p2y - p1y;
  return Math.sqrt(dx * dx + dy * dy);
}

// 触手段（segment）类
class Segment {
  constructor(parent, l, a, isFirst) {
    this.l = l;
    this.ang = a;
    if (isFirst) {
      this.pos = { x: parent.x, y: parent.y };
    } else {
      this.pos = { x: parent.nextPos.x, y: parent.nextPos.y };
    }
    this.nextPos = {
      x: this.pos.x + this.l * Math.cos(this.ang),
      y: this.pos.y + this.l * Math.sin(this.ang),
    };
  }

  update(target) {
    this.ang = Math.atan2(target.y - this.pos.y, target.x - this.pos.x);
    this.pos.x = target.x + this.l * Math.cos(this.ang - Math.PI);
    this.pos.y = target.y + this.l * Math.sin(this.ang - Math.PI);
    this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
    this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
  }

  fallback(target) {
    this.pos.x = target.x;
    this.pos.y = target.y;
    this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
    this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
  }

  show(ctx) {
    ctx.lineTo(this.nextPos.x, this.nextPos.y);
  }
}

// 触手（tentacle）类
class Tentacle {
  constructor(x, y, l, n) {
    this.x = x;
    this.y = y;
    this.l = l;
    this.n = n;
    this.rand = Math.random();
    this.t = {};

    // 预计算颜色值，避免每帧重复拼接字符串
    this.color = `hsl(${this.rand * 60 + 180}, 100%, ${this.rand * 60 + 25}%)`;
    this.lineWidth = this.rand * 2;
    this.dotRadiusActive = 2 * this.rand + 1;
    this.dotRadiusInactive = this.rand * 2;

    // 构建 segment 链
    const segLen = this.l / this.n;
    this.segments = [new Segment(this, segLen, 0, true)];
    for (let i = 1; i < this.n; i++) {
      this.segments.push(new Segment(this.segments[i - 1], segLen, 0, false));
    }
  }

  move(lastTarget, target) {
    const angle = Math.atan2(target.y - this.y, target.x - this.x);
    const dt = dist(lastTarget.x, lastTarget.y, target.x, target.y);
    this.t.x = target.x - 0.8 * dt * Math.cos(angle);
    this.t.y = target.y - 0.8 * dt * Math.sin(angle);

    // 更新最后一段
    const moveTarget = this.t.x ? this.t : target;
    this.segments[this.n - 1].update(moveTarget);

    // 逆序更新其余段
    for (let i = this.n - 2; i >= 0; i--) {
      this.segments[i].update(this.segments[i + 1].pos);
    }

    // 回弹检查
    const distToTarget = dist(this.x, this.y, target.x, target.y);
    if (distToTarget <= this.l + dt) {
      this.segments[0].fallback({ x: this.x, y: this.y });
      for (let i = 1; i < this.n; i++) {
        this.segments[i].fallback(this.segments[i - 1].nextPos);
      }
    }
  }

  // 绘制触手线条
  showLine(ctx, target) {
    if (dist(this.x, this.y, target.x, target.y) > this.l) return;

    ctx.globalCompositeOperation = "lighter";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    for (let i = 0; i < this.n; i++) {
      this.segments[i].show(ctx);
    }
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
  }

  // 绘制触手圆点
  showDot(ctx, target) {
    ctx.beginPath();
    if (dist(this.x, this.y, target.x, target.y) <= this.l) {
      ctx.arc(this.x, this.y, this.dotRadiusActive, 0, 2 * Math.PI);
      ctx.fillStyle = "white";
    } else {
      ctx.arc(this.x, this.y, this.dotRadiusInactive, 0, 2 * Math.PI);
      ctx.fillStyle = "darkcyan";
    }
    ctx.fill();
  }
}

/**
 * 蜘蛛触手动画类
 * 封装整个动画逻辑，方便在 Vue 组件中管理生命周期
 */
export default class SpiderAnimation {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // 配置参数（可自定义）
    this.maxLength = options.maxLength || 400;
    this.minLength = options.minLength || 50;
    this.segmentCount = options.segmentCount || 30;
    this.tentacleCount = options.tentacleCount || 600;
    this.easing = options.easing || 10;  // 目标点跟随的缓动系数

    // 状态变量
    this.mouse = { x: false, y: false };
    this.lastMouse = {};
    this.target = { x: 0, y: 0, errx: 0, erry: 0 };
    this.lastTarget = { x: 0, y: 0 };
    this.t = 0;
    this.q = 10;
    this.animationId = null;
    this.tentacles = [];

    // 绑定方法（方便添加/移除事件监听）
    this._onResize = this._handleResize.bind(this);
    this._onMouseMove = this._handleMouseMove.bind(this);
    this._onMouseLeave = this._handleMouseLeave.bind(this);
    this._onTouchMove = this._handleTouchMove.bind(this);
    this._onTouchEnd = this._handleTouchEnd.bind(this);

    this._init();
  }

  _init() {
    this._resize();
    this._createTentacles();
    this._bindEvents();
    this._loop();
  }

  _resize() {
    this.w = this.canvas.width = window.innerWidth;
    this.h = this.canvas.height = window.innerHeight;
  }

  _createTentacles() {
    this.tentacles = [];
    for (let i = 0; i < this.tentacleCount; i++) {
      this.tentacles.push(
        new Tentacle(
          Math.random() * this.w,
          Math.random() * this.h,
          Math.random() * (this.maxLength - this.minLength) + this.minLength,
          this.segmentCount
        )
      );
    }
  }

  _bindEvents() {
    window.addEventListener("resize", this._onResize);
    this.canvas.addEventListener("mousemove", this._onMouseMove, false);
    this.canvas.addEventListener("mouseleave", this._onMouseLeave);
    // 移动端触摸支持
    this.canvas.addEventListener("touchmove", this._onTouchMove, { passive: false });
    this.canvas.addEventListener("touchend", this._onTouchEnd);
  }

  _unbindEvents() {
    window.removeEventListener("resize", this._onResize);
    this.canvas.removeEventListener("mousemove", this._onMouseMove);
    this.canvas.removeEventListener("mouseleave", this._onMouseLeave);
    this.canvas.removeEventListener("touchmove", this._onTouchMove);
    this.canvas.removeEventListener("touchend", this._onTouchEnd);
  }

  _handleResize() {
    this._resize();
    // 不再重复调用 loop，因为动画循环已经在运行
  }

  _handleMouseMove(e) {
    this.lastMouse.x = this.mouse.x;
    this.lastMouse.y = this.mouse.y;
    this.mouse.x = e.pageX - this.canvas.offsetLeft;
    this.mouse.y = e.pageY - this.canvas.offsetTop;
  }

  _handleMouseLeave() {
    this.mouse.x = false;
    this.mouse.y = false;
  }

  _handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    this.lastMouse.x = this.mouse.x;
    this.lastMouse.y = this.mouse.y;
    this.mouse.x = touch.pageX - this.canvas.offsetLeft;
    this.mouse.y = touch.pageY - this.canvas.offsetTop;
  }

  _handleTouchEnd() {
    this.mouse.x = false;
    this.mouse.y = false;
  }

  _draw() {
    const { ctx, w, h, mouse, target, lastTarget, tentacles, q } = this;

    // 计算目标点偏差
    if (mouse.x) {
      target.errx = mouse.x - target.x;
      target.erry = mouse.y - target.y;
    } else {
      // 无鼠标输入时，沿 ∞ 形（伯努利双纽线）轨迹运动
      const sinT = Math.sin(this.t);
      const cosT = Math.cos(this.t);
      const denom = sinT * sinT + 1;
      const factor = (h / 2 - q) * Math.SQRT2;
      target.errx = w / 2 + (factor * cosT) / denom - target.x;
      target.erry = h / 2 + (factor * cosT * sinT) / denom - target.y;
    }

    // 缓动跟随
    target.x += target.errx / this.easing;
    target.y += target.erry / this.easing;
    this.t += 0.01;

    // 绘制目标点光球
    ctx.beginPath();
    ctx.arc(
      target.x,
      target.y,
      dist(lastTarget.x, lastTarget.y, target.x, target.y) + 5,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "hsl(210, 100%, 80%)";
    ctx.fill();

    // 绘制触手圆点
    for (let i = 0; i < tentacles.length; i++) {
      tentacles[i].move(lastTarget, target);
      tentacles[i].showDot(ctx, target);
    }

    // 绘制触手线条
    for (let i = 0; i < tentacles.length; i++) {
      tentacles[i].showLine(ctx, target);
    }

    // 更新上一帧目标点
    lastTarget.x = target.x;
    lastTarget.y = target.y;
  }

  _loop() {
    this.animationId = requestAnimationFrame(() => this._loop());
    this.ctx.clearRect(0, 0, this.w, this.h);
    this._draw();
  }

  /**
   * 销毁动画，清理所有资源
   * 在 Vue 组件的 beforeDestroy/unmounted 中调用
   */
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this._unbindEvents();
    this.tentacles = [];
  }
}