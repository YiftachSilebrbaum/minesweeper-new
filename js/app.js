'use strict'

const BOMB = '💣'
const FLAG = '🚩'
const COOL = '😎'
const LOST = '🤯'
const WON = '🥳'

var gBoard
var gSize
var gMines
var gIsWin 
var gExtraLifeCounter
var timerInterval
var gFirstClick

function initGame(size){

var elSmiley = document.querySelector('.restart-button')
elSmiley.innerHTML = COOL
gIsWin = false
gSize = size
gExtraLifeCounter = 3
gFirstClick = true

switch(size){
  case 4: gMines = 2
  break;
  case 8: gMines = 14
  break;
  case 12: gMines = 32
  break;
}

gBoard = buildBoard(gSize)
updateNegs(gBoard)
console.table(gBoard)
renderBoard(gBoard)
// setTimer()

// var elSmiley = document.querySelector('.restart-button')
// elSmiley.innerHTML = COOL
var elExtraLife = document.querySelector('.extra-life span')
elExtraLife.innerText = gExtraLifeCounter

var elTitle = document.querySelector('.win-or-lose-massage') 
elTitle.style.display = 'none'

var eltimer = document.querySelector('.timer span')
eltimer.innerText = '0.00'
// var elExtraLife = document.querySelector('.extra-life span')
// elExtraLife.innerHTML = gExtraLifeCounter

}

//builds our board data
function buildBoard(size){

  var newBoard = []
  var mines = getMines(gMines)
  newBoard = createMat(size)

setMines(newBoard , mines)

for(var i = 0 ; i < newBoard.length ; i++){
      
      for(var j = 0 ; j < newBoard.length; j++){

        if(newBoard[i][j].isMine) continue
        
        newBoard[i][j] = (createCell())
        
}

}

return newBoard

}

//updates the number of neigbors for each cell
function updateNegs(board){

  for(var i = 0 ; i < board.length ; i++){
     for(var j = 0 ; j < board.length ; j++){
      var currCell = board[i][j]

      if(currCell.isMine) continue

      currCell.minesAroundCount = countNegs(i , j)  

}

}

}

//creats mine object
function createMine(row , col){

   var mine = {
      i: row,
      j: col
    }

    return mine
}

//creats cell object
function createCell(){

  var cell = {

    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false

  }

return cell

}

//produces an array of mines
function getMines(num){

var minesLoc = []

for(var i = 0; i < num ; i++){

  minesLoc.push(createMine(getRandomIntInclusive(0 , gSize - 1),getRandomIntInclusive(0 , gSize - 1)))

}

return minesLoc

}

//sets our mines on the board
function setMines(board , mines){

   for(var i  = 0 ; i < mines.length ; i++){

    board[mines[i].i][mines[i].j] = createCell()
    board[mines[i].i][mines[i].j].isMine = true

}


}

// Render the board to an HTML table
function renderBoard(board) {
  console.log('board', board)
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      const currCell = board[i][j]

      //var cellClass = getClassName({ i: i, j: j }) + ' '
      //cellClass += (currCell.isMine) ? 'wall' : 'floor'
      
      strHTML += `<td class="cell floor"  onclick="exposePlace(${i},${j})" oncontextmenu = " placeFlag(${i},${j}) " >`

      if(currCell.isMarked) strHTML += FLAG

      if(currCell.isShown){

      if (currCell.isMine) {
        strHTML += BOMB
      } 
      else
        strHTML += currCell.minesAroundCount

    }
      
      strHTML += '</td>'

      
    }
    strHTML += '</tr>'
    // console.log('strHTML', strHTML)
  }

  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML

}

//counts how many bombs surround a cell 
function countNegs(currCellI , currcellJ){

var negsCount = 0;

    for (var i = currCellI - 1; i <= currCellI + 1; i++) {
      if (i < 0 || i >= gBoard.length) continue;
      for (var j = currcellJ - 1; j <= currcellJ + 1; j++) {
        if (j < 0 || j >= gBoard.length) continue;
        if (i === currCellI && j === currcellJ) continue;
        var currCell = gBoard[i][j]
        if (currCell.isMine) negsCount++;
      }
    }

    return negsCount

  }

  //handles our clikcs on the board
function exposePlace(i , j){

  var currCell = gBoard[i][j]
   
  if (currCell.isMarked || currCell.isShown) return
  
  if(currCell.isMine && gFirstClick) handleFirstClick(i , j)

  else if(currCell.isMine){

  if(gExtraLifeCounter > 0){ 
    extraLife()
    return
   }
   else
   gameOver(false)
  }

  else if(currCell.minesAroundCount === 0 ) expandShown(i , j)
  
  if(gFirstClick)
  {
    setTimer()
    gFirstClick = false

  }

  currCell.isShown = true
  gIsWin = checkWin(gBoard)
  console.log(gIsWin)
  if (gIsWin) gameOver(true)
  
  renderBoard(gBoard)

}

//checks for a win on the board
function checkWin(board){

  var exposedCellsCounter = 0

  for(var i = 0 ; i < board.length ; i++){
    for(var j = 0 ; j < board.length ; j++){
      if(gBoard[i][j].isShown) exposedCellsCounter++
    }
  }
  console.log(exposedCellsCounter)
  console.log(((gSize * gSize) - gMines))
  if(((gSize * gSize) - gMines) === exposedCellsCounter) return true
  else return false

}

//handles our end of the game
function gameOver(isWin){

 var elTitle = document.querySelector('.win-or-lose-massage') 
 var elSmiley = document.querySelector('.restart-button')

 if(isWin){
  elTitle.innerText = ' you won! '
  elSmiley.innerHTML = WON
 }
  else {
    elTitle.innerText = 'you lost!'
    elSmiley.innerHTML = LOST
  }

  elTitle.style.display = 'block'
  clearInterval(timerInterval)
  exposeAllBombs(gBoard)
  

}

//handles a press on the restar button
function restartGame(a = gSize){

  initGame(a)
  clearInterval(timerInterval)

}

//exposes all of the bombs on the board
function exposeAllBombs(Board){

for(var i = 0 ; i < Board.length ; i++){

   for(var j = 0 ; j < Board.length ; j++)

   if(gBoard[i][j].isMine) gBoard[i][j].isShown = true

}

renderBoard(gBoard)

}

//if a cell with no bombs around is clicked , we will see our neighboors
function expandShown(currCellI, currcellJ){

  for (var i = currCellI - 1; i <= currCellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = currcellJ - 1; j <= currcellJ + 1; j++) {
      if (j < 0 || j >= gBoard.length) continue;
      if (i === currCellI && j === currcellJ) continue;
      var currCell = gBoard[i][j]
      if(!currCell.isMarked && !currCell.isMine){

        currCell.isShown = true
       
    }
  }

    renderBoard(gBoard)

}
}

//places a flag on right click
function placeFlag( i , j ){
  
  if (gBoard[i][j].isShown) return

  if(gBoard[i][j].isMarked) {
    gBoard[i][j].isMarked = false
  }
  else{
  gBoard[i][j].isMarked = true
  }
  renderBoard(gBoard)
}

//counts down our life
function extraLife(){
  gExtraLifeCounter--

  const elExtraLife = document.querySelector('.extra-life span')
  elExtraLife.innerText = gExtraLifeCounter

}

//sets a timer
function setTimer() {
  var startTime = Date.now()

  timerInterval = setInterval( () => {
      var elapsedTime = Date.now() - startTime
      document.querySelector('.timer span').innerText = (
          elapsedTime / 1000
      ).toFixed(3)
  }, 38)
}

//handle the case of clicking a mine on our first click
function handleFirstClick(i , j){

  gFirstClick = false
  gBoard[i][j].isMine = false

  gBoard[i][j].minesAroundCount = countNegs(i , j)

  var newRow = getRandomIntInclusive(0 , gSize - 1)
  var newColl = getRandomIntInclusive(0 , gSize - 1)

  while(gBoard[newRow][newColl].isMine){

  newRow = getRandomIntInclusive(0 , gSize - 1)
  newColl = getRandomIntInclusive(0 , gSize - 1)

  }
  
  gBoard[newRow][newColl].isMine = true
   exposePlace(i , j)

}


