const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("close-button").addEventListener("click", () => {
        ipcRenderer.send("close-game");
    });

    document.getElementById("winner").innerText = ipcRenderer.sendSync("get-winning-player");
});