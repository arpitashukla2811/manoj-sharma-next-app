import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from server directory
config({ path: join(__dirname, '../.env') });

export const {
    PORT,
    NODE_ENV,
    MONGODB_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    FRONTEND_URL
} = process.env;