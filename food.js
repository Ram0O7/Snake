import { onSnake, expandSnake,speedContainer } from "./snake.js"
import {randomGridPosition} from "./grid.js"

const currentSize = document.createElement('span');
currentSize.classList.add('speednow');
speedContainer[1].appendChild(currentSize);

const foodSound = new Audio('food.mp3');
let food = getRandomFoodPostion();
let EXPANSION_RATE = 1;
const ExpansionBtns = document.querySelectorAll('.size');

for (let i = 0; i < ExpansionBtns.length; i++){
    ExpansionBtns[i].addEventListener('click', () => {
        if (ExpansionBtns[i].innerHTML == '+') {
            EXPANSION_RATE>0&&EXPANSION_RATE<10 ? EXPANSION_RATE++ : EXPANSION_RATE=1;
        } else {
            EXPANSION_RATE>1 ? EXPANSION_RATE-- : EXPANSION_RATE = 1;
        }
        currentSize.innerHTML = EXPANSION_RATE;

    })
}

let foodCount = 0;

function update() {
    if (onSnake(food)) {
        foodCount++;
        foodSound.play();
        expandSnake(EXPANSION_RATE)
        food = getRandomFoodPostion();
    }
}

function draw(canvas) {
        const foodElement = document.createElement('div');
        foodElement.style.gridRowStart = food.y;
        foodElement.style.gridColumnStart = food.x;
        foodElement.classList.add('food');
        canvas.appendChild(foodElement);
}

function getRandomFoodPostion() {
    let newFoodPosition;
    while (newFoodPosition == null || onSnake(newFoodPosition)) {
        newFoodPosition = randomGridPosition();
    }
    return newFoodPosition;
}

export {update,draw,foodCount}