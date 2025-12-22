# 🎯 Modern Todo App

A sleek, full-stack todo application with a beautiful dark purple theme, built with React, Node.js, and MySQL. Features user authentication, real-time todo management, and a responsive design.

![Todo App Preview](https://img.shields.io/badge/Status-In_Development-purple?style=for-the-badge)

## ✨ Features

### 🔐 Authentication System
- **Secure User Registration** - Email validation, password strength checking
- **JWT-based Login** - Persistent sessions with token-based authentication
- **Protected Routes** - Secure access to user-specific content
- **Password Security** - Bcrypt hashing with salt rounds

### 📋 Todo Management
- **CRUD Operations** - Create, read, update, and delete todos
- **Priority Levels** - High, Medium, Low priority with color coding
- **Due Dates & Reminders** - Never miss important tasks
- **Categories & Filtering** - Organize and find todos quickly
- **Completion Tracking** - Mark tasks complete with timestamps

### 🎨 Beautiful UI/UX
- **Dark Purple Theme** - Modern gradient design with violet accents
- **Responsive Design** - Perfect on desktop, tablet, and mobile
- **Smooth Animations** - Micro-interactions for better user experience
- **Toast Notifications** - Real-time feedback for user actions
- **Loading States** - Skeleton loaders and progress indicators

### 📊 Analytics & Insights
- **Todo Statistics** - Track completion rates and productivity
- **Visual Dashboards** - Overview of tasks, deadlines, and progress
- **Filter Options** - View by status, priority, date, category

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=flat&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.14-38B2AC?style=flat&logo=tailwind-css)
![React Router](https://img.shields.io/badge/React_Router-7.9.4-CA4245?style=flat&logo=react-router)
![Axios](https://img.shields.io/badge/Axios-1.12.2-5A29E4?style=flat&logo=axios)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-Latest-339933?style=flat&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat&logo=express)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat&logo=json-web-tokens)

### Tools & Libraries
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Elegant notifications
- **Date-fns** - Date manipulation utilities
- **Bcryptjs** - Password hashing
- **Express Validator** - Input validation

## 🏗️ Project Architecture

```
todo-app/
├── 📁 client/                    # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/        # React Components
│   │   │   ├── 📁 Auth/          # Login, Register, ProtectedRoute
│   │   │   ├── 📁 Dashboard/     # Dashboard, TodoList, TodoItem
│   │   │   ├── 📁 Layout/        # Navbar, Sidebar, Footer
│   │   │   └── 📁 UI/            # Reusable UI components
│   │   ├── 📁 context/           # React Context (Auth, Todo)
│   │   ├── 📁 services/          # API calls and utilities
│   │   └── 📁 utils/             # Helper functions
│   └── 📄 package.json
│
├── 📁 server/                    # Node.js Backend
│   ├── 📁 controllers/           # Business logic
│   ├── 📁 middleware/            # Auth, validation, error handling
│   ├── 📁 models/                # Database models
│   ├── 📁 routes/                # API routes
│   ├── 📁 config/                # Database & app configuration
│   └── 📄 server.js
│
└── 📄 README.md
```

## 🚀 Complete Development Plan

### 📁 Full Project Structure

```
todo-app/
│
├── client/                          # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── TodoList.jsx
│   │   │   │   ├── TodoItem.jsx
│   │   │   │   ├── AddTodoForm.jsx
│   │   │   │   └── TodoStats.jsx
│   │   │   ├── Layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   └── UI/
│   │   │       ├── Button.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Modal.jsx
│   │   │       └── Toast.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── TodoContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── todoService.js
│   │   ├── utils/
│   │   │   ├── helpers.js
│   │   │   └── validators.js
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env
│
├── server/                          # Node.js Backend
│   ├── config/
│   │   ├── database.js
│   │   └── config.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── todoController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── models/
│   │   ├── User.js
│   │   └── Todo.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── todoRoutes.js
│   ├── utils/
│   │   ├── jwtUtils.js
│   │   └── passwordUtils.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── database/
│   ├── schema.sql
│   └── seeds.sql
│
├── .gitignore
└── README.md
```

### 🎨 Design Theme: Dark Purple

#### Color Palette
```css
Primary Purple: #8B5CF6 (violet-500)
Dark Purple: #6D28D9 (violet-700)
Light Purple: #A78BFA (violet-400)
Background Dark: #0F0A1E (custom dark)
Card Background: #1A1432 (custom)
Accent: #C084FC (violet-300)
Text Primary: #E9D5FF (violet-100)
Text Secondary: #A78BFA (violet-400)
Border: #4C1D95 (violet-900)
Success: #10B981 (emerald-500)
Error: #EF4444 (red-500)
Warning: #F59E0B (amber-500)
```

### 🗄️ Database Schema

#### MySQL Tables

```sql
-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- Todos Table
CREATE TABLE todos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    category VARCHAR(50) DEFAULT 'general',
    due_date DATE,
    reminder_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_completed (completed),
    INDEX idx_due_date (due_date),
    INDEX idx_priority (priority)
);

-- Categories Table (Optional)
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#8B5CF6',
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_category (user_id, name)
);
```

### 🛠️ Development Setup

#### Prerequisites
```bash
# Install Node.js (v16+)
# Install MySQL (v8+)
# Install Git
```

#### Backend Setup
```bash
# Navigate to server directory
cd server

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express mysql2 cors dotenv bcryptjs jsonwebtoken express-validator

# Install dev dependencies
npm install --save-dev nodemon

# Create .env file
cat > .env << EOF
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=todo_app
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
EOF
```

#### Frontend Setup
```bash
# Navigate to client directory
cd client

# Create React app with Vite
npm create vite@latest . -- --template react

# Install dependencies
npm install axios react-router-dom

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install UI libraries
npm install lucide-react react-hot-toast date-fns

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF
```

#### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FAF5FF',
          100: '#E9D5FF',
          200: '#D8B4FE',
          300: '#C084FC',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        dark: {
          bg: '#0F0A1E',
          card: '#1A1432',
          border: '#2D1F4A',
        }
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
```

### 📝 Development Phases

#### Phase 1: Foundation (Week 1)
- ✅ Project setup and configuration
- ✅ Database schema creation
- ✅ Tailwind configuration with dark purple theme
- 🚧 Backend server setup with Express.js
- 🚧 Authentication middleware and JWT utils

#### Phase 2: Authentication (Week 2)
- 🚧 Auth controllers and routes
- 🚧 Login and Register components
- 🚧 Protected Route implementation
- 🚧 Auth Context and services
- 🚧 JWT token management

#### Phase 3: Core Todo Features (Week 3)
- ⏳ Todo CRUD operations
- ⏳ Todo components (List, Item, Form)
- ⏳ Dashboard with statistics
- ⏳ Todo Context implementation
- ⏳ Filter and sort functionality

#### Phase 4: UI/UX Polish (Week 4)
- ⏳ Responsive design implementation
- ⏳ Animations and transitions
- ⏳ Error handling and validation
- ⏳ Toast notifications
- ⏳ Loading states and skeletons

#### Phase 5: Advanced Features (Week 5)
- ⏳ Categories and tags
- ⏳ Due date reminders
- ⏳ Priority system
- ⏳ Search functionality
- ⏳ User profile management

#### Phase 6: Testing & Deployment (Week 6)
- ⏳ Unit testing setup
- ⏳ Integration testing
- ⏳ Performance optimization
- ⏳ Production build
- ⏳ Deployment configuration

## 🎨 Design System

### Color Palette
- **Primary Purple**: `#8B5CF6` - Main action buttons, links
- **Dark Purple**: `#6D28D9` - Hover states, borders
- **Background**: `#0F0A1E` to `#1A1432` - Gradient backgrounds
- **Cards**: `#1A1432` - Component backgrounds
- **Text**: `#E9D5FF` - Primary text
- **Accents**: `#C084FC` - Secondary elements

### Components Preview
- ✅ **Login Form** - Gradient background with floating cards
- ✅ **Dashboard** - Statistics cards and todo overview
- 🚧 **Todo List** - Filterable, sortable task management
- 🚧 **Todo Item** - Priority badges, due dates, completion status
- 🚧 **Navigation** - Responsive sidebar and top navbar

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- MySQL 8.0+ installed
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/todo-app.git
   cd todo-app
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your database credentials
   
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   
   # Create .env file
   cp .env.example .env
   
   npm run dev
   ```

4. **Setup Database**
   ```sql
   CREATE DATABASE todo_app;
   -- Run the SQL schema from database/schema.sql
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📱 Screenshots

*Coming soon - Screenshots will be added as components are completed*

## 🔐 Environment Variables

### Server (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=todo_app
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Todo Endpoints
- `GET /api/todos` - Get all user todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `PATCH /api/todos/:id/toggle` - Toggle completion
- `GET /api/todos/stats` - Get user statistics

## 🧪 Development Status

- ✅ Project setup and configuration
- ✅ Database schema design
- ✅ Authentication UI - Login form completed
- ✅ Tailwind configuration with dark purple theme
- 🚧 Backend API development
- 🚧 Frontend components
- 🚧 Integration and testing
- ⏳ Deployment preparation

## ✅ Testing Checklist

- [ ] User can register with email, username, password
- [ ] User can login and receive JWT token
- [ ] Token is stored and sent with requests
- [ ] Protected routes redirect to login if not authenticated
- [ ] User can create todo with title, description, priority, due date
- [ ] User can view all their todos
- [ ] User can filter todos by status and priority
- [ ] User can mark todo as complete/incomplete
- [ ] User can edit todo
- [ ] User can delete todo
- [ ] Stats display correctly
- [ ] Dark purple theme applied throughout
- [ ] Responsive on mobile devices
- [ ] Form validations work
- [ ] Error messages display correctly
- [ ]