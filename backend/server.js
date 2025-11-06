const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');

dotenv.config();

const app = express();

// Connect to DB if not testing
if (process.env.NODE_ENV !== 'test') connectDB();

// Security & parsing middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  })
);

app.use(morgan('combined'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(xss());
app.use(cookieParser());

// Deep sanitize
function deepSanitizeMutate(obj) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) deepSanitizeMutate(obj[i]);
    return;
  }
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) delete obj[key];
    else if (typeof obj[key] === 'object') deepSanitizeMutate(obj[key]);
  }
}

app.use((req, res, next) => {
  try {
    if (req.body && typeof req.body === 'object') deepSanitizeMutate(req.body);
  } catch (err) {
    console.error('Sanitize middleware error:', err);
  }
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// CORS (frontend dev server)
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
}));


app.disable('x-powered-by');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'IntBank API running',
    protocol: req.protocol,
    secure: req.secure,
    timestamp: new Date().toISOString(),
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// 500
app.use((err, req, res, _next) => {
  console.error('Server error:', err.message || err);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

module.exports = app;
