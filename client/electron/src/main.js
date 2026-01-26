"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
let mainWindow;
// Create main window
const createWindow = () => {
    mainWindow = new electron_1.BrowserWindow({
        title: "Centralize PESO NET",
        minWidth: 800,
        minHeight: 600,
        // kiosk: true,       
        fullscreen: true,
        // autoHideMenuBar: true,
        // alwaysOnTop: true,        // stays above other windows
        frame: false,
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"),
            devTools: true,
            contextIsolation: true,
            nodeIntegration: false,
        }
    });
    // Load login page first
    mainWindow.loadFile(path_1.default.join(__dirname, "home.html"));
    // send initial state to renderer
    mainWindow.webContents.on("did-finish-load", () => {
        mainWindow?.webContents.send("window:fullscreen-changed", mainWindow.isFullScreen());
        mainWindow?.webContents.send("window:minimize-changed", mainWindow.isMinimized());
    });
    // propagate state changes to renderer for dynamic button text
    mainWindow.on("enter-full-screen", () => {
        mainWindow?.webContents.send("window:fullscreen-changed", true);
    });
    mainWindow.on("leave-full-screen", () => {
        mainWindow?.webContents.send("window:fullscreen-changed", false);
    });
    mainWindow.on("minimize", () => {
        mainWindow?.webContents.send("window:minimize-changed", true);
    });
    mainWindow.on("restore", () => {
        mainWindow?.webContents.send("window:minimize-changed", false);
    });
};
// Block shortcuts (Alt+Tab, Alt+F4, Esc)
const registerShortcuts = () => {
    electron_1.globalShortcut.register("Alt+Tab", () => { });
    electron_1.globalShortcut.register("Alt+F4", () => { });
    electron_1.globalShortcut.register("Esc", () => { });
    electron_1.globalShortcut.register("CommandOrControl+W", () => { });
};
// IPC for window controls
electron_1.ipcMain.on("window:minimize", () => {
    mainWindow?.minimize();
});
electron_1.ipcMain.on("window:minimize", () => {
    mainWindow?.minimize();
});
electron_1.ipcMain.on("window:maximize", () => {
    if (!mainWindow)
        return;
    mainWindow.isMaximized()
        ? mainWindow.unmaximize()
        : mainWindow.maximize();
});
// Fullscreen toggle
electron_1.ipcMain.on("window:fullscreen", () => {
    if (!mainWindow)
        return;
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
});
// App ready
electron_1.app.whenReady().then(() => {
    createWindow();
    registerShortcuts();
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// Unregister shortcuts on quit
electron_1.app.on("will-quit", () => {
    electron_1.globalShortcut.unregisterAll();
});
// Prevent app from quitting when window closed
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
