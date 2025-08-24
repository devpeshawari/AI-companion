import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import avatarRouter from './routes/avatar.routes';

const app: express.Application = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve local storage files for dev (matches storage.getSignedUrl)
const storageDir = process.env.STORAGE_DIR || 'storage';
app.use('/local', express.static(storageDir));

// health
app.get('/health', (_req, res) => res.json({ ok: true }));

// routes
app.use('/avatar', avatarRouter);

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
