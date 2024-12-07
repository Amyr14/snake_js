import { 
    CELL_RADIUS,
    gameTick,
    getSnakeCells,
    changeSnakeDirection,
    changeGameState,
    gameIsIdle,
    gameIsOver,
    getFoodCells,
    updatedPointsCounter,
    restoreCounterFlag,
    updatedHighScore,
    restoreHighScoreFlag,
    getHighScore,
    getNumPoints,
} from "./game.js"

const pointsCounter = document.getElementById('pointsCounter')
const highScoreCounter = document.getElementById('highScoreCounter')
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

alert("To move the snake, use WASD. Press any key to start.")

// Lidando com inputs do teclado
document.addEventListener('keydown', (event) => {
    if ( gameIsIdle() || gameIsOver() ) {
        changeGameState('ON_GOING')
        return
    }

    const key = event.key.toLowerCase()

    switch ( key ) {
        case 'w':
            changeSnakeDirection('UP')
            break

        case 's':
            changeSnakeDirection('DOWN')
            break
        
        case 'a':
            changeSnakeDirection('LEFT')
            break
        
        case 'd':
            changeSnakeDirection('RIGHT')
            break
    }
})

function updatePointsCounterDiv() {
    pointsCounter.textContent = `Points: ${getNumPoints()}`
}

function updateHighScoreDiv() {
    highScoreCounter.textContent = `Highest Score: ${getHighScore()}`
}

function drawSnake() {
    for ( const node of getSnakeCells() ) {
        ctx.beginPath()
        ctx.arc(node[1], node[0], CELL_RADIUS, 0, 2 * Math.PI)
        ctx.fillStyle = 'green'
        ctx.fill()

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function drawFood() {
    for ( const node of getFoodCells() ) {
        ctx.beginPath()
        ctx.arc(node[1], node[0], CELL_RADIUS, 0, 2 * Math.PI)
        ctx.fillStyle = 'red'
        ctx.fill()
        
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const intervalID = setInterval(() => {

    if ( gameIsIdle() )
        return

    if ( gameIsOver() ) {
        clearCanvas()
        changeGameState('IDLE')
        alert('Game Over')
        return
    }

    if ( updatedPointsCounter() ) {
        updatePointsCounterDiv()
        restoreCounterFlag()
    }

    if ( updatedHighScore() ) {
        updateHighScoreDiv()
        restoreHighScoreFlag()
    }

    clearCanvas()
    drawSnake()
    drawFood()
    gameTick()
}, 50)