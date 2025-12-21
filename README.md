# 📚 Manoj Sharma E-Commerce System

A full-stack e-commerce platform for books built with Next.js 16, Node.js, and MongoDB.

## ✨ Features

- **JWT Authentication** with role-based access control
- **Book Management** with advanced filtering and search
- **Shopping Cart** with persistent storage
- **Admin Dashboard** with analytics
- **File Upload** with image validation
- **Responsive Design** with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account

### Installation
```bash
git clone <your-repo-url>
cd manoj-sharma-next
npm install
```

### Environment Setup
Create `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
```

### Run Development
```bash
# Backend
npm run dev:server

# Frontend (new terminal)
npm run dev
```

Access at: http://localhost:3000

## 🌐 Deployment

### Frontend (Vercel)
- Connect GitHub repo
- Set `NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com`
- Deploy automatically

### Backend (Render)
- Create Web Service
- Root Directory: `server/`
- Build Command: `npm install`
- Start Command: `npm start`
- Set environment variables

## 📁 Project Structure

```
├── src/app/              # Next.js frontend
├── server/               # Express.js backend
├── uploads/              # File uploads
├── public/               # Static assets
└── DEPLOYMENT_GUIDE.md   # Detailed deployment guide
```

## 🔧 Scripts

```bash
npm run dev          # Start frontend dev server
npm run build        # Build for production
npm run dev:server   # Start backend dev server
npm run clear-books  # Clear database books
```

## 📚 API Endpoints

- `GET /api/v1/books` - Get all books
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/admin/login` - Admin login
- `GET /api/health` - Health check

## 🎯 Default Admin

- Email: `admin@example.com`
- Password: `Admin@123`

---

Built with ❤️ for Manoj Sharma
