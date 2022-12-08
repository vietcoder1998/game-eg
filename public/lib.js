class Render {
  constructor(ctx, x, y, w, h) {
    if (ctx) {
      this.drawLine(ctx, x, y, w, h);
    }
  }
  static drawLine(ctx, x, y, w, h) {
    ctx.fill();
    ctx.beginPath();

    ctx.moveTo(x - 20, y - 20);
    ctx.lineTo(x + 20, y + 20);

    ctx.moveTo(x + 20, y - 20);
    ctx.lineTo(x - 20, y + 20);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  static drawRect(ctx, x, y, w, h, color, colorStroke) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    if (color) {
      ctx.fillStyle = color;
    }
    if (colorStroke) {
      ctx.strokeStyle = colorStroke;
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}
class Vector2D {
  x = 0;
  y = 0;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  clear() {
    this.x = 0;
    this.y = 0;
  }
}
class Vector3D {
  x = 0;
  y = 0;
  z = 0;
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Collision {
  /**
   * dectect with singgle value and 4 point
   *
   * @param   {Vector2D}  vector2D  [vector2D description]
   * @param   {Vector2D[]}  range         [x description]
   * @return  {boolean}            [return description]
   */
  static detectRect(vector2D, range) {
    const [point1, point2, point3, point4] = range;
    if (
      vector2D &&
      range &&
      vector2D.x > point1.x &&
      vector2D.x < point2.x &&
      vector2D.y > point3.y &&
      vector2D.y < point4.y
    ) {
      return true;
    }

    return false;
  }

  /**
   * break posin to arrayAttachment
   *
   * @param   {number}  x  [x description]
   * @param   {number}  y  [y description]
   * @param   {number}  w  [w description]
   * @param   {number}  h  [h description]
   *
   * @return  {Vector2D[]}     [return description]
   */

  static createPointCollision(target) {
    const { x, y, w, h } = target;
    return [
      new Vector2D(x, y),
      new Vector2D(x + w, y ?? 0),
      new Vector2D(x + w, y + (h ?? 0)),
      new Vector2D(x, y + y + (h ?? 0)),
    ];
  }

  /**
   * check Collision if have a rangeDetect from
   *
   * @param   {GameObject>}  attack   [point description]
   * @param   {GameObject}  target  [target description]
   *
   * @return  {boolean}          [return description]
   */

  static detectRangeCollision(attack, target) {
    const rangeDetect = Collision.createPointCollision(target);

    return Collision.detectRect(new Vector2D(attack.x, attack.y), rangeDetect);
  }
  center(x, y, w, h) {
    return {
      x: x + w / 2,
      y: y + h / 2,
    };
  }
  doubleCollision() {}
}
class GameObject {
  ctx;
  id;
  name;
  type;
  x = 20;
  y = 20;
  z = 20;
  // width, height
  w = 20;
  h = 20;
  // gravity
  g = 0;
  direction = new Vector3D(0, 0, 0);
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
  cache = {
    x: this.x,
    y: this.y,
    w: this.w,
    h: this.h,
    direction: this.direction,
  };
  _reality() {
    if (this.g) {
      this.direction.y += this.g;
    }

    if (this.direction) {
      this.y += this.direction.y;
      this.x += this.direction.x;
    }
  }
  _live() {}
  start() {}
  init() {}
  checkCollision(target) {
    const _this = this;
    return Collision.detectRangeCollision(_this, target);
  }
  checkListCollision(targetList) {
    const detectList = targetList.filter((target) => {
      return this.checkCollision(target);
    });

    return detectList;
  }
  subscribe(name, $event) {}
  clear() {
    this.ctx.clearRect(this.x, this.y, this.w, this.h);
  }
  loop() {}
  draw() {
    this.clear();
    if (this.ctx) {
      const boudary = this.boudary();
      Render.drawRect(
        this.ctx,
        boudary.x,
        boudary.y,
        boudary.w,
        boudary.h,
        "#00000000",
        "#34eb6e"
      );
      Render.drawRect(
        this.ctx,
        this.x,
        this.y,
        this.w,
        this.h,
        "black",
        "black"
      );
    } else {
      console.log("ctx is not exists");
    }
  }
  center() {
    return new Vector2D(this.x + this.w / 2, this.y + this.h / 2);
  }
  boudary() {
    return {
      x: this.x - 10,
      y: this.y - 10,
      w: this.w + 20,
      h: this.h + 20,
    };
  }
  _stop() {}
}
class Scene extends GameObject {
  constructor(ctx, x, y, w, h) {
    super(ctx, x, y, w, h);
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}
class Mouse extends GameObject {
  constructor(ctx, x, y, w, h) {
    super(ctx, x, y, w, h);
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
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
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  _live() {
    this._reality();
  }
}
class GameController {
  base = {
    millitime: 1000,
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
  millitime = this.base.millitime;
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
  dataCollision = [];
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
  _checkAllCollision() {
    const allObject = this.getAllObject();
    const dataCheckList = Object.values(allObject);

    const dataList = dataCheckList.filter(
      (dataCheck) =>
        dataCheck && dataCheck.checkListCollision(dataCheckList).length > 0
    );

    if (dataList.length > 0) {
      console.log(dataList);
      dataList.forEach((data) => {
        data.direction = {
          x: data.direction.x,
          y: -data.direction.y + data.g,
        };
      });
    }
    this.dataCollision = dataList;
  }
  //
  // warning time with this is error
  _render() {
    const totallOject = this.getAllObject();
    this._clear();
    Object.entries(totallOject).forEach(([key, item]) => {
      item._live();
      item.loop();
      item.draw();
    });
  }
  _clear() {
    this.ctx.clearRect(0, 0, this.w + 20, this.h + 20);
    this.ctx.restore();
  }
  _runAway() {
    this.interval = setInterval(() => {
      try {
        this._checkAllCollision();
        this._render();
      } catch (error) {
        this._destroy();
        this._reset();
        console.error("Error: ", error);
      }
    }, this.millitime / this.fps);
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
    this.millitime = this.base.millitime;
    this.fps = this.base.fps;
  }
  _stop() {
    console.log("clear it");
    clearInterval(this.interval);
  }
  _saveCache() {
    this.cache = {
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
      objList: this.objList,
      ctx: this.ctx,
      millitime: this.millitime,
      fps: this.fps,
    };
  }
  _pause() {
    this._saveCache();
    this.millitime = 0;
  }
  _resume() {
    this.millitime = this.cache.millitime;
  }
}
