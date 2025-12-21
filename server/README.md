# Manoj Sharma Backend API

This is the backend API for the Manoj Sharma e-commerce platform, built with Node.js, Express, and MongoDB.

## 🚀 Deployment on Render

### Prerequisites
- MongoDB Atlas account and database
- Render account

### Quick Deploy
1. Fork/clone this repository
2. Go to [render.com](https://render.com)
3. Create a new **Web Service**
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `manoj-sharma-backend`
   - **Environment**: `Node`
   - **Root Directory**: `server/`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Environment Variables
Set these in your Render service environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-32-character-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### API Endpoints
- Health Check: `GET /api/health`
- Books: `GET /api/v1/books`
- Auth: `POST /api/v1/auth/login`
- Admin: `GET /api/v1/admin/*` (requires admin token)

### Default Admin Credentials
- Email: `admin@example.com`
- Password: `Admin@123`

## 🛠️ Local Development
```bash
cd server
npm install
npm run dev
```