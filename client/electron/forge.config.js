module.exports = {
  packagerConfig: {
    icon: "src/icon.ico"
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "CentralizePesoNet",
        authors: "Rudy N. Caña",
        certificatePassword: "123456",
        // certificatePassword: process.env.CERTIFICATE_PASSWORD,
        noMsi: true,
        setupExe: "CentralizePesoNet.exe"
      }
    },
  ]
};
