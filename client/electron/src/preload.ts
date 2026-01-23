import { contextBridge } from "electron";

// Expose versions to the renderer process
contextBridge.exposeInMainWorld("versions", {
  node: (): string => process.versions.node,
  chrome: (): string => process.versions.chrome,
  electron: (): string => process.versions.electron,
});
