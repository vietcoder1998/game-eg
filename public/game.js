const root = document.querySelector("canvas#root")

const game = new GameController(root, 200, 100, 400, 800);
const character = new Sprite(game.ctx, 20, 20, 40, 40);
game.add(character)
game.start();