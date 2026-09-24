export const SIZE = 24;
export const PACES = { chill: 155, normal: 105, fast: 65 };
export function createGame(random = Math.random) {
  const game = { snake: [{x:9,y:12},{x:8,y:12},{x:7,y:12},{x:6,y:12}], direction: {x:1,y:0}, queue: [], food: null, score: 0, status: 'ready' };
  game.food = spawnFood(game.snake, random);
  return game;
}
export function spawnFood(snake, random = Math.random) {
  const occupied = new Set(snake.map(p => p.y * SIZE + p.x));
  const free = [];
  for (let y=0;y<SIZE;y++) for(let x=0;x<SIZE;x++) if(!occupied.has(y*SIZE+x)) free.push({x,y});
  return free.length ? free[Math.floor(random()*free.length)] : null;
}
export function turn(game, direction) {
  const previous = game.queue.at(-1) || game.direction;
  if(game.status !== 'running' || game.queue.length >= 2 || (direction.x === -previous.x && direction.y === -previous.y) || (direction.x === previous.x && direction.y === previous.y)) return;
  game.queue.push(direction);
}
export function step(game, random = Math.random) {
  if(game.status !== 'running') return false;
  game.direction = game.queue.shift() || game.direction;
  const head = {x:game.snake[0].x+game.direction.x,y:game.snake[0].y+game.direction.y};
  const eating = game.food && head.x === game.food.x && head.y === game.food.y;
  const body = eating ? game.snake : game.snake.slice(0,-1);
  if(head.x<0 || head.y<0 || head.x>=SIZE || head.y>=SIZE || body.some(p=>p.x===head.x && p.y===head.y)) {game.status='over';return false;}
  game.snake.unshift(head);
  if(eating) {game.score+=10;game.food=spawnFood(game.snake,random);if(!game.food) game.status='won';} else game.snake.pop();
  return Boolean(eating);
}
