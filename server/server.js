const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allows React frontend from any dev port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check and root API endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Notes Management System API is running smoothly 🚀',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me (Protected)',
      },
      notes: {
        getAll: 'GET /api/notes (Protected: ?search=&category=&isPinned=&sortBy=)',
        getOne: 'GET /api/notes/:id (Protected)',
        create: 'POST /api/notes (Protected)',
        update: 'PUT /api/notes/:id (Protected)',
        delete: 'DELETE /api/notes/:id (Protected)',
        togglePin: 'PATCH /api/notes/:id/pin (Protected)',
      },
    },
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}`);
});
