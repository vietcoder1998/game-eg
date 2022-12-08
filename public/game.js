const root = document.querySelector("canvas#root");

const game = new GameController(root, 200, 100, 400, 800);
const box = new Sprite(game.ctx, 20, 20, 40, 40);
const linder = new Sprite(game.ctx, 0, 400, 800, 40);

box.g = 0.1;
game.add(box);
game.add(linder, "linder");
game.start();

function reset() {
  game._reset();
}

function stopGame() {
  game._stop();
}

function resetGravity() {
    box.g = 0;
    console.log(g)
}
