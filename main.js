const { app, BrowserWindow } = require('electron');
const path = require('path');

// Global reference to the main window so that it is not closed when garbage collection happens
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        backgroundColor: "#28706f",
        webPreferences: {
            nodeIntegration: true,
            preload: path.resolve(__dirname, "utils", "preload.js")
        },
        frame: false
    });

    mainWindow.loadFile("index.html");
    mainWindow.webContents.openDevTools();

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    mainWindow.once("focus", () => {
        console.log("Window being displayed.");
    })
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows.length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});