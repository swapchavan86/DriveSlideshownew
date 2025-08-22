import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import driveRoutes from './routes/drive';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.UI_ORIGIN,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.get('/', (req, res) => {
  res.send('Drive Slideshow API is running!');
});

app.use('/auth', authRoutes);
app.use('/drive', driveRoutes);

export default app;
