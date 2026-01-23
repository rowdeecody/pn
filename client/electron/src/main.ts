import { app, BrowserWindow, Tray, Menu, nativeImage } from "electron";
import path from "path";

let mainWindow: BrowserWindow | null;
let tray: Tray | null;
let isQuiting = false;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Centralize PESO NET",
    frame: false,
    fullscreen: true,
    // autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: false,
      nodeIntegration: false,
      contextIsolation: true    
    }
  })

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  mainWindow.on("close", (e) => {
    if (!isQuiting) {
      e.preventDefault();
      mainWindow?.hide();
    }
  });
}

// Create tray
const createTray = () => {
  // Use an empty NativeImage when no icon is desired to satisfy the Tray constructor types.
  tray = new Tray(nativeImage.createEmpty());
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () => mainWindow?.show()
    },
    {
      label: "Exit",
      click: () => {
        isQuiting = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip("Centralize PESO NET");
  tray.setContextMenu(contextMenu);

  tray.on("double-click", () => mainWindow?.show());
};

// App ready
app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Prevent quitting on window close
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
