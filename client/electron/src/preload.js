"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("windowAPI", {
    minimize: () => electron_1.ipcRenderer.send("window:minimize"),
    maximize: () => electron_1.ipcRenderer.send("window:maximize"),
    fullscreen: () => electron_1.ipcRenderer.send("window:fullscreen"),
    onFullscreenChange: (cb) => electron_1.ipcRenderer.on("window:fullscreen-changed", (_e, val) => cb(val)),
    onMinimizeChange: (cb) => electron_1.ipcRenderer.on("window:minimize-changed", (_e, val) => cb(val)),
    versions: {
        node: () => process.versions.node,
        chrome: () => process.versions.chrome,
        electron: () => process.versions.electron,
    },
});
