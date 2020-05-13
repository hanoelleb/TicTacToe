//x = 1
//o = 2

var grid = document.getElementById("grid");
var start = document.getElementById("start");
var restart = document.getElementById("restart");
var gameForm = document.getElementById("gameForm");
var numPlayers = document.getElementById("numPlayers");


var num = numPlayers.options[numPlayers.selectedIndex].value;
//console.log("to start: " + numPlayers.options[numPlayers.selectedIndex].value);

//modules

const GameManager = (() => {
     let turn = 1;
     var players = 2;

     const changeTurn = function(player) {
        if (player == 1)
	     this.turn = 2;
	else
	    this.turn = 1;
	if (this.players == 1 && this.turn == 2) {
	    tictactoeAI.chooseMove();
	}
     }

     var getTurn = function() {
	console.log("current turn: " + this.turn);
        return this.turn;
     };

     var resetTurn = function() {
	 this.turn = 1;
     }

     var amountOfPlayers = function() {
         this.players = numPlayers.options[numPlayers.selectedIndex].value;
     }

     var newGame = function(num) {
	 this.turn = 1;
	 GameBoard.clear();
         GameDisplay.clearDisplay();
	 this.players = num;
     }

     return {turn: turn, getTurn: getTurn, changeTurn: changeTurn, newGame};
})();

const GameBoard = (() => {
    var initialState = [0,0,0,0,0,0,0,0,0];

    const checkForWinner = function(gameBoard) {
	//horizontal win
        if ( gameBoard[0] != 0 && gameBoard[0] == gameBoard[1] && gameBoard[1] == gameBoard[2] )
	    return gameBoard[0];
	if ( gameBoard[3] != 0 && gameBoard[3] == gameBoard[4] && gameBoard[4] == gameBoard[5] )
	    return gameBoard[3];
        if ( gameBoard[6] != 0 && gameBoard[6] == gameBoard[7] && gameBoard[7] == gameBoard[8] )
	    return gameBoard[6];
        //vertical win
	    //
	if ( gameBoard[0] != 0 && gameBoard[0] == gameBoard[3] && gameBoard[3] == gameBoard[6] )
	    return gameBoard[0];
        if ( gameBoard[1] != 0 && gameBoard[1] == gameBoard[4] && gameBoard[4] == gameBoard[7] )
	    return gameBoard[1];
        if ( gameBoard[2] != 0 && gameBoard[2] == gameBoard[5] && gameBoard[5] == gameBoard[8] )
	    return gameBoard[2];

	//diagonal win
	if ( gameBoard[0] != 0 && gameBoard[0] == gameBoard[4] && gameBoard[4] == gameBoard[8] )
	    return gameBoard[0];
	if ( gameBoard[2] != 0 && gameBoard[2] == gameBoard[4] && gameBoard[4] == gameBoard[6] )
	    return gameBoard[2];

	//check for tie
	if (gameBoard[0] != 0 && gameBoard[1] != 0 && gameBoard[2] != 0 &&
	    gameBoard[3] != 0 && gameBoard[4] != 0 && gameBoard[5] != 0 &&
	    gameBoard[6] != 0 && gameBoard[7] != 0 && gameBoard[8] != 0)
	    return 3;

        return 0;
    }

    const addToBoard = function(slot, player){
	console.log("slot: " + slot + " player: " + player);
	console.log("addTo bef: " + initialState);
        initialState[slot] = player;
	console.log("addTo aft: " + initialState);
	
	var winner = checkForWinner(initialState);
	finishGame(winner);
    }

    const finishGame = function(winner) {
        if (winner != 0 && winner != 3) {
            var restart = confirm("Winner! Player " + winner + "\nRestart?");
	    if (restart) {
		gameForm.style.display = "block"
	    }
        }
        if (winner == 3) {
            var restart = confirm("A Tie!\nRestart?");
	    if (restart) {
		gameForm.style.display = "block"
            }
	}
    }

    const getBoard = function() {
        return initialState;
    }

    const getSquare = function(index) {
        return initialState[index];
    }

    const clear = () => {
	for (i = 0; i < 9; i++) {
	    initialState[i] = 0;
	}
    }

    const hasOpen = () => {
        for (i = 0; i < 9; i++) {
	    if (initialState[i] == 0)
	        return true;
	}
	return false;
    }

    const getAvailableSpaces = function(board) {
	var spaces = [];
        for (i = 0; i < 9; i++) {
            if (board[i] == 0)
		spaces.push(i);
	}
	return spaces;
    }

    return { addToBoard: addToBoard, getSquare, clear, hasOpen, getBoard: getBoard, getAvailableSpaces, checkForWinner };

})();

const GameDisplay = (() => {
    var xIcon = "resources/x.png";
    var oIcon = "resources/o.png";

    const updateDisplay = (square, player) => {
	if (player == 1)
	    square.children[0].src = xIcon;
	else
	    square.children[0].src = oIcon;
    }

    const clearDisplay = () => {
        for (var i = 0; i < grid.children.length; i++) {
	    grid.children[i].children[0].src = "";
	}
    }

    return {updateDisplay, clearDisplay};
})();

tictactoeAI = (() => {

  const minimax = (newBoard, turn) => {

	var availSpaces = GameBoard.getAvailableSpaces(newBoard);
	console.log("available spaces: " + availSpaces);

        var winner = GameBoard.checkForWinner(newBoard);
	if (winner == 1) //human wins
	    return {score:-1};
	else if (winner == 2) //AI wins
	    return {score:1};
	else if (winner == 3) //tie
	    return {score:0};

	else {
            var moves = [];
            for ( j = 0; j < availSpaces.length; j++ ) {
		//availSpaces = GameBoard.getAvailableSpaces(newBoard);
                var move = {};
  	        move.index = availSpaces[j];
                newBoard[availSpaces[j]] = turn;
                
		var res = 0;
		if (turn == 2)
                    res = minimax(newBoard, 1);
		else
		    res = minimax(newBoard, 2);
		console.log("score: " + res.score);
		move.score = res.score;

                newBoard[availSpaces[j]] = 0;
                moves.push(move);
	    }
	  

	    var bestMove;
            if ( turn === 2) {
                var bestScore = -10000;
                for (var i = 0; i < moves.length; i++) {
		    //console.log("2: " + moves[i].score);
                    if (moves[i].score > bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
		  
                }
            } else {
                var bestScore = 10000;
                for (var i = 0; i < moves.length; i++) {
		    //console.log("1: " + moves[i].score);
                    if (moves[i].score < bestScore) {
                       bestScore = moves[i].score;
                       bestMove = i;
                    }
                }
            }
            return moves[bestMove];
	}
        
    }
    const chooseMove = () => {
	//console.log("board: " + GameBoard.getBoard().slice());
	bestMove = minimax(GameBoard.getBoard().slice(), 2);

	const curr = GameManager.getTurn();
        GameDisplay.updateDisplay(grid.children[bestMove.index], curr);
        GameBoard.addToBoard(bestMove.index, curr);
	GameManager.changeTurn(curr);
    }

    return {chooseMove};
})();

//factories

playerFactory = ( isX ) => {
    var symbol = 2;
    if ( isX )
	symbol = 1;
    return {symbol};
}


for (var i = 0; i < grid.children.length; i++)
{
    const index = i;
    grid.children[i].addEventListener("click", () => {
	const square = GameBoard.getSquare(index);
	if (square == 0) {
	    const curr = GameManager.getTurn();
	    //GameManager.changeTurn(curr);
	    GameDisplay.updateDisplay(grid.children[index], curr);
	    GameBoard.addToBoard(index, curr);
	    GameManager.changeTurn(curr);
	}
    });
}


function startGame() {
    const playerX = playerFactory(true);
    const playerY = playerFactory(false);
}

start.addEventListener("click", function(e) {
	e.preventDefault();
        var num = numPlayers.options[numPlayers.selectedIndex].value;
         gameForm.style.display = "none";
	GameManager.newGame(num);
    }
);

/*start.addEventListener("click", () => {
        GameManager.newGame();
    });
*/
restart.addEventListener("click", () => {
        gameForm.style.display = "block";
    });
