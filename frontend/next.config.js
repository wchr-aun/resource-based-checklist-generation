const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require("next/constants");

// This uses phases as outlined here: https://nextjs.org/docs/#custom-configuration
module.exports = (phase) => {
  // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental variable
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  // when `next build` or `npm run build` is used
  const isProd = phase === PHASE_PRODUCTION_BUILD;

  const env = {
    HEALTH_BACKEND_URL: (() => {
      if (isDev) return "http://localhost:8080";
      if (isProd) {
        return "https://msc-checklist-generation.herokuapp.com";
      }
    })(),
    PAYMENT_BACKEND_URL: (() => {
      if (isDev) return "http://localhost:8081";
      if (isProd) return "https://msc-payment-checklist.herokuapp.com";
    })(),
  };

  // next.config.js object
  return {
    env,
  };
};
