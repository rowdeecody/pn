// global.d.ts
export {}; // this file is a module

declare global {
  interface Window {
    versions: {
      node: () => string;
      chrome: () => string;
      electron: () => string;
    };
  }
}
