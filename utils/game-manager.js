// Imports:
//  - electron: main electron tools
const { ipcRenderer } = require('electron');

// Game variable such as gameboard, player turn, asset paths, etc.
let playerOneTurn = true;
const newStyle = 'url("images/{}.png';
const xPath = "X";
const oPath = "O";
let gameBoard = [
    '-','-','-',
    '-','-','-',
    '-','-','-'
];
// List of tile values that would constitute a player win state
const wins = [
    "012",
    "345",
    "678",
    "036",
    "147",
    "258",
    "048",
    "246"
]

// Cycles through the list of possible winning states to see if a winner has emerged
const CheckForWin = () => {
    let spots = "";
    let player = playerOneTurn ? "X" : "O";

    for (let index = 0; index < gameBoard.length; index++) {
        if (gameBoard[index] === player) {
            spots += index;
        }
    }

    for (winString of wins) {
        if (spots.includes(winString.charAt(0)) && 
            spots.includes(winString.charAt(1)) && 
            spots.includes(winString.charAt(2))) 
        {
            return true;
        }
    }
    return false;
}

// Checks to see if there are any blank spaces left; if not and no winner is declared, there is a tie
const CheckForTie = () => {
    if (!gameBoard.includes('-')) {
        return true;
    }
    return false;
}

// Method tied to each tic tac toe tile to register a player move
const ButtonClick = (event) => {
    // Button id is logged
    let buttonId = event.currentTarget.id;

    // Main game logic
    //  1. Check to see if tile is in play
    //  2. Claim tile for player
    //  3. Generate path to tile asset and visually represent the claim
    //  4. Check for win or tie
    //
    //  If a claimed tile is selected, main process is called to display an error message
    if (gameBoard[buttonId] === '-') {
        gameBoard[buttonId] = playerOneTurn ? 'X' : 'O';
        let imagePath = newStyle.replace("{}", playerOneTurn ? xPath : oPath);
        document.getElementById(buttonId).style.backgroundImage = imagePath;
        if (CheckForWin()) {
            ipcRenderer.send("win", "Congratulations " + (playerOneTurn ? "Player One" : "Player Two"));
        }
        else if (CheckForTie()) {
            ipcRenderer.send("tie", "It's a tie");
        }
        playerOneTurn = !playerOneTurn;
    } else {
        ipcRenderer.send("error");
    }
}

// Export click method for use in preload script for button binding
module.exports = {
    ButtonClick
}