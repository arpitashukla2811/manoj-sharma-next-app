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

### Option 1: Vercel + Railway (Recommended)

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
   - `NEXT_PUBLIC_API_URL`: Your backend URL
   - `NEXT_PUBLIC_SITE_URL`: Your frontend URL

#### Backend Deployment (Railway)
1. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the backend directory

2. **Configure Environment Variables**
   ```env
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-production-jwt-secret
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   PORT=5000
   ```

3. **Deploy**
   - Railway will automatically deploy on git push
   - Set the root directory to `server/`

### Option 2: Netlify + Render

#### Frontend Deployment (Netlify)
1. **Build Command**: `npm run build`
2. **Publish Directory**: `.next`
3. **Environment Variables**: Same as Vercel

#### Backend Deployment (Render)
1. **Build Command**: `npm install`
2. **Start Command**: `npm run server`
3. **Environment Variables**: Same as Railway

### Option 3: AWS/Google Cloud/DigitalOcean

#### Using Docker (Recommended for VPS)
1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   EXPOSE 5000
   CMD ["npm", "run", "server"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     backend:
       build: ./server
       ports:
         - "5000:5000"
       environment:
         - MONGODB_URI=${MONGODB_URI}
         - JWT_SECRET=${JWT_SECRET}
       volumes:
         - ./uploads:/app/uploads
   ```

## 🔧 Environment Configuration

### Production Environment Variables
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=your-very-long-and-secure-jwt-secret-key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=production

# CORS
FRONTEND_URL=https://your-domain.com

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

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check MongoDB connection
mongo "mongodb+srv://cluster.mongodb.net/database" --username username

# Check environment variables
echo $MONGODB_URI
```

#### 2. File Upload Issues
```bash
# Check upload directory permissions
ls -la uploads/
chmod 755 uploads/

# Check disk space
df -h
```

#### 3. JWT Issues
```bash
# Verify JWT secret is set
echo $JWT_SECRET

# Check token expiration
# Use jwt.io to decode tokens
```

#### 4. CORS Issues
- Verify `FRONTEND_URL` environment variable
- Check CORS configuration in server
- Ensure frontend URL matches exactly

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
- [ ] All environment variables are set
- [ ] Database is connected and accessible
- [ ] File uploads are working
- [ ] Authentication is functioning
- [ ] Admin panel is accessible
- [ ] SSL certificate is installed
- [ ] Domain is configured
- [ ] Monitoring is set up
- [ ] Backups are configured
- [ ] Error tracking is active

---

**Note**: This guide covers the essential deployment steps. For production use, consider additional security measures, monitoring, and scaling strategies based on your specific requirements. 