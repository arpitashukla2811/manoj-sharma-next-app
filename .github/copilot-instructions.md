# AI Coding Assistant Instructions

## Project Overview
This is a full-stack e-commerce platform for author Manoj Sharma's books, built with Next.js frontend and Node.js/Express backend with MongoDB.

## Architecture
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js/Express.js, MongoDB with Mongoose, JWT authentication
- **File Storage**: Local uploads with Multer, organized in `/uploads` directory
- **State Management**: React Context (AuthContext, CartContext, AdminAuthContext)

## Key Conventions

### API Structure
- Base URL: `/api/v1/`
- Authentication: Bearer tokens in `Authorization` header
- Response format: `{ success: boolean, data/message/error }`
- Error handling: Centralized in `server/index.js` with specific error types

### Authentication
- **User Auth**: `AuthContext.jsx`, stores token/user in localStorage
- **Admin Auth**: `AdminAuthContext.jsx`, separate token storage
- **API Calls**: Axios interceptors in `src/services/api.js` handle token injection
- **Routes**: Protected routes use `ProtectedRoute.jsx` and `AdminProtectedRoute.jsx`

### Database Models
- **User**: bcrypt password hashing, login attempt tracking, account locking
- **Book**: Auto-generated slugs from title, text search indexes
- **Admin**: Separate model for admin users
- **Orders/Cart**: Standard e-commerce schemas

### File Organization
- **Frontend Components**: `src/app/components/` with feature-based subdirs
- **Pages**: `src/app/` using Next.js App Router (folders as routes)
- **Backend**: `server/` with MVC structure (models/controllers/routes/middleware)
- **Uploads**: `/uploads/` with subdirs for admin/books/users/temp

### Development Workflow
- **Start Frontend**: `npm run dev` (port 3000)
- **Start Backend**: `npm run dev:server` (port 5000, uses nodemon)
- **Database**: Auto-seeds admin user and sample books on server start
- **Environment**: `.env.local` for frontend, `.env` for backend

### Code Patterns
- **API Services**: Centralized in `src/services/api.js` with auth interceptors
- **Error Handling**: Try/catch with specific error responses
- **Validation**: Mongoose schema validation + custom middleware
- **File Uploads**: Multer config in `server/config/multer.js`
- **Rate Limiting**: Applied to `/api/` routes (100 req/15min)

### Deployment
- **Frontend**: Vercel-ready, set `NEXT_PUBLIC_API_URL` env var
- **Backend**: Railway/Render, root directory `server/`
- **Database**: MongoDB Atlas or local MongoDB
- **Static Files**: Served from `/uploads` with CORS headers

## Common Tasks
- **Add new API endpoint**: Create route in `server/routes/`, controller in `server/controllers/`, update `server/index.js`
- **Add frontend page**: Create folder in `src/app/`, use `page.tsx` or `page.jsx`
- **Add component**: Place in `src/app/components/`, import with relative paths
- **Database changes**: Update model in `server/models/`, run server to apply
- **Authentication**: Use existing contexts, check `role` field for permissions

## Key Files to Reference
- `server/index.js`: Server setup, middleware, error handling
- `src/services/api.js`: API client configuration
- `src/app/components/AuthContext.jsx`: User authentication state
- `server/models/user.model.js`: User schema with security features
- `server/models/books.model.js`: Book schema with slug generation
- `package.json`: Scripts and dependencies