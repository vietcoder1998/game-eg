class Logger {
  constructor(gameController) {
    this.gameController = Object.values({
      ...gameController.objList,
      ...gameController.objBaseList,
    });
  }
  createComponent() {
    const rootView = document.createElement("div");
    rootView.setAttribute("id", "rootView");
    rootView.setAttribute("style", "position: absolute; top: 0; right: 0");
  }
  renderComponent(component) {
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", component.id);
  }
  addRender() {
    const rootView = document.getElementById("rootView");
    rootView.appendChild(this.gameController[0]);
  }
  static log() {
    this.gameController.forEach((game) => {});
  }
}

class Debuger {
  _logFlag =  1;
  static log(...args) {
    if (this._logFlag) {
      console.table(...args);
    }

    this._logFlag = 0;
  }
}

class Draft {
  static render(ctx) {
    Render.render()
  }
}