class Render {
  constructor(ctx, x, y, w, h) {
    if (ctx) {
      this.drawLine(ctx, x, y, w, h);
    }
  }
  static drawLine(ctx, x, y, w, h) {
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.beginPath();

    ctx.moveTo(x - 20, y - 20);
    ctx.lineTo(x + 20, y + 20);

    ctx.moveTo(x + 20, y - 20);
    ctx.lineTo(x - 20, y + 20);
    ctx.stroke();
  }
  static drawRect(ctx, x, y, w, h) {
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.rect(x, y, w, h);
    ctx.stroke();
  }
}
class GameObject {
  ctx;
  id;
  name;
  type;
  x;
  y;
  w = 20;
  h = 20;
  root;
  _logFlag = 1;
  constructor(ctx, x, y, w, h) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.init();
  }

  start() {}
  init() {}
  subscribe(name, $event) {}
  clear() {
    this.ctx.clearRect(this.x, this.y, this.w, this.h);
  }
  render() {
    if (this.ctx) {
      Render.drawRect(this.ctx, this.x, this.y, 40, 40);
    } else {
      console.log("ctx is not exists");
    }
  }
}
class Scene extends GameObject {}
class Mouse extends GameObject {
  w = 20;
  h = 20;
  x = 0;
  y = 0;
  subscribe(name, $event) {
    switch (name) {
      case "mousemove":
        this.x = $event.offsetX;
        this.y = $event.offsetY;
        break;

      default:
        break;
    }
  }
}
class Sprite extends GameObject {
  constructor(ctx, x, y, w, h) {
    super(ctx, x, y, w, h);
  }
}
class GameController {
  base = {
    militime: 1000,
    fps: 30,
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    objList: {},
    objBaseList: {},
  };
  // setup
  objList = this.base.objList;
  objBaseList = this.base.objBaseList;
  militime = this.base.militime;
  fps = this.base.fps;
  x = this.base.x;
  y = this.base.y;
  w = this.base.w;
  h = this.base.h;
  // internal variable
  root;
  interval;
  cache = {};
  debug = 1;
  flags = {
    one: 0,
    away: 1,
    debug: 0,
  };
  // base when reset

  constructor(root, x, y, w, h) {
    const ctx = root.getContext("2d");
    this.root = root;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    // init

    this._saveCache();
    this.init();
  }
  init() {
    this.root.setAttribute("width", this.w);
    this.root.setAttribute("height", this.h);

    // set root
    this.root.style.backgroundColor = "gray";
    this.root.style.position = "absolute";
    this.root.style.top = this.y + "px";
    this.root.style.left = this.x + "px";

    // publish event
    this.root.addEventListener("mousedown", (e) =>
      this.publish("mousedown", e)
    );
    this.root.addEventListener("mouseup", (e) => this.publish("mouseup", e));
    this.root.addEventListener("mousemove", (e) =>
      this.publish("mousemove", e)
    );
    this.root.addEventListener("keyup", (e) => this.publish("keyup", e));
    this.root.addEventListener("keydown", (e) => this.publish("keydown", e));

    this.add(new Mouse(this.ctx, this.x, this.y, 10), "mouse", 1);

    Object.values(this.getAllObject()).forEach((item) => {
      if (item) {
        item.root = { ...this.cache };
        item.start();
      }
    });
  }
  // define paramester inside game contructor
  setup(data) {
    const _this = this;
    Object.entries(data).forEach(([key, value]) => {
      _this[key] = value;
    });
  }
  publish(name, $event) {
    Object.values(this.getAllObject()).forEach((item) => {
      if (item) {
        item.subscribe(name, $event, this);
      }
    });
  }
  setSize() {}
  add(obj, oId, isBase) {
    const id = new Date().getTime();

    if (obj) {
      obj.root = this;
      obj.x = this.x;
      obj.y = this.y;
      obj.id = oId ?? id;
      obj.ctx = this.ctx;

      if (isBase) {
        Object.assign(this.objBaseList, { [obj.id]: obj });
      } else {
        Object.assign(this.objList, { [obj.id]: obj });
      }
    } else {
      throw new Error("Invalid object");
    }
  }
  getObj(id) {
    if (id) {
      return Object.values(this.objList).find((item) => item.id === id);
    }
  }
  getMouse() {
    return this.objBaseList.mouse;
  }
  start() {
    this._runAway();
  }
  getAllObject() {
    const aObj = { ...this.objList, ...this.objBaseList };

    return aObj;
  }
  // warning time with this is error
  _render() {
    const totallOject = this.getAllObject();

    Object.entries(totallOject).forEach(([key, item]) => {
      item.render();
    });
  }
  _clear() {
    this.ctx.clearRect(this.x, this.y, this.w, this.h);
    this.ctx.restore();
  }
  _runAway() {
    this.interval = setInterval(() => {
      try {
        this._render();
      } catch (error) {
        this._destroy();
        this._reset();
      }
    }, this.militime / this.fps);
  }
  _destroy() {
    clearInterval(this.interval);
  }
  _restart() {
    this._destroy();
    this.init();
    this._runAway();
  }
  _reset() {
    this.x = this.base.x;
    this.y = this.base.y;
    this.w = this.base.w;
    this.h = this.base.h;
    this.objList = {};
    this.objBaseList = {};
    this.militime = this.base.militime;
    this.fps = this.base.fps;
    this.cache = {};
  }
  _saveCache() {
    this.cache = {
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
      objList: this.objList,
      ctx: this.ctx,
      militime: this.militime,
      fps: this.fps,
    };
  }
  _pause() {
    this._saveCache();
    this.militime = 0;
  }
  _resume() {
    this.militime = this.cache.militime;
  }
}