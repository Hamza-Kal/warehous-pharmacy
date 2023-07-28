import { config } from 'dotenv';

config();
console.log(`Connecting to ${process.env.DB_NAME}@${process.env.DB_HOST}`);
export default {
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
};
