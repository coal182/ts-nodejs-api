import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  API_KEY: process.env.API_KEY,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  LOGGER_DESTINATION: process.env.LOGGER_DESTINATION
};

export default config;