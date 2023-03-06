import { config } from 'dotenv';

config();

export default {
  database: {
    url: process.env.DATABASE_URL,
  },
};
