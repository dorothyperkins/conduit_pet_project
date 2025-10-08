const { defineConfig } = require("cypress");

const DEFAULT_REPORTER = "cypress-multi-reporters";
const DEFAULT_REPORTER_OPTIONS = {
  reporterEnabled: "spec, mocha-junit-reporter, mochawesome",
  mochaJunitReporterReporterOptions: {
    mochaFile: "cypress/results/junit/results-[hash].xml",
    toConsole: false,
  },
  mochawesomeReporterOptions: {
    reportDir: "cypress/results/mochawesome",
    overwrite: false,
    html: false,
    json: true,
  },
};

const sanitizeReporter = (value) => {
  if (typeof value !== "string") {
    return DEFAULT_REPORTER;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue || trimmedValue === "[object Object]") {
    return DEFAULT_REPORTER;
  }

  return trimmedValue;
};

const resolveReporterOptions = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const merged = { ...DEFAULT_REPORTER_OPTIONS, ...value };

    if (value.mochawesomeReporterOptions) {
      merged.mochawesomeReporterOptions = {
        ...DEFAULT_REPORTER_OPTIONS.mochawesomeReporterOptions,
        ...value.mochawesomeReporterOptions,
      };
    }

    if (value.mochaJunitReporterReporterOptions) {
      merged.mochaJunitReporterReporterOptions = {
        ...DEFAULT_REPORTER_OPTIONS.mochaJunitReporterReporterOptions,
        ...value.mochaJunitReporterReporterOptions,
      };
    }

    return merged;
  }

  return { ...DEFAULT_REPORTER_OPTIONS };
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

      const reporterFromEnv = process.env.CYPRESS_REPORTER;
      const resolvedReporter = sanitizeReporter(reporterFromEnv ?? config.reporter);
      config.reporter = resolvedReporter;
      config.reporterOptions = resolveReporterOptions(config.reporterOptions);

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
