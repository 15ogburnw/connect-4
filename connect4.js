/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for(let i=0; i< HEIGHT; i++){
    board.push([]);
    for(let j=0; j<WIDTH; j++){
      board[i].push(null);
    }
  }
  return board;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  
  const htmlBoard = document.querySelector('#board');

  //creates a row above the play area with an event listener which will respond to a player's move
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // creates gameboard spaces and appends them to the html page, with IDs corresponding to the space on the board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = board.length-1; y>=0; y--){
    if (!board[y][x]) {
      return y;}
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  

  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);

  const boardSpace = document.getElementById(`${y}-${x}`);

  if(y===0){piece.classList.add('firstRow')}
  else if(y===1){piece.classList.add('secondRow')}
  else if(y===2){piece.classList.add('thirdRow')}
  else if(y===3){piece.classList.add('fourthRow')}
  else if(y===4){piece.classList.add('fifthRow')}
  else if(y===5){piece.classList.add('sixthRow')}

  boardSpace.append(piece);


}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;
  
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie, if tied end the game
  if (checkForTie()){
    endGame(`It's a tie!`);
  }

  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;


}

//checks if all of the spaces on the board are filled
function checkForTie () {
  if (board.every(function(x){
   return x.every(function(y){
      return y ? true: false;
    });
  })) {
    return true;
  } 

  else {
    return false;
  };
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

    //loops over the cells in the board
    //for each cell position, creates 4 arrays. Each array is an array of arrays, with each nested array containing coordinates for a cell
    //the horiz variable contains an array with the coordinates of the current cell and the 3 cells to its right
    //the vert variable contains an array with the coordinates of the current cell and the 3 cells above it
    // the diagDR variable contains an array with the coordinates of the current cell and the 3 cells in a diagonal up and to the right of it
    // the diagDL variable contains an array with the coordinates of the current cell and the 3 cells in a diagonal down and to the right of it

    //the arrays are then passed to the __win() function, and if any of them return true, the checkForWin() function returns true and a win result is triggered.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
