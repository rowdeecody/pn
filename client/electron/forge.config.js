const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    executableName: 'CentralizePesoNet'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'CentralizePesoNet',            // internal app name
        authors: 'Rudy N. Caña',             // publisher
        exe: 'CentralizePesoNet.exe',         // packaged exe name
        setupExe: 'CentralizePesoNetInstaller.exe', // installer name
        oneClick: false,                       // false = user can select install folder
        perMachine: true,                       // installs for all users
        setupMsi: false,
        noMsi: true,
        shortcutName: 'CentralizePesoNet',      // shortcut name
        createDesktopShortcut: true,            // desktop shortcut
        createStartMenuShortcut: true,          // start menu shortcut
        menuCategory: 'CentralizePesoNet',      // folder in Start Menu
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
