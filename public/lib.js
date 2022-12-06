class GameObject {
  ctx;
  x;
  y;
  w;
  h;

  constructor(ctx, x, y, w, h) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.init();
  }

  init() {}
  subscribe(name, $event) {}
}

class Scene extends GameObject {}
class Mouse extends GameObject {}
class Sprite extends GameObject {}

class GameController {
  root;
  objList;
  objBaseList;
  constructor(root, x, y, w, h) {
    this.root = root;
    this.objBaseList = {
      screen: new Scene(),
      mouse: new Mouse(),
    };
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    // init

    // publish event
    this.root.addEventListener("mousedown", (e) =>
      this.subscribe("mousedown", e)
    );
    this.root.addEventListener("mouseup", (e) => this.subscribe("mouseup", e));
    this.root.addEventListener("mousemove", (e) =>
      this.subscribe("mousemove", e)
    );
    this.root.addEventListener("keyup", (e) => this.subscribe("keyup", e));
    this.root.addEventListener("keydown", (e) => this.subscribe("keydown", e));
    this.init();
  }
  init() {
    this.root.setAttribute("width", this.w);
    this.root.setAttribute("height", this.h);

    this.root.style.backgroundColor = "black";
    this.root.style.position = "absolute";
    this.root.style.top = this.y + "px";
    this.root.style.left = this.x + "px";
  }
  publish(name, $event) {
    Object.values(this.objList).forEach((item) => {
      if (item) {
        item.subscribe(name, $event, this);
      }
    });
    Object.values(this.objBaseList).forEach((item) => {
      if (item) {
        item.subscribe(name, $event, this);
      }
    });
  }
  setSize() {}
}
