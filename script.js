// Created from a YouTube to tutorial for the purpose of practicing JS/DOM. Added extra selectors and CSS for practice.


// 1. Basic Setup
var origBoard;
const humanPlayer = '🅞';
const aiPlayer = '🅧';
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]

// The cells variable stores the reference to each cell, and querySelector all selections each element that holds the class cell.
const cells = document.querySelectorAll('.cell');
startGame();

// Keep in mind this will run when you load the page and the game starts, however it will also run when we click replay.
function startGame() {
  // Displays the empty board
  document.querySelector(".endgame").style.display = "none"
  document.querySelector(".info").style.display = "block"
  // Making the array be every number from 0-9, getting just the keys
  origBoard = Array.from(Array(9).keys());
  // This is going to clear our board at the beginning of each game, the for loop is slecting each individual cell.
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty('background-color');
    // Now every time we click a square we're calling the turn click function which we will define below
    cells[i].addEventListener('click', turnClick, false);
  }
}

// Defining the turn click function, each time a cell is clicked, this will happen, can test with //console.log(square.target.id);
function turnClick(square){
  // Adding rules to not allow a player/ai to click on a cell thats already been clicked, if nobody has played on the cell, it will be a number, not an x or o.
  if (typeof origBoard[square.target.id] == 'number') {
    turn(square.target.id, humanPlayer)
    // checking if it's a tie game, if it's not.. the aiPlayer can take a turn
    if (!checkTie()) turn(bestSpot(), aiPlayer);
  }
}

// Defining the turn function, squareID and player is passed in, in the turnClick function.
// The squareId is essentially selecting the sell and calling the element by ID and setting it to player displays an 0 on the screen whenever the player clicks in a cell/square.
function turn(squareId, player){
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  // Whenever a turn is taken, we need to check if the game has been won, check win is defined below.
  // orginBoard, checks the board, and player checks which player has won.
  let gameWon = checkWin(origBoard, player)
  // If the game has been won, call the gameOver function.
  if (gameWon) gameOver(gameWon)
}

// 2. Logic to determine winner

// Defining the checkWin function, we pass in board here because we won't always be using the orgBoard
function checkWin(board, player){
  // Finding all the places on the board that have already been played in.
  let plays = board.reduce((a, e, i) =>
  // reduce method is going to go through each element of the board array
  // a is the accumulator is the value that we're getting back at the end, we're initlizing this to an array. 
  // e is the element in the board array we're going through
  // i is the index
    (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  // Checking if the game has been won, has the player played in all of these splots in the winCombos positions, if the array loop returns true, we will win the game.
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      // Display how the player won, and what player won
      gameWon = {index: index, player: player};
      // When won, break
      break;
    }
  }
  // return gameWon, which returns how, and who.
  return gameWon;
}

// Now that the games won, what will we do
function gameOver(gameWon){
  // Going through the index of the wincCombo
  for (let index of winCombos[gameWon.index]){
    // the index of the winCombo, setting the background player to green if the player wins, and red if the AI wins
    document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? "green" : "red";
  }
  // We need to prevent the player from clicking cells now that the game is over, we're removing the event listener thats allowing us to click.
  for(var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  // What message to display depending who won
  declareWinner(gameWon.player == humanPlayer? "You win!" : "You Lose!");
}

// 3. Basic AI for winner notifcation 


function declareWinner(who){
  document.querySelector(".endgame").style.display = "block"
  document.querySelector(".endgame .text").innerText = who;
  document.querySelector(".info").style.display = "none";
}

// This function returns the squares that do not have x's or o's in them for the AI to use
function emptySquares(){
  return origBoard.filter(s => typeof s == 'number');
}

// This is how we're creating a spot for the AI player to play
function bestSpot() {
  // Basic, just selecting the next avalible spot in the aray
  // return emptySquares()[0];
  // This is on the board, the aiPlayer, the index will be the square it should play in? 
  return minimax(origBoard, aiPlayer).index;
}

function checkTie(){
  // If everyone square is full, it's a tie
  if (emptySquares().length == 0) {
    for (var i=0; i < cells.length; i++){
      cells[i].style.backgroundColor = 'white';
      // removed ability to click again
      cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner("Tie Game!")
    return true;
  }
  return false;
}

// 4. Unbeatable AI using MINIMAX

// Minimax is a recursive function, it's considering every possible board placement and returning values it determines what is the best move.
// https://www.freecodecamp.org/news/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37/

function minimax(newBoard, player) {
  // Create list of empty spots
	var availSpots = emptySquares();

  // Checking for terminal states
	if (checkWin(newBoard, humanPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
  }
  
  var moves = [];
  // loopin through every empty spots
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
      // call itself, and wait to return a value
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}