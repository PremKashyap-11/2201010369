// src/loggingMiddleware.js
import axios from "axios";

const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";

// Allowed values for frontend logging
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGES = ["api", "component", "hook", "page", "state", "style"];

export const LoggingMiddleware = {
  log: async (level, message, pkg = "component", data = {}) => {
    try {
      if (!VALID_LEVELS.includes(level)) {
        throw new Error(`Invalid log level: ${level}`);
      }
      if (!VALID_PACKAGES.includes(pkg)) {
        throw new Error(`Invalid frontend package: ${pkg}`);
      }

      const payload = {
        stack: "frontend",
        level,
        package: pkg,
        message,
        ...data,
      };

      const response = await axios.post(LOG_API_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: "Bearer <your-token-here>", // uncomment if API needs it
        },
      });

      console.log("✅ Log created:", response.data);
    } catch (error) {
      console.error("❌ Logging failed:", error.message);
    }
  },
};
