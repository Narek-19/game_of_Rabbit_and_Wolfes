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
        imgSrc:"",
        allowedMoves: [FREE_CELL, WOLF_CELL, HOUSE_CELL],
    },
    [WOLF_CELL]:{
        name: "wolf",
        imgSrc:"",
        allowedMoves: [FREE_CELL, RABBIT_CELL]
    },
    [ROCK_CELL]:{
        name: "rock",
        imgSrc:"",
    },
    [HOUSE_CELL]:{
        name: "house",
        imgSrc:"",
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


const isSafePath =(pathSide,character)=> {
    let [x,y] = pathSide;
    // If the character is top or left side
    ((x < 0) && (character == RABBIT_CELL)) && (x = matrix2.length - 1);
    ((y < 0) && (character == RABBIT_CELL)) && (y = matrix2.length - 1);

    (x < 0 && character == WOLF_CELL) && (x = 0);
    (y < 0 && character == WOLF_CELL) && (y = 0);

    // if the character is right or bottom side
    ((x > matrix2.length - 1) && (character === RABBIT_CELL)) && (x = 0);
    ((y > matrix2.length - 1) && (character === RABBIT_CELL)) && (y = 0);
   
    (x > matrix2.length - 1 && character === WOLF_CELL) && (matrix2.length - 1);
    (y > matrix2.length - 1 && character === WOLF_CELL) && (matrix2.length - 1);
    

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
}
function moveCharacter(character,code){
    moveRabbit(character,code); 
    // for(let i = 0; i < gameSettings.WOLFCOUNT;i++){
    //     attackRabbit(getCharacterIndex[i],getAllUnlegalMoves[i],character,code);
    // }
    moveWolf(WOLF_CELL,code);
}

function moveWolf(character,code){
    let getAllDirectionIndexes  = getAllMoves(character);
    const getCharacterIndex = getCharacterCordinates(character);
    for(let i = 0; i < gameSettings.WOLFCOUNT;i++){
        attackRabbit(getCharacterIndex[i],getAllDirectionIndexes[i],character,code);
    }
}



function attackRabbit(characterIndex,getAllDirectionIndexes,character,code){

   console.log(characterIndex);
   let possiblewaystoGoWolf = getPossibleMoveDirection(getAllDirectionIndexes,character);

   calculateNearPath(possiblewaystoGoWolf,characterIndex,character);

}

function calculateNearPath(possiblewaystoGoWolf,characterIndex,character){
    const getRabbitIndex = getCharacterCordinates(RABBIT_CELL);
    let result;
    let obj = {}

    console.log(possiblewaystoGoWolf); //{38: Array(2), 40: Array(2)}

    const [x,y] = characterIndex;
    const [rabbitX, rabbitY] = getRabbitIndex[0];
    Object.keys(possiblewaystoGoWolf).forEach(key => {
        const [checkX,checkY] = possiblewaystoGoWolf[key];
        // phytagoras teorem
        const side1 = Math.abs(rabbitX - checkX);
        const side2 = Math.abs(rabbitY - checkY);
        result = Math.floor(Math.sqrt(Math.pow(side1, 2) + Math.pow(side2, 2)));
        console.log(result);
        obj[result] = [checkX,checkY];
    });
    console.log(obj);

    console.log(obj[Object.keys(obj)[0]]);
    const [newWolfX,newWolfY] = obj[Object.keys(obj)[0]];
    matrix2[newWolfX][newWolfY] = FREE_CELL;
    document.getElementById(`${x}${y}`).innerHTML = '';
    matrix2[newWolfX][newWolfY] = character;
    document.getElementById(`${newWolfX}${newWolfY}`).innerHTML = character; 
    
}


function moveRabbit(character,code){
    let getAllDirectionIndexes  = getAllMoves(character);
    const getCharacterIndex = getCharacterCordinates(character);
    const [currentX, currentY] = getCharacterIndex[0];
    let possibleMoves = getPossibleMoveDirection(getAllDirectionIndexes[0],character);

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
        isSafePath(getAllDirectionIndexes[key], character);
        let checkIfPortal = isSafePath(getAllDirectionIndexes[key],character);
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
