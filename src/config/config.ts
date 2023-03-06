import { config } from 'dotenv';

config();

export default {
  database: {
    url: process.env.DATABASE_URL,
  },
  auth: {
    jwt: {
      access: {
        secret: process.env.JWT_ACCESS_SECRET,
        lifetime: process.env.JWT_ACCESS_LIFETIME
          ? Number(process.env.JWT_ACCESS_LIFETIME)
          : 86400,
      },
      refresh: {
        secret: process.env.JWT_REFRESH_SECRET,
        lifetime: process.env.JWT_REFRESH_LIFETIME
          ? Number(process.env.JWT_REFRESH_LIFETIME)
          : 2592000,
      },
    },
  },
  server: {
    base_url: process.env.BASE_URL ?? 'localhost:3000',
    route_prefix: process.env.ROUTE_PREFIX ?? '/api',
    port: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000,
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  },
  swagger: {
    prefix: process.env.SWAGGER_PREFIX ?? '/swagger',
  },
};
