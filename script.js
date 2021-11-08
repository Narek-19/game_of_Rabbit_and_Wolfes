document.addEventListener('keydown', (e) => keyControls(e.keyCode))
const gameStatus = document.querySelector('.gameStatus');
const statusText = document.getElementById('statusText');
const matrixLenght = parseInt(document.getElementById("select").value, 10);

const BOX_WIDTH = 64

const BAN_CELL = 3;
const FREE_CELL = 0;
const WOLF_CELL = 2;
const ROCK_CELL = 5;
const HOUSE_CELL = 4;
const RABBIT_CELL = 1;
let matrix;
let board;

const gameSettings = {
    WOLFCOUNT: 3, 
    BANCOUNT:1,
}

const characters = {
    [RABBIT_CELL]: {
        name: "rabbit",
        src:'images/rabbit.png',
        allowedMoves: [FREE_CELL, WOLF_CELL, HOUSE_CELL],
    },
    [WOLF_CELL]:{
        name: "wolf",
        src:'images/gamewolf.png',
        allowedMoves: [FREE_CELL, RABBIT_CELL]
    },
    [BAN_CELL]:{
        src:'images/ban.png',
        name: "rock",    
    },
    [HOUSE_CELL]:{
        name: "house",
        src:'images/home.png',
    }
}

function startGame(){
    gameStatus.style.display = "none"
    createMatrix();
    setCharacterCounts();
    createUI();
    positionPlayers();
}


function setCharacterCounts(){
    gameSettings.WOLFCOUNT = (matrix.length * 40) / 100;
    gameSettings.BANCOUNT = (matrix.length * 40) / 100;

}

function createMatrix(){
    const intialMatrix = new Array(matrixLenght)
      .fill(FREE_CELL)
      .map(() => new Array(matrixLenght).fill(FREE_CELL));

    matrix = intialMatrix
  };

const createUI = () => {
    board = document.querySelector('.board');
    board.innerHTML = "";
    board.style.width = `${matrixLenght * BOX_WIDTH}`
    matrix.forEach((x,indexX)=>{
        x.forEach((y,indexY)=>{
            const cell = document.createElement("div");
            board.appendChild(cell);
            cell.id = `${indexX}${indexY}`;
        });
    })
};

const isSafePath = (pathSide, character) => {
    let [x,y] = pathSide;
    // If the character is top or left side
    ((x < 0) && (character == RABBIT_CELL)) && (x = matrix.length - 1);
    ((y < 0) && (character == RABBIT_CELL)) && (y = matrix.length - 1);

    (x < 0 && character == WOLF_CELL) && (x = 0);
    (y < 0 && character == WOLF_CELL) && (y = 0);

    // if the character is right or bottom side
    ((x > matrix.length - 1) && (character === RABBIT_CELL)) && (x = 0);
    ((y > matrix.length - 1) && (character === RABBIT_CELL)) && (y = 0);
   
    (x > matrix.length - 1 && character === WOLF_CELL) && (x = matrix.length - 1);
    (y > matrix.length - 1 && character === WOLF_CELL) && (y = matrix.length - 1);
    
    // return safe path for moving rabbit or wolf
    return [x, y];
}

const getRandomCoord = (count) => {
    return Math.floor(Math.random() * count);  
}

function getRandomFreeCoords(board){
  const x = getRandomCoord(matrix.length)
  const y = getRandomCoord(matrix.length)
  
  if(board[x][y] === FREE_CELL) {
    return [x, y];
  }
  return getRandomFreeCoords(matrix);
}

function positionPlayers(){

    positionCharacter(HOUSE_CELL, 1);
    positionCharacter(RABBIT_CELL, 1);
    positionCharacter(WOLF_CELL, gameSettings.WOLFCOUNT);
    positionCharacter(BAN_CELL, gameSettings.BANCOUNT);
    
}

function positionCharacter(character, count){
    for(let i = 0; i < count; i++){
        positionSingleCharacter(character);
    }
}

function positionSingleCharacter(character){
    const [x, y] = getRandomFreeCoords(matrix);
    matrix[x][y] = character;
    let image = document.createElement('img');
    image.src = characters[character].src;
    document.getElementById(`${x}${y}`).appendChild(image);

}
const keyControls = (code) => moveCharacter(RABBIT_CELL, code)

const moveCharacter = (character, code) => {
    moveRabbit(character, code); 
    moveWolf(WOLF_CELL);
}

const moveWolf = (character) => {
    const allPossibleDirections = getAllPossibleDirections(character);
    const characterCoordinates = getCharacterCordinates(character);

    for(let i = 0; i < gameSettings.WOLFCOUNT; i++){
        attackRabbit(characterCoordinates[i], allPossibleDirections[i], character);
    }
}

const attackRabbit = (characterIndex, allPossibleDirections, character) => {
   const wolfNextPossibleCells = getPossibleMoveDirection(allPossibleDirections, character);
   calculateNearPath(wolfNextPossibleCells, characterIndex, character);
}

const calculateNearPath = (wolfNextPossibleCells, characterIndex, character) => {
    const getRabbitIndex = getCharacterCordinates(RABBIT_CELL);

    const nearPathCells = {}
    let resultOfTeorem;
  
    const [rabbitX, rabbitY] = getRabbitIndex[0];
   
    // reduce
    for (const key in wolfNextPossibleCells) {
        const [checkX, checkY] = wolfNextPossibleCells[key];
        // phytagoras teorem
        const side1 = Math.abs(rabbitX - checkX);
        const side2 = Math.abs(rabbitY - checkY);
        resultOfTeorem = Math.floor(Math.sqrt(Math.pow(side1, 2) + Math.pow(side2, 2)));
        nearPathCells[resultOfTeorem] = [checkX,checkY];
    } 
    
    const a = nearPathCells[Object.keys(nearPathCells)[0]]

    moveCurrentCharacter(characterIndex, a , character);
}


const moveRabbit = (character, code) => {
    let getAllDirectionIndexes  = getAllPossibleDirections(character);
    const getCharacterIndex = getCharacterCordinates(character);
    let possibleMoves = getPossibleMoveDirection(getAllDirectionIndexes[0], character);
    for(const key in possibleMoves){
        if(key == code){
            checkStatus( possibleMoves[key]);
            moveCurrentCharacter(getCharacterIndex[0], possibleMoves[key], character);
        }
    }
}

function checkStatus(checkMove){
const [x,y] = checkMove;

const zrt = matrix[x][y]

if(zrt === WOLF_CELL || zrt == RABBIT_CELL){
    const gameStatus = "It was very tasty,Game Over ...";
    statusUi(gameStatus);
    }
if(zrt == HOUSE_CELL){
    const gameStatus = "Rabbit at home,won";
    statusUi(gameStatus);
    }
}

// rename
function statusUi(status){
    matrix = [];
    board.innerHTML = "";
    statusText.innerHTML = status;
    gameStatus.style.display = "block";
}

const moveCurrentCharacter = (currentIndex, move, character) => {
 
    const [currentX, currentY] = currentIndex;
    
    // rename
    const [moveX, moveY] =  move;

    matrix[currentX][currentY] = FREE_CELL;
    checkStatus(move);
    matrix[moveX][moveY] = character;

    // look at this
    let rabbit = document.getElementById(`${currentX}${currentY}`).firstChild;
    document.getElementById(`${moveX}${moveY}`).appendChild(rabbit);
    document.getElementById(`${currentX}${currentY}`).removeChild; 
    }

const getPossibleMoveDirection = (getAllDirectionIndexes, character) => {  
    const characterPossibleMoves = {};
    const allowedMoves = characters[character].allowedMoves;
    
    for (const key in getAllDirectionIndexes) {
        let checkIfPortal = isSafePath(getAllDirectionIndexes[key], character);
        const [newX, newY] = checkIfPortal;
        if(allowedMoves.includes(matrix[newX][newY])){
            characterPossibleMoves[key] = [newX, newY];
        }
    } 
    return characterPossibleMoves;
}


const getCharacterCordinates = (character) => {
    return matrix.reduce((acc, array, rowIndex) => {
        array.forEach((element, columnIndex) => {
            if(element === character){
                acc.push([x,y] = [rowIndex, columnIndex]);
                return acc
            }
         });
    }, [])
}

const getAllPossibleDirections = (character) => {
    const getAllMovesArray = getCharacterCordinates(character).map((cordinates)=>{
        const [x,y] = cordinates;
        return ({
            37: [newX,newY] = [x, y - 1],
            38: [newX,newY] = [x - 1, y],
            39: [newX,newY] = [x, y + 1],
            40: [newX,newY] = [x + 1, y], 
        })
    });
    return getAllMovesArray;
}
