const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Global reference to the main window so that it is not closed when garbage collection happens
let mainWindow;
let messageWindow;
let endMessage;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 800,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.resolve(__dirname, "utils", "preload.js")
        },
        frame: false
    });

    mainWindow.loadFile("index.html");
    // mainWindow.webContents.openDevTools();

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

function createMessageWindow(fileName) {
    messageWindow = new BrowserWindow({
        width: 400,
        height: 200,
        resizable: false,
        parent: mainWindow,
        modal: true,
        frame: false,
        backgroundColor: "#d3d3d3",
        webPreferences: {
            nodeIntegration: true,
            preload: path.resolve(__dirname, "utils", fileName, "preload.js")
        }
    });

    messageWindow.loadFile(path.resolve(__dirname, "utils", fileName, fileName + ".html"));

    messageWindow.on("closed", () => {
        messageWindow = null;
    });
}

app.whenReady().then(() => {
    createMainWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows.length === 0) {
            createMainWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

ipcMain.on("error", (event, arg) => {
    createMessageWindow("error-window");
});

ipcMain.on("console", (event, message) => {
    console.log(message);
});

ipcMain.on("win", (event, winMessage) => {
    console.log("Winner found.");
    endMessage = winMessage;
    createMessageWindow("end-window");
});

ipcMain.on("tie", (event, tieMessage) => {
    console.log("Tie.");
    endMessage = tieMessage;
    createMessageWindow("end-window");
});

ipcMain.on("get-winning-player", (event, arg) => {
    event.returnValue = endMessage;
});

ipcMain.on("close-game", () => {
    app.quit();
});