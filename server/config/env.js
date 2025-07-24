import { config } from 'dotenv';

// config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
config({path : process.env.MONGODB_URI});

export const {
    PORT,
    NODE_ENV,
    MONGODB_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN
} = process.env;