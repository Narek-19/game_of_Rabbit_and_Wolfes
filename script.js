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
    const getCharacterCellCordinates = getCharacterCordinates(character);
    const getAllDirectionsCordinates = getAllMoves(character); //Object
    const getPossibleCellsForMove = getAllowedMoves(getCharacterCellCordinates, getAllDirectionsCordinates,character,code);
    console.log(getPossibleCellsForMove);

}

 
function getAllowedMoves(getCharacterCellCordinates,getAllDirectionsCordinates,character,code){
    const characterAllowedCells = characters[character].allowedMoves;
    // where can character go
    const possibleCordinates = [];

    Object.keys(getAllDirectionsCordinates).forEach(key => {
    let possibleCell = [x1,y1] = getAllDirectionsCordinates[key];
    if(characterAllowedCells.includes(matrix[x1][y1])){
        possibleCordinates.push(possibleCell);
        }
    });
    return possibleCordinates;
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















// function  getNextCellCharacter(getCharacterNextCell,character){
//     const [x,y] = getCharacterNextCell;
//     return matrix[x][y];
// }
// // Check if the next cell is possible to move
// function isAllowedToMove(pathSide,character){
//     let [x,y] = pathSide;
    
//     // characters.character.
//     // If the character is top or left side
//     x < 0 &&  (x = matrix.length - 1);
//     y < 0 && (y = matrix.length - 1);

//     // if the character is right or bottom side
//     x > matrix.length - 1 && (x = 0);
//     y > matrix.length - 1 && (y = 0);
    
//     // return safe path for moving rabbit
//     return [x,y];
// }








// function getNeighbourCellsCharacter(getCharacterCellCordinates,getAllDirectionsCordinates){
//     const [x,y] = getCharacterCellCordinates;
//     return [
//         matrix[x][y-1],
//         matrix[x - 1][y],
//         matrix[x][y + 1],
//         matrix[x+1][y],
//     ]
// }