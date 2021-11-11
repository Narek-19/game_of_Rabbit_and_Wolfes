document.addEventListener('keydown', (e) => keyControls(e.keyCode))
const gameStatus = document.querySelector('.gameStatus');
const statusText = document.getElementById('statusText');
let matrixLenght;
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

function startGame() {
    createMatrix();
    setCharacterCounts();
    createUI();
    positionPlayers();
}

function setCharacterCounts() {
    gameSettings.WOLFCOUNT = (matrix.length * 60) / 100;
    gameSettings.BANCOUNT = (matrix.length * 40) / 100;
}

function createMatrix() {
    matrixLenght = parseInt(document.getElementById("select").value);
    matrix = new Array(matrixLenght)
      .fill(FREE_CELL)
      .map(() => new Array(matrixLenght).fill(FREE_CELL));
  };

const createUI = () => {
    gameStatus.style.display = "none"
    board = document.querySelector('.board');
    board.innerHTML = "";
    board.style.width = `${matrixLenght * BOX_WIDTH}`
    matrix.forEach((x,indexX)=> {
        x.forEach((y,indexY)=> {
            const cell = document.createElement("div");
            board.appendChild(cell);
            cell.id = `${indexX}${indexY}`;
        });
    })
};

const getRandomCoord = (count) => {
    return Math.floor(Math.random() * count);  
}

function getRandomFreeCoords(board){
    const x = getRandomCoord(matrix.length);
    const y = getRandomCoord(matrix.length);
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

const positionSingleCharacter = (character) => {
    const [x, y] = getRandomFreeCoords(matrix);
    matrix[x][y] = character;
    let image = document.createElement('img');
    image.src = characters[character].src;
    document.getElementById(`${x}${y}`).appendChild(image);

}
const keyControls = (code) => moveCharacter(code)

const moveCharacter = (code) => {
    moveRabbit(code); 
    moveWolf();
}

const moveRabbit = (code) => {
    let allPossibleDirections  = getAllPossibleDirections(RABBIT_CELL);
    const characterCordinate = getCharacterCordinate(RABBIT_CELL);

    let possibleMoves = getPossibleMoveDirection(allPossibleDirections[0],RABBIT_CELL);

    Object.keys(possibleMoves).forEach(function(key) {
        if(key == code){
            getGameResultStatus(possibleMoves[key]);
            moveCurrentCharacter(characterCordinate[0], possibleMoves[key], RABBIT_CELL);
        }
    }); 
}

const moveWolf = () => {
    const allPossibleDirections  = getAllPossibleDirections(WOLF_CELL);
    const characterCordinate = getCharacterCordinate(WOLF_CELL);
    for(let i = 0; i < gameSettings.WOLFCOUNT; i++){
        attackRabbit(characterCordinate[i], allPossibleDirections[i], WOLF_CELL);
    }
}

const attackRabbit = (characterIndex, allPossibleDirections) => {
   const wolfNextPossibleCells = getPossibleMoveDirection(allPossibleDirections, WOLF_CELL);
   const nearCellToRabbit = getRabbitNearPath(wolfNextPossibleCells, characterIndex, WOLF_CELL);
   moveCurrentCharacter(characterIndex, nearCellToRabbit, WOLF_CELL);
}

const getRabbitNearPath = (wolfNextPossibleCells) => {
    const getRabbitIndex = getCharacterCordinate(RABBIT_CELL);
    const [rabbitX, rabbitY] = getRabbitIndex[0];
    let nearPath = [];

    const allPossibleCoordinates = Object.keys(wolfNextPossibleCells).map((keyCode) => {
        return wolfNextPossibleCells[keyCode];
    })
    allPossibleCoordinates.reduce((minimumCellPathResult, coordinate) => {
        const [checkXcell, checkYcell] = coordinate;
        const side1 = Math.abs(rabbitX - checkXcell);
        const side2 = Math.abs(rabbitY - checkYcell);
        const resultOfTeorem = Math.floor(Math.sqrt(Math.pow(side1, 2) + Math.pow(side2, 2)));
        if(minimumCellPathResult === null || resultOfTeorem < minimumCellPathResult){
            minimumCellPathResult = resultOfTeorem;
            nearPath = coordinate;
        }
        return minimumCellPathResult;

    }, minimumCellPathResult = null)
    return nearPath;
}

function getGameResultStatus(checkMoveCell){
const [x,y] = checkMoveCell;
const Rabbit = matrix[x][y];

    if(Rabbit === WOLF_CELL || Rabbit){
        const gameStatus = "It was very tasty,Game Over ...";
        setStatusGame(gameStatus);
    }
    if(Rabbit == HOUSE_CELL){
        const gameStatus = "Rabbit at home,won";
        setStatusGame(gameStatus);
    }
}

function setStatusGame(status){
    matrix = [];
    board.innerHTML = "";
    statusText.innerHTML = status;
    gameStatus.style.display = "block";
}

const moveCurrentCharacter = (currentIndex, move, character) => {
    const [currentX, currentY] = currentIndex;
    const [nextMoveX, nextMoveY] =  move;
    matrix[currentX][currentY] = FREE_CELL;
    getGameResultStatus(move);
    matrix[nextMoveX][nextMoveY] = character;
    const rabbit = document.getElementById(`${currentX}${currentY}`).firstChild;
    document.getElementById(`${nextMoveX}${nextMoveY}`).appendChild(rabbit);
    document.getElementById(`${currentX}${currentY}`).removeChild; 
}

function getWolfPossibleMoves(cordinate){
    const possibleCoord =  cordinate.map(cell => {
        cell < 0 && (cell = 0)
        cell > matrix.length-1 && (cell = matrix.length-1 )
        return cell;
    })
    return possibleCoord;
}


function getRabbitPossibleMoves(cordinate){
    const possibleCoord = cordinate.map(cell => {
        cell < 0 && (cell = matrix.length- 1)
        cell > matrix.length-1 && (cell = 0)
        return cell;
    })
    return possibleCoord;
}

const getPossibleMoveDirection = (allPossibleDirections, character) => {  
    const allowedMoves = characters[character].allowedMoves;
    return Object.keys(allPossibleDirections).reduce((characterPossibleMoves, key) => {

        const rabbitMoves = getRabbitPossibleMoves(allPossibleDirections[key]);
        const wolfMoves = getWolfPossibleMoves(allPossibleDirections[key]);
        const checkedCoord = (character === RABBIT_CELL) ? rabbitMoves: wolfMoves;

        const [newX, newY] = checkedCoord;        
        if(allowedMoves.includes(matrix[newX][newY])){
            characterPossibleMoves[key] = [newX, newY];
        }
        return characterPossibleMoves
    }, {})
}

const getCharacterCordinate = (character) => {
    return matrix.reduce((acc, array, rowIndex) => {
        array.forEach((element, columnIndex) => {
            if(element === character){
                acc.push([x,y] = [rowIndex, columnIndex]);
            }
         });
         return acc
    }, [])
}

const getAllPossibleDirections = (character) => {
    const getCharacterAllMovesArray = getCharacterCordinate(character).map((cordinates)=>{
        const [x,y] = cordinates;
        return ({
            37: [newX,newY] = [x, y - 1],
            38: [newX,newY] = [x - 1, y],
            39: [newX,newY] = [x, y + 1],
            40: [newX,newY] = [x + 1, y], 
        })
    });
    return getCharacterAllMovesArray;
}