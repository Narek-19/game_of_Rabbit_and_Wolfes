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
<<<<<<< HEAD
    gameStatus.style.display = "none"
=======
>>>>>>> f474f29f2c24e52f01e5ccbc3af6ed7044635138
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
<<<<<<< HEAD
    matrix =  new Array(matrixLenght)
=======
    matrix = new Array(matrixLenght)
>>>>>>> f474f29f2c24e52f01e5ccbc3af6ed7044635138
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

function getWolfPossibleMoves(cordinate,direction){
    let [x,y] = cordinate;

    (x < direction.y) && (x = direction.y);
    (y < direction.y) && (y = direction.y);
    (x > direction.x) && (x = direction.x);
    (y > direction.x) && (y = direction.x);
    return [x, y];
}

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

const positionSingleCharacter= (character) => {
    const [x, y] = getRandomFreeCoords(matrix);
    matrix[x][y] = character;
    let image = document.createElement('img');
    image.src = characters[character].src;
    document.getElementById(`${x}${y}`).appendChild(image);

}
const keyControls = (code) => moveCharacter(RABBIT_CELL, code)

const moveCharacter = (character, code) => {
    moveRabbit(character, code); 
    moveWolf();
}

const moveWolf = () => {
    let allPossibleDirections  = getAllPossibleDirections(WOLF_CELL);
    const characterCordinates = getCharacterCordinates(WOLF_CELL);
    for(let i = 0; i < gameSettings.WOLFCOUNT; i++){
        attackRabbit(characterCordinates[i], allPossibleDirections[i], WOLF_CELL);
    }
}

const attackRabbit = (characterIndex, allPossibleDirections) => {
   let wolfNextPossibleCells = getPossibleMoveDirection(allPossibleDirections, WOLF_CELL);
   calculateNearPath(wolfNextPossibleCells, characterIndex, WOLF_CELL);
}

const calculateNearPath = (wolfNextPossibleCells, characterIndex) => {
    const getRabbitIndex = getCharacterCordinates(RABBIT_CELL);
    const nearPathCells = {}
    let resultOfTeorem;
    const [rabbitX, rabbitY] = getRabbitIndex[0];

    Object.keys(wolfNextPossibleCells).forEach(function(key) {
        const [checkX, checkY] = wolfNextPossibleCells[key];
        const side1 = Math.abs(rabbitX - checkX);
        const side2 = Math.abs(rabbitY - checkY);
        resultOfTeorem = Math.floor(Math.sqrt(Math.pow(side1, 2) + Math.pow(side2, 2)));
        nearPathCells[resultOfTeorem] = [checkX,checkY];
      });    
    
    const neaCellToRabbit =  nearPathCells[Object.keys(nearPathCells)[0]]
    moveCurrentCharacter(characterIndex, neaCellToRabbit, WOLF_CELL);
}

function getRabbitPossibleMoves(cordinate,direction){
    let [x,y] = cordinate;
    (x < direction.y) && (x = direction.x);
    (y < direction.y) && (y = direction.x);
    (x > direction.x) && (x = direction.y);
    (y > direction.x) && (y = direction.y);
    return [x, y];
}
const moveRabbit = (character, code) => {
    let allPossibleDirections  = getAllPossibleDirections(character);
    const characterCordinates = getCharacterCordinates(character);
    let possibleMoves = getPossibleMoveDirection(allPossibleDirections[0], character);

    Object.keys(possibleMoves).forEach(function(key) {
        if(key == code){
            getGameResultStatus(possibleMoves[key]);
            moveCurrentCharacter(characterCordinates[0], possibleMoves[key], character);
        }
    }); 
}

function getGameResultStatus(checkMoveCell){
const [x,y] = checkMoveCell;
const Rabbit = matrix[x][y];

    if(Rabbit === WOLF_CELL || Rabbit){
        const gameStatus = "It was very tasty,Game Over ...";
        statusUi(gameStatus);
    }
    if(Rabbit == HOUSE_CELL){
        const gameStatus = "Rabbit at home,won";
        statusUi(gameStatus);
    }
}

function statusUi(status){
    matrix = [];
    board.innerHTML = "";
    statusText.innerHTML = status;
    gameStatus.style.display = "block";
}

const moveCurrentCharacter = (currentIndex, move, character) => {
    const [currentX, currentY] = currentIndex;
    // rename
    const [nextMoveX, nextMoveY] =  move;
    matrix[currentX][currentY] = FREE_CELL;
    getGameResultStatus(move);
    matrix[nextMoveX][nextMoveY] = character;
    let rabbit = document.getElementById(`${currentX}${currentY}`).firstChild;
    document.getElementById(`${nextMoveX}${nextMoveY}`).appendChild(rabbit);
    document.getElementById(`${currentX}${currentY}`).removeChild; 
    }

const getPossibleMoveDirection = (allPossibleDirections, character) => {  
    const direction = {
        x:matrix.length - 1,
        y:0,
    }
    const allowedMoves = characters[character].allowedMoves;

    return Object.keys(allPossibleDirections).reduce((characterPossibleMoves, key) => {
        const rabbitMoves = getRabbitPossibleMoves(allPossibleDirections[key],direction);
        const wolfMoves = getWolfPossibleMoves(allPossibleDirections[key],direction);
        let checkedCell = (character === RABBIT_CELL) ? rabbitMoves: wolfMoves;
        const [newX, newY] = checkedCell;
        if(allowedMoves.includes(matrix[newX][newY])){
            characterPossibleMoves[key] = [newX, newY];
        }
        return characterPossibleMoves
    }, {})
}

const getCharacterCordinates = (character) => {
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

console.log("Hello");