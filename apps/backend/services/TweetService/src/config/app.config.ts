const appConfig = () => ({
  NODE_ENV: process.env.NODE_ENV,
  APP_ORIGIN: process.env.APP_ORIGIN,
  PORT: process.env.PORT,
  BASE_PATH: process.env.BASE_PATH,
  MONGO_URI: process.env.DATABASE_URL,
  JWT: {
    SECRET: process.env.JWT_SECRET,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  MAILER_SENDER: process.env.MAILER_SENDER,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  API_BASE_URL: process.env.API_BASE_URL,
});

export const config = appConfig();
