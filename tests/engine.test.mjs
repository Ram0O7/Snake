import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, step, turn, spawnFood, SIZE } from '../engine.js';
function running(){const g=createGame(()=>0);g.status='running';return g;}
test('eating grows snake, adds points and spawns unoccupied food',()=>{const g=running();g.food={x:10,y:12};assert.equal(step(g,()=>0),true);assert.equal(g.score,10);assert.equal(g.snake.length,5);assert.ok(!g.snake.some(p=>p.x===g.food.x&&p.y===g.food.y));});
test('reject reverse input and preserve quick corner sequence',()=>{const g=running();turn(g,{x:-1,y:0});assert.equal(g.queue.length,0);turn(g,{x:0,y:-1});turn(g,{x:-1,y:0});step(g);assert.deepEqual(g.snake[0],{x:9,y:11});step(g);assert.deepEqual(g.snake[0],{x:8,y:11});});
test('wall collision ends run',()=>{const g=running();g.snake[0]={x:23,y:12};step(g);assert.equal(g.status,'over');});
test('self collision ends run',()=>{const g=running();g.snake=[{x:2,y:2},{x:2,y:3},{x:3,y:3},{x:3,y:2},{x:4,y:2}];step(g);assert.equal(g.status,'over');});
test('vacating tail cell is safe',()=>{const g=running();g.snake=[{x:2,y:2},{x:2,y:3},{x:3,y:3},{x:3,y:2}];step(g);assert.equal(g.status,'running');});
test('paused game cannot advance or queue turns',()=>{const g=running();g.status='paused';const before=JSON.stringify(g);step(g);turn(g,{x:0,y:1});assert.equal(JSON.stringify(g),before);});
test('full board has no food and final apple wins',()=>{const all=Array.from({length:SIZE*SIZE},(_,i)=>({x:i%SIZE,y:Math.floor(i/SIZE)}));assert.equal(spawnFood(all),null);const g=running();g.snake=all.slice(0,-1).reverse();g.direction={x:1,y:0};g.food={x:23,y:23};step(g);assert.equal(g.status,'won');assert.equal(g.food,null);});
