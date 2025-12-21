import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
config({ path: join(__dirname, '../../.env') });

export const {
    PORT,
    NODE_ENV,
    MONGODB_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN
} = process.env;