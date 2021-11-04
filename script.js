const FREE_CELL = 0;
const RABBIT_CELL = 1;
const WOLF_CELL = 2;
const BAN_CELL = 3;
const HOUSE_CELL = 4;
const ROCK_CELL = 5;
const board = document.querySelector('.board');
const gameSettings = {
    WOLFCOUNT: 3,
    BANCOUNT:1
}
let matrix2;


const characters = {
    [RABBIT_CELL]: {
        name: "rabbit",
        id: RABBIT_CELL,
        imgSrc:"",
        allowedMoves: [FREE_CELL, WOLF_CELL, HOUSE_CELL],
    },
    [WOLF_CELL]:{
        name: "wolf",
        id: WOLF_CELL,
        imgSrc:"",
        allowedMoves: [FREE_CELL, RABBIT_CELL]
    },
    [ROCK_CELL]:{
        name: "rock",
        imgSrc:"",
        id:ROCK_CELL,
    },
    [HOUSE_CELL]:{
        name: "house",
        imgSrc:"",
        id: HOUSE_CELL,
    }
}

function startGame(){
    const boxCountValue = parseInt(document.getElementById("select").value);
    matrix2 = createMatrix(boxCountValue,FREE_CELL);
    createUI(boxCountValue);
    positionPlayers();
    gameReady();
}

function createMatrix(lenght, defaultValue){
    return new Array(lenght)
      .fill(defaultValue)
      .map(() => new Array(lenght).fill(defaultValue));
  };


function createUI(sideSize){
    let cell;
    board.innerHTML = "";
    board.style.width = `${sideSize * 64}`
    matrix2.forEach((x,indexX)=>{
        x.forEach((y,indexY)=>{
            cell = document.createElement("div");
            board.appendChild(cell);
            cell.id = `${indexX}${indexY}`;
        });
    })
};

const isSafePath =(pathSide)=> {
    let [x,y] = pathSide;

    // If the character is top or left side
    x < 0 &&  (x = matrix2.length - 1);
    y < 0 && (y = matrix2.length - 1);

    // if the character is right or bottom side
    x > matrix2.length - 1 && (x = 0);
    y > matrix2.length - 1 && (y = 0);

    // return safe path for moving rabbit
    return [x,y];
}

function gameReady(){
    window.addEventListener('keydown',(e) => {
        code = e.keyCode;
        keyControls(code);
    });    
}

function getRandomCoords(count){
    return Math.floor(Math.random() * count);  
}


function getRandomFreeCoords(board){
    const [x, y] = [getRandomCoords(matrix2.length), getRandomCoords(matrix2.length)]
  if(board[x][y] === 0) {
    return [x, y];
  }
  return getRandomFreeCoords(matrix2);
}

function positionPlayers(){
    positionCharacter(RABBIT_CELL, 1);
    positionCharacter(WOLF_CELL,gameSettings.WOLFCOUNT);
    positionCharacter(BAN_CELL, gameSettings.BANCOUNT);
    positionCharacter(HOUSE_CELL, 1);
}

function positionCharacter(CHARACHTER,count){
    for(let i = 0; i < count; i++){
        positionSingleCharacter(CHARACHTER);
    }
}

function positionSingleCharacter(CHARACTER){
    const [x, y] = getRandomFreeCoords(matrix2);
    matrix2[x][y] = CHARACTER;
    document.getElementById(`${x}${y}`).innerHTML = CHARACTER;
    // console.log(matrix2);
    
}
function keyControls(code){
    moveCharacter(RABBIT_CELL,code);
    moveCharacter(WOLF_CELL);
}
function moveCharacter(character,code){
    const getCharacterIndex = getCharacterCordinates(character);
    const getAllUnlegalMoves  = getAllMoves(character);


    moveRabbit(getCharacterIndex, getAllUnlegalMoves[0],character,code); 
}




function moveRabbit(getCharacterIndex,getAllDirectionIndexes,character,code){
    const [currentX, currentY] = getCharacterIndex[0];
    let possibleMoves = getPossibleMoveDirection(getAllDirectionIndexes,character);

    Object.keys(possibleMoves).forEach(key => {
    const [moveX,moveY] = possibleMoves[key];
       if(key == code){
           matrix2[currentX][currentY] = FREE_CELL;
           document.getElementById(`${currentX}${currentY}`).innerHTML = '';
           matrix2[moveX][moveY] = character;
           document.getElementById(`${moveX}${moveY}`).innerHTML = character;
           
       }
    });
}


function getPossibleMoveDirection(getAllDirectionIndexes,character){
    const characterPossibleMoves = {};
    const allowedMoves = characters[character].allowedMoves;

     Object.keys(getAllDirectionIndexes).forEach(key => {
        isSafePath(getAllDirectionIndexes[key]);
        let checkIfPortal = isSafePath(getAllDirectionIndexes[key]);
        const [newX,newY] = checkIfPortal;
       if(allowedMoves.includes(matrix2[newX][newY])){
           characterPossibleMoves[key] = [newX,newY];
       }
    });
    return characterPossibleMoves;
}

function getCharacterCordinates(character){
    let getCordinates = [];
    matrix2.forEach((array, rowIndex) => {
        array.forEach((element, columnIndex) => {
           if(element === character){
               return getCordinates.push([x,y] = [rowIndex, columnIndex]);
           }
        });
    });
    return getCordinates;
}

function getAllMoves(character){
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
