import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import avatarRouter from './routes/avatar.routes';
 

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// health
app.get('/health', (_req, res) => res.json({ ok: true }));

// routes
app.use('/avatar', avatarRouter);

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
