# 📚 Manoj Sharma E-Commerce System

A full-stack e-commerce platform built with Next.js, Node.js, and MongoDB, featuring comprehensive book management, user authentication, and admin functionality.

## 🚀 Live Demo

- **Frontend**: [Your Frontend URL]
- **Backend API**: [Your Backend URL]
- **Admin Panel**: [Your Admin URL]

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based authentication** with role-based access control
- **User roles**: Customer, Admin, Moderator
- **Session management** with automatic token refresh
- **Account lockout protection** after failed login attempts
- **Password reset functionality** with email verification
- **CSRF protection** and rate limiting

### 📁 File Upload System
- **Multer integration** for secure file uploads
- **Image validation** (JPG, PNG, GIF, WebP)
- **Multiple file upload** support
- **Automatic file cleanup** and organization
- **Cloud storage ready** (AWS S3, Cloudinary)

### 🛒 E-Commerce Features
- **Product catalog** with advanced filtering and search
- **Shopping cart** with persistent storage
- **Order management** with status tracking
- **User profiles** with order history
- **Admin dashboard** with analytics
- **Inventory management** with stock tracking

### 🎨 Enhanced Features
- **Pagination** and advanced search functionality
- **Featured products** and best sellers
- **Sale/discount system** with percentage calculations
- **Product ratings** and reviews system
- **SEO optimization** with meta tags
- **Responsive design** for all devices

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with TypeScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Notification system

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload middleware
- **bcryptjs** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type safety
- **Nodemon** - Development server
- **Git** - Version control

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher) or MongoDB Atlas account
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd manoj-sharma-next
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database Configuration
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

# Optional: Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 4. Start Development Servers

```bash
# Terminal 1: Start backend server
npm run dev:server

# Terminal 2: Start frontend development server
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health
- **API Documentation**: http://localhost:5000/api/docs

### 6. Default Admin Credentials

- **Email**: admin@example.com
- **Password**: Admin@123

## 📁 Project Structure

```
manoj-sharma-next/
├── src/                          # Frontend source code
│   ├── app/                      # Next.js app directory
│   │   ├── admin/               # Admin panel pages
│   │   ├── auth/                # Authentication pages
│   │   ├── components/          # Reusable components
│   │   ├── services/            # API services
│   │   └── ...
│   └── ...
├── server/                       # Backend source code
│   ├── config/                  # Configuration files
│   │   ├── env.js              # Environment configuration
│   │   └── multer.js           # File upload configuration
│   ├── controllers/             # Route controllers
│   ├── middleware/              # Custom middleware
│   ├── models/                  # Database models
│   ├── routes/                  # API routes
│   └── index.js                 # Server entry point
├── uploads/                      # File upload directory
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start frontend development server
npm run dev:server       # Start backend development server
npm run build            # Build frontend for production
npm run start            # Start production server

# Linting and Formatting
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors

# Database
npm run db:seed          # Seed database with sample data
npm run db:reset         # Reset database (development only)
```

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get user profile
- `POST /api/v1/admin/login` - Admin login

### Books
- `GET /api/v1/books` - Get all books with filters
- `GET /api/v1/books/featured` - Get featured books
- `GET /api/v1/books/bestsellers` - Get best sellers
- `GET /api/v1/books/new-releases` - Get new releases
- `GET /api/v1/books/on-sale` - Get books on sale
- `GET /api/v1/books/:id` - Get book by ID
- `GET /api/v1/books/slug/:slug` - Get book by slug

### File Upload
- `POST /api/v1/upload/single` - Upload single image
- `POST /api/v1/upload/multiple` - Upload multiple images
- `POST /api/v1/upload/book-images` - Upload book images
- `DELETE /api/v1/upload/files/:filename` - Delete file

### Cart & Orders
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart/add` - Add item to cart
- `PUT /api/v1/cart/update` - Update cart item
- `DELETE /api/v1/cart/remove/:id` - Remove item from cart
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Get user orders

### Admin (Protected)
- `GET /api/v1/admin/dashboard` - Admin dashboard
- `GET /api/v1/admin/stats` - System statistics
- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/admin/orders` - Get all orders

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Role-based Access Control** (RBAC)
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **CORS Configuration** for cross-origin requests
- **File Upload Security** with type and size validation
- **Password Hashing** with bcrypt
- **Account Lockout** after failed attempts

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin', 'moderator']),
  avatar: String,
  phone: String,
  address: Object,
  isEmailVerified: Boolean,
  loginAttempts: Number,
  lockUntil: Date,
  isActive: Boolean,
  preferences: Object
}
```

### Book Model
```javascript
{
  title: String,
  slug: String (unique),
  description: String,
  fullDescription: String,
  author: String,
  price: Number,
  originalPrice: Number,
  discountPercentage: Number,
  rating: Number,
  reviews: Number,
  coverImage: String,
  galleryImages: [String],
  stock: Number,
  isFeatured: Boolean,
  isBestSeller: Boolean,
  isNewRelease: Boolean,
  isOnSale: Boolean,
  status: String (enum: ['draft', 'published', 'archived']),
  views: Number,
  sales: Number
}
```

## 🚀 Deployment

### Frontend Deployment (Vercel)
1. Connect your repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
3. Deploy automatically on push

### Backend Deployment (Railway/Render)
1. Connect your repository
2. Set environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret
   - `FRONTEND_URL`: Your frontend URL
3. Set root directory to `server/`

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](./DEPLOYMENT_GUIDE.md#troubleshooting)
2. Review the [API documentation](http://localhost:5000/api/docs)
3. Check server logs for error messages
4. Verify environment variables are set correctly

## 🎯 Roadmap

- [ ] Email notification system
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced search with filters
- [ ] Wishlist functionality
- [ ] Social media integration
- [ ] Advanced SEO features
- [ ] Performance optimization

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB team for the database
- All contributors and supporters

---

**Built with ❤️ by Manoj Sharma**

For more information, visit: [Your Website]
