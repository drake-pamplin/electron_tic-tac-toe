const gameManager = require("./game-manager");

// On window load:
//  1. Locate the Close button and bind it to exit the game on click
//  2. Locate the game tiles and bind them to the ButtonClick() method in the game manager
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("close-button").addEventListener("click", () => {
        window.close();
    });

    for(let tile of document.getElementsByClassName("button-field__button")) {
        tile.onclick = (event) => gameManager.ButtonClick(event);
    }
});