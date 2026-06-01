import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3001;

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(express.json());

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`✦ HobbyServers API → http://localhost:${PORT}`);
});
