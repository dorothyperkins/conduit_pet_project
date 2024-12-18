const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,

  // Настройка репортера
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    configFile: "reporter-config.json",
  },

  e2e: {
    setupNodeEvents(on, config) {
      // Настройка Node Event Listeners
      const username = process.env.DB_USERNAME || "dorothyperkins420@gmail.com";
      const password = process.env.PASSWORD || "Doroti36_";

      // Обработка ошибок, если переменные окружения отсутствуют
      if (!password) {
        throw new Error("missing PASSWORD environment variable");
      }

      config.env = { username, password };
      return config;
    },

    env: {
      username: "dorothyperkins420@gmail.com",
      password: "Doroti36_",
      apiUrl: "https://conduit-api.bondaracademy.com",
    },

    retries: {
      runMode: 2, // Повторы при выполнении тестов в режиме запуска
      openMode: 0, // Повторы при выполнении тестов в открытом режиме
    },

    baseUrl: "https://conduit.bondaracademy.com/",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    excludeSpecPattern: "**/examples/*",

    // Добавление mochawesome как дополнительного репортера
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/results",
      overwrite: false,
      html: false,
      json: true,
    },
  },
});
