# Manoj Sharma Backend API

Backend API for the Manoj Sharma E-commerce platform, built with Node.js, Express, and MongoDB.

## 🚀 Deployment on Render

This backend is configured for deployment on Render.com.

### Prerequisites

1. **MongoDB Database**: Set up a MongoDB Atlas cluster or any MongoDB database
2. **Render Account**: Create a free account at [render.com](https://render.com)

### Environment Variables

Set these environment variables in your Render dashboard:

```env
PORT=10000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Deployment Steps

1. **Connect Repository**:
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - **Root Directory**: `server/` (important!)

2. **Configure Build Settings**:
   - **Runtime**: Node
   - **Node Version**: 18.0.0 or higher
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**:
   - Add all the environment variables listed above
   - Make sure `MONGODB_URI` points to your production database

4. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically deploy your backend

### API Endpoints

Once deployed, your API will be available at:
```
https://your-render-app.onrender.com/api/v1/
```

### Health Check

Visit `https://your-render-app.onrender.com/api/health` to verify deployment.

## 🔧 Local Development

```bash
cd server
npm install
npm run dev
```

## 📁 Project Structure

```
server/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── database/        # Database connection
├── middleware/      # Express middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── uploads/         # File uploads directory
├── index.js         # Server entry point
└── package.json     # Dependencies and scripts
```

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB/Mongoose** - Database and ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **CORS** - Cross-origin resource sharing

## 🔐 Default Admin Credentials

- Email: `admin@example.com`
- Password: `Admin@123`

## 📡 API Documentation

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user profile

### Admin
- `POST /api/v1/admin/login` - Admin login
- `GET /api/v1/admin/stats` - Admin dashboard stats

### Books
- `GET /api/v1/books` - Get all books
- `POST /api/v1/books` - Create book (admin)
- `PUT /api/v1/books/:id` - Update book (admin)
- `DELETE /api/v1/books/:id` - Delete book (admin)

### Users
- `GET /api/v1/users` - Get all users (admin)
- `GET /api/v1/users/:id` - Get user by ID (admin)

### Orders
- `GET /api/v1/orders/admin/all` - Get all orders (admin)
- `GET /api/v1/orders/admin/stats` - Get order statistics (admin)