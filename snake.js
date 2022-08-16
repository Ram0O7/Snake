import {getInputDirection} from "./input.js"

let snakeSpeed = 7;
const speedBtns = document.querySelectorAll('.speed');

const speedContainer = document.querySelectorAll('span');
let currentSpeed = document.createElement('span');
currentSpeed.classList.add('speednow');

for (let i = 0; i < speedBtns.length; i++){
    speedBtns[i].addEventListener('click', () => {
        speedContainer[0].appendChild(currentSpeed);
        if (speedBtns[i].innerHTML == '+') {
            snakeSpeed > 0&&snakeSpeed<20 ? snakeSpeed++ : snakeSpeed = 7;
        } else {
            snakeSpeed>1 ? snakeSpeed-- : snakeSpeed=1;
        }
        currentSpeed.innerHTML = snakeSpeed;
    })
}

const snakeBody = [{ x: 12, y: 12 }];
let newInstance = 0;

function update() {
    addInstances();
    const inputDirection = getInputDirection();
    for (let i = snakeBody.length - 2; i >= 0; i--){
        snakeBody[i + 1] = { ...snakeBody[i] };
    }

    snakeBody[0].x += inputDirection.x;
    snakeBody[0].y += inputDirection.y;
}

function draw(canvas) {
    snakeBody.forEach(instance => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = instance.y;
        snakeElement.style.gridColumnStart = instance.x;
        snakeElement.classList.add('snake');
        canvas.appendChild(snakeElement);
    });
}

function expandSnake(amount) {
    newInstance += amount;
}

function onSnake(position, { ignoreHead = false } = {}) {
    return snakeBody.some((instance, index) => {
        if(ignoreHead && index === 0) return false
        return equalPositions(instance, position)
    });
}

export function getSnakeHead() {
    return snakeBody[0];
}
export function snakeIntersectItself() {
    return onSnake(snakeBody[0], { ignoreHead: true });
}

function equalPositions(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
}

function addInstances() {
    for (let i = 0; i < newInstance; i++){
        snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
    }
    newInstance = 0;
}

export { snakeSpeed,update,draw,expandSnake,onSnake,speedContainer };