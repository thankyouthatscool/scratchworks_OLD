module.exports = {
  expo: {
    name: "inertiion",
    slug: "inertiion",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/ec9386aa-6995-41ce-9fe4-5185f7fde0ae",
    },
    runtimeVersion: {
      policy: "sdkVersion",
    },
    extra: {
      apiUrl: process.env.apiUrl,
      APPLICATION_NAME: process.env.APPLICATION_NAME,
      CLI_TEST: process.env.CLI_TEST,
      eas: {
        projectId: "ec9386aa-6995-41ce-9fe4-5185f7fde0ae",
      },
    },
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
      package: "com.ozahnitko.inertiion",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
  },
};
