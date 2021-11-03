
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
        allowedMoves: [FREE_CELL, RABBIT_CELL]
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

const isSafePath =(pathSide)=> {
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

const possibleCell = {}
const matrix = [
    [0,0,0,1,0,0,0],
    [0,0,3,0,2,0,0],
    [0,0,0,0,0,0,0],
    [0,4,0,0,0,0,0],
    [0, 0,0,0,0,3,3],
    [0,2,0,0,0,0,2],
    [0, 0,0,0,0,0,0],
]


window.addEventListener('keydown',(e) => {
    code = e.keyCode;
    keyControls(code);
});



function keyControls(code){
    moveCharachter(RABBIT_CELL,code);
}

function moveCharachter(character,code){
    const getCharacterIndex = getCharacterCordinates(character);
    const getAllDirectionIndexes = getAllMoves(character);  //Object
    moveRabbit(getCharacterIndex, getAllDirectionIndexes,character,code);
}


function moveRabbit(getCharacterIndex,getAllDirectionIndexes,character,code){
    const [currentX, currentY] = getCharacterIndex;
    let  isSafeToGoPath;
    const moves = {};
    let array = [];
    let portal;
    let constAllowedMoves = characters[character].allowedMoves;

    Object.keys(getAllDirectionIndexes).forEach(key => {
        isSafePath(getAllDirectionIndexes[key]);
        portal = isSafePath(getAllDirectionIndexes[key]);
        const [newX,newY] = portal;

       if(constAllowedMoves.includes(matrix[newX][newY])){
           moves[key] = [newX,newY];
       }
    });
    
       Object.keys(moves).forEach(key => {
        const [moveX,moveY] = moves[key];
       if(key == code){
           matrix[currentX][currentY] = FREE_CELL;
           matrix[moveX][moveY] = character;
       }
    });
    console.log(matrix);
}
function getPossibleMoveDirection(){
    
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

function getAllMoves(character){
    const [x,y] = getCharacterCordinates(character);
    return {
        37: [newX,newY] = [x, y - 1],
        38: [newX,newY] = [x - 1, y],
        39: [newX,newY] = [x, y + 1],
        40: [newX,newY] = [x + 1, y], 
    }
}

