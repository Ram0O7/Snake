import {snakeSpeed,getSnakeHead,snakeIntersectItself,update as updateSnake,draw as drawSnake} from './snake.js'
import {update as updateFood,draw as drawFood,foodCount} from "./food.js"
import {outsideGrid} from "./grid.js"


const gameOverSound = new Audio('gameover.mp3');
let lastRenderTime = 0;
let gameOver = false;
const canvas = document.getElementById('canvas');



function main(currentTime) {
    if (gameOver) {
        const score = document.createElement('h1');
        score.innerHTML = "Your Score: " + (foodCount);
        score.classList.add('score');
        document.body.appendChild(score);
        gameOverSound.play();
        if (confirm('00PS!  YOU LOST...PRESS OK TO PLAY AGAIN')) {
            window.location = 'index.html'
        }
        return
    }

    window.requestAnimationFrame(main)
    const secondSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondSinceLastRender < 1 / snakeSpeed) return
    
    lastRenderTime = currentTime;

    update();
    draw();
}
window.requestAnimationFrame(main);

function update() {
    updateSnake();
    updateFood();
    checkForGameOver();
}

function draw() {
    canvas.innerHTML = '';
    drawSnake(canvas);
    drawFood(canvas);
}

function checkForGameOver() {
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersectItself();
}