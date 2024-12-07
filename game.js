import { 
    vectorEquals,
    vectorSub,
    vectorSum,
    vectorInvert,
} from "./vector.js"

// Precisam ser multiplos de CELL_RADIUS
const MAP_WIDTH = 600
const MAP_HEIGHT = 300

const CELL_RADIUS = 12
const L_BORDER = CELL_RADIUS
const R_BORDER = MAP_WIDTH - CELL_RADIUS
const U_BORDER = CELL_RADIUS
const D_BORDER = MAP_HEIGHT - CELL_RADIUS
const FOOD_AMOUNT = 5

const eGameStates = {
    IDLE: 1,
    ON_GOING: 2,
    OVER: 0
}

const eDirections = {
    UP: [-CELL_RADIUS, 0],
    DOWN: [CELL_RADIUS, 0],
    LEFT: [0, -CELL_RADIUS],
    RIGHT: [0, CELL_RADIUS],
}

let gameState = eGameStates['IDLE']
let pointsCounter = 0
let updatedCounterFlag = false
let updatedHighScoreFlag = false
let highScore = 0

const snake = {
    cells: [[L_BORDER, U_BORDER]],
    direction: eDirections['RIGHT'],
    size: 1,
}

const food = {
    cells: [],
    amount: 0
}

function changeGameState(state) {
    gameState = eGameStates[state]
}

function gameIsOver() {
    return gameState == eGameStates['OVER']
}

function gameIsIdle() {
    return gameState == eGameStates['IDLE']
}

function ateFood() {
    let head = snake.cells[0]
    growSnake()
    let foodIndex = food.cells.findIndex(food => vectorEquals(food, head))
    food.cells.splice(foodIndex, 1)
    food.amount -= 1
    pointsCounter += 1
    updatedCounterFlag = true
}

function gameTick() {
    moveSnake()
    if ( verifyIfCollided() ) {
        gameOver()
        return
    }
    if ( verifyIfAteFood() ) ateFood()
    if ( verifyIfNoFood() ) generateFood()
}

function gameOver() {
    gameState = eGameStates['OVER']
    resetGame()
}

function mapWrap(vector) {
    let x = vector[0]
    let y = vector[1]

    if ( x == MAP_HEIGHT ) x = U_BORDER
    else if ( x == 0 ) x = D_BORDER
    
    if  ( y == MAP_WIDTH ) y = L_BORDER
    else if ( y == 0 ) y = R_BORDER

    return [x, y]
}

// Considerar raio da celula
function getRandomCell() {
    let x = Math.floor(Math.random() * (D_BORDER - U_BORDER + 1) + U_BORDER)
    let y = Math.floor(Math.random() * (R_BORDER - L_BORDER + 1) + L_BORDER)
    
    // Transformando os numeros em multiplos de CELL_RADIUS
    x = (x * CELL_RADIUS) % D_BORDER + U_BORDER
    y = (y * CELL_RADIUS) % R_BORDER + L_BORDER

    return [x, y]
}

/*
    Introduzir peso do tamanho da cobra.
    A quantidade de comida gerada tem que ser
    inversamente proporcional ao tamanho da cobra.
*/
function generateFood() {

    for (let i = 0; i < FOOD_AMOUNT; i++) {
        let randCell = getRandomCell()

        let isFoodCell = food.cells.some(cell => vectorEquals(cell, randCell))
        let isSnakeCell = snake.cells.some(cell => vectorEquals(cell, randCell))

        while ( isFoodCell || isSnakeCell ) {
            randCell = getRandomCell()
            isFoodCell = food.cells.some(cell => vectorEquals(cell, randCell))
            isSnakeCell = snake.cells.some(cell => vectorEquals(cell, randCell))
        }

        food.cells.push(randCell)
    }

    food.amount = FOOD_AMOUNT
}

function growSnake() {
    let dVec
    const tail = snake.cells[snake.size - 1]

    if ( snake.size == 1 ) 
        dVec = vectorInvert(snake.direction)

    else {
        const secondLast = snake.cells[snake.size - 2]
        dVec = vectorInvert(vectorSub(tail, secondLast))
    }

    const newCell = mapWrap(vectorSum(tail, dVec))

    snake.cells.push(newCell)
    snake.size += 1
}

function moveSnake() {
    const head = snake.cells[0]
    const newHead = mapWrap(vectorSum(head, snake.direction))

    snake.cells.splice(0, 0, newHead)
    snake.cells.pop()
}

function changeSnakeDirection(direction) {
    let newDirection = eDirections[direction]
    if ( snake.size > 1 && vectorEquals(vectorInvert(snake.direction), newDirection) )
        return
    snake.direction = eDirections[direction]
}

function resetGame() {

    if ( pointsCounter > highScore ) {
        highScore = pointsCounter
        updatedHighScoreFlag = true
    }

    // Resetando os pontos
    pointsCounter = 0
    updatedCounterFlag = true
    
    // Resetando a comida
    food.cells = []
    food.amount = 0

    // Resetando a cobra
    snake.cells = [[L_BORDER, R_BORDER]]
    snake.direction = eDirections['RIGHT']
    snake.size = 1
}

function verifyIfAteFood() {
    const head = snake.cells[0]
    return food.cells.some(food => vectorEquals(food, head))
}

function verifyIfNoFood() {
    return food.amount == 0
}

function verifyIfCollided() {
    const head = snake.cells[0]
    const hasColided = snake.cells.some((node, index) => {
        return index != 0 && vectorEquals(head, node)
    })
    return hasColided
}

function updatedPointsCounter() {
    return updatedCounterFlag
}

function restoreCounterFlag() {
    updatedCounterFlag = false
}

function updatedHighScore() {
    return updatedHighScoreFlag
}

function restoreHighScoreFlag() {
    updatedHighScoreFlag = false
}

function getHighScore() {
    return highScore
}

function getNumPoints() {
    return pointsCounter
}

function getSnakeCells() {
    return snake.cells
}

function getFoodCells() {
    return food.cells
}

export {
    CELL_RADIUS,
    changeSnakeDirection,
    getSnakeCells,
    getFoodCells,
    gameTick,
    changeGameState,
    restoreCounterFlag,
    updatedPointsCounter,
    getNumPoints,
    updatedHighScore,
    restoreHighScoreFlag,
    getHighScore,
    gameIsOver,
    gameIsIdle,
}