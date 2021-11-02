directionLeft = true
// crush
// crush
const FREE_CELL = 0;
const RABBIT_CELL = 1;
const WOLF_CELL = 2;
const BAN_CELL = 3;
const HOUSE_CELL = 4;
const ROCK_CELL = 5;

const characters = {
    [RABBIT_CELL]: {
        name: "rabbit",
        id: RABBIT_CELL,
        allowedMoves: [FREE_CELL, WOLF_CELL, HOUSE_CELL],
    },
    [WOLF_CELL]:{
        name: "wolf",
        id: WOLF_CELL,
        allowedMoves: [FREE_CELL, RABBIT_CELL, HOUSE_CELL]
    },
    [ROCK_CELL]:{
        name: "rock",
        id:ROCK_CELL,
    },
    [HOUSE_CELL]:{
        name: "house",
        id: HOUSE_CELL,
    }
}

const MOVE_DIRECTIONS = ["left", "top", "right", "down"];

const matrix = [
    [0,0,0,0,0,0, 0],
    [0,0,0,1,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0, 0,0,0,0,3,3],
    [0,2,0,0,0,0,2],
    [0, 0,0,0,0,0,0],
]
window.addEventListener('keydown',(e) => {
    code = e.keyCode;
    keyControls(code);
});

function keyControls(code){
    switch(code){
        case 37:
            moveCharachter(MOVE_DIRECTIONS[0],RABBIT_CELL);
        break;
        case 38:
            moveCharachter(MOVE_DIRECTIONS[1],RABBIT_CELL);
        break;
        case 39:
            moveCharachter(MOVE_DIRECTIONS[2],RABBIT_CELL);
        break;
        case 40:
            moveCharachter(MOVE_DIRECTIONS[3],RABBIT_CELL);
        break;
    }
}

function moveCharachter(direction, character){
    rabbitMoveProcess(direction, character);
    
}

function rabbitMoveProcess(direction, character){
    let getRabbitCurrentCell = getCharacterCordinates(character);
    let getRabbitNextCells = getAllMoves(character);
    let getRabbitNextPath;

    
   Object.keys(getRabbitNextCells).forEach(key => {
    if(direction === key){
        getRabbitNextPath = isSafePath(getRabbitNextCells[key]);
        }
    });
    
    moveRabbit(getRabbitNextPath,getRabbitCurrentCell,character);
};

// Check if the next cell is possible to move for Rabbit
function isSafePath(pathSide){
    let [x,y] = pathSide;

    // If the character is top or left side
    x < 0 &&  (x = matrix.length - 1);
    y < 0 && (y = matrix.length - 1);

    // if the character is right or bottom side
    x > matrix.length - 1 && (x = 0);
    y > matrix.length - 1 && (y = 0);
    
    // return safe path for moving rabbit
    return [x,y];
}


// Move rabbit cordinates depend on direction
function moveRabbit(getRabbitNextPath,getRabbitCurrentCell,character){
    const [newX,newY] = getRabbitNextPath;
    const [currentX,currentY] = getRabbitCurrentCell;
    matrix[currentX][currentY] = FREE_CELL;
    matrix[newX][newY] = RABBIT_CELL;
    console.log(matrix);
    checkCharacterStatus();
}

function checkCharacterStatus(){
    
}

function getAllMoves(character){
    const [x,y] = getCharacterCordinates(character);
    return {
        left: [newX,newY] = [x, y - 1],
        top:  [newX,newY] = [x - 1, y],
        right: [newX,newY] = [x, y + 1],
        down: [newX,newY] = [x + 1, y], 
    }
}

function getCharacterCordinates(character){
    let getCordinates;
    matrix.forEach((array, rowIndex) => {
        array.forEach((element, columnIndex) => {
           if(element === character){
               return getCordinates = [x,y] = [rowIndex, columnIndex];
           }
        });
    });
    return getCordinates;
}


