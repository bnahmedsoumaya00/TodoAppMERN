# 📝 Modern Todo App

A full-stack todo application with a beautiful dark theme, built with the MERN stack. Features secure authentication, real-time task management, and a responsive design.

[![Live Demo](https://img.shields.io/badge/Demo-Live-success? style=for-the-badge)](https://todoappbysoumaya.vercel.app)
[![Status](https://img.shields.io/badge/Status-Production-green? style=for-the-badge)]()

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based login with bcrypt password hashing
- 📋 **Full CRUD Operations** - Create, read, update, and delete todos
- 🎯 **Priority Levels** - High, Medium, Low with color coding
- 📅 **Due Dates** - Set deadlines for your tasks
- 🏷️ **Categories** - Organize todos with custom categories
- 📊 **Statistics Dashboard** - Track your productivity
- ✅ **Subtasks** - Break down complex tasks
- 🔄 **Recurring Tasks** - Automatic task repetition
- 📎 **File Attachments** - Attach files to your todos
- 🎨 **Beautiful UI** - Dark theme with smooth animations
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?logo=tailwind-css)
![Axios](https://img.shields.io/badge/Axios-1.12-5A29E4?logo=axios)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-Latest-339933?logo=node. js)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)
![MySQL](https://img.shields.io/badge/MySQL-9.4-4479A1?logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=json-web-tokens)

### Deployment
- **Frontend**: Vercel
- **Backend**: Railway
- **Database**: Railway MySQL

## 🚀 Quick Start

### Prerequisites
- Node. js 16+
- MySQL 8.0+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bnahmedsoumaya00/todo-app.git
   cd todo-app
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   
   # Create .env file
   cp .env.example .env
   # Update with your credentials
   
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   
   # Create .env file
   echo VITE_API_URL=http://localhost:5000 > .env
   
   npm run dev
   ```

4. **Setup Database**
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE todo_app;
   
   # The app will automatically run migrations on start
   ```

5. **Access the Application**
   - Frontend:  http://localhost:5173
   - Backend:  http://localhost:5000

## 📁 Project Structure

```
todo-app/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # Context providers
│   │   ├── services/          # API services
│   │   └── utils/             # Utilities
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── controllers/           # Business logic
│   ├── middleware/            # Auth & validation
│   ├── routes/                # API routes
│   ├── config/                # Configuration
│   ├── utils/                 # Helper functions
│   └── server.js
│
└── README.md
```

## 🔐 Environment Variables

### Server `.env`
```env
PORT=5000
MYSQLHOST=localhost
MYSQLUSER=root
MYSQLPASSWORD=your_password
MYSQLDATABASE=todo_app
MYSQLPORT=3306
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### Client `.env`
```env
VITE_API_URL=http://localhost:5000
```

## 📖 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Todos
- `GET /todos` - Get all todos
- `GET /todos/:id` - Get single todo
- `POST /todos` - Create todo
- `PUT /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo
- `PATCH /todos/:id/toggle` - Toggle completion
- `GET /todos/stats` - Get statistics

### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Attachments
- `POST /attachments` - Upload file
- `GET /attachments/: id` - Download file
- `DELETE /attachments/:id` - Delete file

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `password_hash` - Bcrypt hashed password
- `full_name` - Optional full name
- `is_active` - Account status
- `created_at`, `updated_at`, `last_login` - Timestamps

### Todos Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `title`, `description` - Task details
- `completed` - Completion status
- `priority` - low/medium/high
- `category` - Task category
- `due_date` - Deadline
- `parent_id` - For subtasks
- `is_recurring` - Recurring flag
- `recurrence_pattern`, `recurrence_interval` - Recurrence settings
- Timestamps

### Categories & Attachments
- Custom categories with colors and icons
- File attachments with metadata

## 🎨 Features Showcase

- ✅ User authentication with secure password hashing
- ✅ JWT token-based authorization
- ✅ Create, edit, delete todos
- ✅ Priority levels with visual indicators
- ✅ Due date tracking
- ✅ Category organization
- ✅ Task completion toggle
- ✅ Statistics dashboard
- ✅ Subtask management
- ✅ Recurring tasks
- ✅ File attachments
- ✅ Responsive design
- ✅ Error handling & validation

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
vercel --prod
```

### Backend (Railway)
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically on push

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Soumaya**

- GitHub: [@bnahmedsoumaya00](https://github.com/bnahmedsoumaya00)
- Live Demo: [todoappbysoumaya.vercel.app](https://todoappbysoumaya.vercel.app)

## 🙏 Acknowledgments

- Built with React, Node.js, Express, and MySQL
- Deployed on Vercel and Railway
- Icons by Lucide React
- UI inspired by modern design principles

---

⭐ **Star this repo if you found it helpful!**