const { ipcRenderer } = require('electron');

// On window load:
//  1. Bind the Close button to main process method to close the game
//  2. Set the window message to the win or tie text from the main process
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("close-button").addEventListener("click", () => {
        ipcRenderer.send("close-game");
    });

    document.getElementById("message").innerText = ipcRenderer.sendSync("get-winning-player");
});