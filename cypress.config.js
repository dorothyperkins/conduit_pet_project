const { defineConfig } = require("cypress");

const DEFAULT_REPORTER = "mochawesome";
const DEFAULT_REPORTER_OPTIONS = {
  reportDir: "cypress/results",
  overwrite: false,
  html: false,
  json: true,
};

const sanitizeReporter = (value) => {
  if (typeof value !== "string") {
    return { value: DEFAULT_REPORTER, wasInvalid: true };
  }

  const trimmedValue = value.trim();
  if (!trimmedValue || trimmedValue === "[object Object]") {
    return { value: DEFAULT_REPORTER, wasInvalid: true };
  }

  return { value: trimmedValue, wasInvalid: false };
};

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,

  reporter: DEFAULT_REPORTER,
  reporterOptions: { ...DEFAULT_REPORTER_OPTIONS },

  e2e: {
    setupNodeEvents(on, config) {
      // Настройка Node Event Listeners
      const username = process.env.DB_USERNAME || "dorothyperkins420@gmail.com";
      const password = process.env.PASSWORD || "Doroti36_";

      const { value: sanitizedReporter, wasInvalid } = sanitizeReporter(config.reporter);
      const reporterChanged = sanitizedReporter !== config.reporter;
      config.reporter = sanitizedReporter;

      const hasValidReporterOptions =
        config.reporterOptions && typeof config.reporterOptions === "object";
      const shouldResetReporterOptions =
        !hasValidReporterOptions || wasInvalid;

      if (shouldResetReporterOptions) {
        config.reporterOptions = { ...DEFAULT_REPORTER_OPTIONS };
      }

      // Обработка ошибок, если переменные окружения отсутствуют
      if (!password) {
        throw new Error("missing PASSWORD environment variable");
      }

      config.env = { ...config.env, username, password };
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
  },
});
