// Imports:
//  - electron: main electron tools
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Global references to the main, message, and end game windows so that they are not closed when garbage collection happens
let mainWindow;
let messageWindow;
let endMessage;

// Creates the main game window and loads preload script for formatting before rendering
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

    // Frees up mainWindow variable for use
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

// Create modal message window to display errors and end game states
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

    // Resolves file paths for easier reading on multiple different platforms
    messageWindow.loadFile(path.resolve(__dirname, "utils", fileName, fileName + ".html"));

    // Frees up messageWindow variable for future use
    messageWindow.on("closed", () => {
        messageWindow = null;
    });
}

// Initial game load where a new window is created
//  - New window created on Mac if app is open and no windows are active
app.whenReady().then(() => {
    createMainWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows.length === 0) {
            createMainWindow();
        }
    });
});

// Quits the application if no windows are currently open (on Mac)
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// IPC message system for communication between main process and renderer processes (game-manager, etc.)
// Displays error message when player attempts to play on occupide space
ipcMain.on("error", (event, arg) => {
    createMessageWindow("error-window");
});

// Allows program to log messages to terminal instead of Chromium dev console
ipcMain.on("console", (event, message) => {
    console.log(message);
});

// Main process is notified of a winner and executes logic to display win message and close the app
ipcMain.on("win", (event, winMessage) => {
    endMessage = winMessage;
    createMessageWindow("end-window");
});

// Main process is notified of a tie and executes logic to display tie message and close the app
ipcMain.on("tie", (event, tieMessage) => {
    endMessage = tieMessage;
    createMessageWindow("end-window");
});

// Main process is pinged by renderer process to get the end message (tie or win)
ipcMain.on("get-winning-player", (event, arg) => {
    event.returnValue = endMessage;
});

// Main process is called to close the game
ipcMain.on("close-game", () => {
    app.quit();
});