const { ipcRenderer } = require('electron');

let playerOneTurn = true;
const newStyle = 'url("images/{}.png';
const xPath = "X";
const oPath = "O";
let gameBoard = [
    '-','-','-',
    '-','-','-',
    '-','-','-'
];
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

const CheckForTie = () => {
    if (!gameBoard.includes('-')) {
        return true;
    }
    return false;
}

const ButtonClick = (event) => {
    let buttonId = event.currentTarget.id;

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

module.exports = {
    ButtonClick
}