# 🚀 E-Commerce System Deployment Guide

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Features Implemented](#features-implemented)
3. [Prerequisites](#prerequisites)
4. [Local Development Setup](#local-development-setup)
5. [Production Deployment](#production-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Security Considerations](#security-considerations)
8. [Performance Optimization](#performance-optimization)
9. [Monitoring & Maintenance](#monitoring--maintenance)
10. [Troubleshooting](#troubleshooting)

## 🎯 System Overview

This is a full-stack e-commerce system built with:
- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with role-based access control
- **File Upload**: Multer with image processing
- **UI**: Tailwind CSS with Framer Motion

## ✨ Features Implemented

### 🔐 Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Role-based access control (User, Admin, Moderator)
- ✅ Session management
- ✅ Account lockout protection
- ✅ Password reset functionality
- ✅ Email verification (structure ready)

### 📁 File Upload System
- ✅ Multer configuration for image uploads
- ✅ Multiple file upload support
- ✅ File validation and filtering
- ✅ Automatic file cleanup
- ✅ Organized storage structure
- ✅ Static file serving

### 🛒 E-Commerce Features
- ✅ Product catalog with advanced filtering
- ✅ Shopping cart functionality
- ✅ Order management
- ✅ User profiles
- ✅ Admin dashboard
- ✅ Sales analytics
- ✅ Inventory management

### 🎨 Enhanced Features
- ✅ Pagination and search
- ✅ Featured products
- ✅ Best sellers
- ✅ New releases
- ✅ Sale/discount system
- ✅ Product ratings and reviews
- ✅ SEO optimization
- ✅ Responsive design

## 📋 Prerequisites

### Required Software
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Git
- npm or yarn

### Required Accounts
- MongoDB Atlas (for cloud database)
- Vercel/Netlify (for frontend hosting)
- Railway/Render/Heroku (for backend hosting)
- Cloudinary/AWS S3 (for image storage - optional)

## 🛠️ Local Development Setup

### 1. Clone and Install Dependencies
```bash
# Clone the repository
git clone <your-repo-url>
cd manoj-sharma-next

# Install dependencies
npm install
```

### 2. Environment Configuration
Create `.env.local` file in the root directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/manoj-sharma-ecommerce
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Optional: Email Service (for password reset, etc.)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. Start Development Servers
```bash
# Terminal 1: Start backend server
npm run dev:server

# Terminal 2: Start frontend development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health
- API Documentation: http://localhost:5000/api/docs

### 5. Default Admin Credentials
- Email: admin@example.com
- Password: Admin@123

## 🌐 Production Deployment

### 🚀 Quick Start with Render

1. **Deploy Backend to Render** (5 minutes)
   - Sign up at [render.com](https://render.com)
   - Connect your GitHub repo
   - Create Web Service with these settings:
     - **Root Directory**: `server/`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Add environment variables (see below)

2. **Deploy Frontend to Vercel** (3 minutes)
   - Sign up at [vercel.com](https://vercel.com)
   - Connect your GitHub repo
   - Deploy (automatic detection)
   - Add `NEXT_PUBLIC_API_URL` environment variable

3. **Configure Environment Variables**
   ```env
   # Render Backend Environment Variables
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your-32-character-secret-key-here
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   PORT=10000

   # Vercel Frontend Environment Variables
   NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com
   ```

### Recommended Setup: Vercel (Frontend) + Render (Backend)

#### Frontend Deployment (Vercel)
1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy Frontend**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables in Vercel Dashboard**
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://manoj-sharma-backend.onrender.com`)

#### Backend Deployment (Render)
1. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository
   - Create a new "Web Service"

2. **Service Configuration**
   - **Name**: `manoj-sharma-backend`
   - **Environment**: `Node`
   - **Root Directory**: `server/`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your-production-jwt-secret-here
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   PORT=10000
   ```

4. **Deploy**
   - Render will automatically deploy when you push to your main branch
   - Your backend will be available at: `https://your-service-name.onrender.com`

### Alternative Options

#### Option 2: Netlify + Render

#### Frontend Deployment (Netlify)
1. **Build Command**: `npm run build`
2. **Publish Directory**: `.next`
3. **Environment Variables**: Same as Vercel

#### Backend Deployment (Render)
Same configuration as above.

#### Option 3: Railway (Alternative to Render)

#### Backend Deployment (Railway)
1. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the backend directory: `server/`

2. **Configure Environment Variables**
   ```env
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-production-jwt-secret
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   PORT=5000
   ```

3. **Deploy**
   - Railway will automatically deploy on git push

## 🔧 Environment Configuration

### Production Environment Variables
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=your-very-long-and-secure-jwt-secret-key
JWT_EXPIRES_IN=7d

# Server
PORT=10000
NODE_ENV=production

# CORS (for Render - allow your frontend domain)
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload (optional - for cloud storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Render-Specific Configuration

#### Health Check Endpoint
Render requires a health check endpoint. The application includes `/api/health` which returns:
```json
{
  "status": "OK",
  "timestamp": "2025-12-21T...",
  "uptime": "123.45 seconds"
}
```

#### Port Configuration
- Render automatically assigns a port via the `PORT` environment variable
- Default to `10000` if not specified
- The server listens on `process.env.PORT || 5000`

#### Static File Serving
- Uploaded files are served from `/uploads` directory
- CORS headers are configured for cross-origin requests
- Files are accessible at: `https://your-render-app.onrender.com/uploads/...`

#### Database Connection
- Uses MongoDB Atlas for production
- Connection pooling is handled automatically by Mongoose
- Database operations are optimized for serverless environments

## 🔒 Security Considerations

### 1. JWT Security
- Use a strong, random JWT secret (at least 32 characters)
- Set appropriate expiration times
- Implement token refresh mechanism

### 2. Database Security
- Use MongoDB Atlas with network access restrictions
- Enable database authentication
- Regular backups

### 3. File Upload Security
- Validate file types and sizes
- Scan for malware (consider cloud services)
- Use cloud storage for production (AWS S3, Cloudinary)

### 4. API Security
- Rate limiting implemented
- CORS configuration
- Input validation
- SQL injection protection (MongoDB)

### 5. Environment Variables
- Never commit `.env` files
- Use different secrets for development and production
- Rotate secrets regularly

### Render-Specific Security Considerations

#### 1. Environment Variables
- All sensitive data must be stored as environment variables in Render
- Never hardcode secrets in your code
- Use Render's environment variable management

#### 2. File Upload Security
- Render's free tier has limited disk space (1GB)
- Consider using cloud storage (Cloudinary, AWS S3) for production
- Implement file size limits and type validation

#### 3. CORS Configuration
- Configure CORS to allow your frontend domain
- Use environment variables for dynamic CORS origins
- Test CORS configuration thoroughly

#### 4. Rate Limiting
- Render has built-in rate limiting
- Additional API rate limiting is implemented in the code
- Monitor usage to avoid hitting Render's limits

## ⚡ Performance Optimization

### 1. Database Optimization
- Create indexes for frequently queried fields
- Use pagination for large datasets
- Implement caching (Redis recommended)

### 2. Image Optimization
- Compress images before upload
- Use WebP format
- Implement lazy loading
- Use CDN for image delivery

### 3. API Optimization
- Implement response caching
- Use compression middleware
- Optimize database queries
- Consider GraphQL for complex queries

### 4. Frontend Optimization
- Code splitting
- Image optimization
- Lazy loading
- Service worker for caching

## 📊 Monitoring & Maintenance

### 1. Logging
- Implement structured logging
- Use services like Winston or Bunyan
- Monitor error rates and performance

### 2. Health Checks
- API health endpoint: `/api/health`
- Database connectivity checks
- File system checks

### 3. Backup Strategy
- Database backups (daily)
- File uploads backup
- Configuration backup

### 4. Monitoring Services
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Performance monitoring (New Relic, DataDog)
- **Render-specific**: Use Render's built-in logs and metrics

### Render Monitoring
- **Logs**: Available in Render Dashboard > Service > Logs
- **Metrics**: CPU, Memory, and Response time graphs
- **Health Checks**: Automatic health monitoring
- **Alerts**: Configure email alerts for failures

### Render Maintenance
- **Automatic Deployments**: Push to main branch triggers deployment
- **Rollback**: Easy rollback to previous deployments
- **Scaling**: Upgrade instance types as needed
- **Backups**: Database backups handled by MongoDB Atlas

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check MongoDB connection
mongo "mongodb+srv://cluster.mongodb.net/database" --username username

# Check environment variables
echo $MONGODB_URI
```

#### 2. Render Deployment Issues
```bash
# Check Render build logs
# Go to Render Dashboard > Service > Logs

# Common Render issues:
# - PORT environment variable not set (use 10000)
# - Build command failing (ensure npm install works)
# - Start command incorrect (use "npm start")
# - Root directory not set to "server/"
```

#### 3. File Upload Issues
```bash
# Check upload directory permissions
ls -la uploads/
chmod 755 uploads/

# Check disk space (Render free tier: 1GB)
df -h
```

#### 4. CORS Issues
- Verify `FRONTEND_URL` environment variable in Render
- Check CORS configuration in server
- Ensure frontend URL matches exactly (including https://)

#### 5. JWT Issues
```bash
# Verify JWT secret is set in Render environment
echo $JWT_SECRET

# Check token expiration
# Use jwt.io to decode tokens
```

#### 6. Render Cold Start Issues
- Render free tier has cold starts (up to 30 seconds)
- Consider upgrading to paid tier for better performance
- Implement proper loading states in frontend

### Debug Commands
```bash
# Check server logs
npm run dev:server

# Check frontend build
npm run build

# Check for linting issues
npm run lint

# Test API endpoints
curl http://localhost:5000/api/health
```

## 📞 Support

### Getting Help
1. Check the troubleshooting section above
2. Review server logs for error messages
3. Verify environment variables
4. Test API endpoints individually

### Useful Commands
```bash
# Reset database (development only)
npm run db:reset

# Seed sample data
npm run db:seed

# Check API documentation
curl http://localhost:5000/api/docs
```

## 🎉 Success Checklist

Before going live, ensure:
- [ ] All environment variables are set in Render dashboard
- [ ] Database is connected and accessible (MongoDB Atlas)
- [ ] File uploads are working (test with small files first)
- [ ] Authentication is functioning (login/register)
- [ ] Admin panel is accessible with default credentials
- [ ] CORS is properly configured for your frontend domain
- [ ] SSL certificate is active (Render provides this automatically)
- [ ] Domain is configured (optional, can use Render subdomain)
- [ ] Health check endpoint responds: `https://your-app.onrender.com/api/health`
- [ ] API endpoints are accessible: `https://your-app.onrender.com/api/v1/books`
- [ ] Frontend can communicate with backend API
- [ ] Error tracking is set up (Sentry recommended)
- [ ] Backups are configured for MongoDB Atlas

### Render-Specific Checks
- [ ] Service is deployed successfully (green status in dashboard)
- [ ] Build logs show no errors
- [ ] Environment variables are set correctly
- [ ] Root directory is set to `server/`
- [ ] Build command is `npm install`
- [ ] Start command is `npm start`
- [ ] Port is set to `10000` in environment variables

---

**Note**: This guide covers the essential deployment steps. For production use, consider additional security measures, monitoring, and scaling strategies based on your specific requirements. 