import { configDotenv } from 'dotenv';

configDotenv();

export const getProxyConfig = () => {
  return {
    host: process.env.PROXY_HOST || '',
    port: process.env.PROXY_PORT ? parseInt(process.env.PROXY_PORT, 10) : 0,
    username: process.env.PROXY_USERNAME || '',
    password: process.env.PROXY_PASSWORD || '',
  };
};
