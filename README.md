# NoteSphere - Notes Management System

A full-stack web application designed for organizing, managing, and categorizing personal and work notes with rich text support and secure authentication.

---

## Features

- **User Authentication**: Secure user registration and login using JWT and password hashing (bcrypt).
- **Notes Management (CRUD)**: Create, view, edit, and delete notes with rich text formatting.
- **Organization & Filtering**:
  - Categorize notes into Work, Personal, Study, and Other.
  - Pin important notes to the top.
  - Custom color themes and tag support.
  - Real-time search by title, content, and tags.
  - Sorting options (Recent, Newest, Oldest, Alphabetical).
- **Responsive Interface**: Clean desktop and mobile-friendly design with grid and list view options.

---

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Axios
- **Backend**: Node.js, Express.js, JWT (jsonwebtoken), bcryptjs
- **Database**: MongoDB (Mongoose ODM)

---

## Project Structure

```text
Notes-management-system/
├── client/          # Frontend React application
│   ├── src/
│   │   ├── api/        # Axios API services
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Authentication state
│   │   └── pages/      # Dashboard, Login, Register pages
│   └── package.json
├── server/          # Backend Express API
│   ├── config/      # Database connection
│   ├── controllers/ # Route logic handlers
│   ├── middleware/  # Auth & error middlewares
│   ├── models/      # User and Note schemas
│   ├── routes/      # API endpoints
│   └── server.js
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

---

### Installation & Setup

#### 1. Clone the repository
```bash
git clone <repository-url>
cd Notes-management-system
```

#### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:
```bash
npm run dev

```

#### 3. Frontend Setup
Open a new terminal:
```bash
cd client
npm install

```

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Log in user and receive JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user details | Yes |
| `GET` | `/api/notes` | Get all notes (supports search, sort, category) | Yes |
| `GET` | `/api/notes/:id` | Get note by ID | Yes |
| `POST` | `/api/notes` | Create a new note | Yes |
| `PUT` | `/api/notes/:id` | Update an existing note | Yes |
| `DELETE` | `/api/notes/:id` | Delete a note | Yes |
| `PATCH` | `/api/notes/:id/pin` | Toggle pin status of a note | Yes |



