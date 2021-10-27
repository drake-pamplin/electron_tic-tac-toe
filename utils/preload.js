const gameManager = require("./game-manager");

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("close-button").addEventListener("click", () => {
        console.log("Close button clicked.");
        window.close();
    });

    for(let tile of document.getElementsByClassName("button-field__button")) {
        tile.onclick = (event) => gameManager.ButtonClick(event);
    }
});