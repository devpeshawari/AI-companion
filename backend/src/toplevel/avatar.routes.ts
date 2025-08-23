import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { providerClient } from '../vendor/providerClient';
import { storage } from '../util/storage';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const router = Router();

const OptionsSchema = z.object({
  output: z.enum(['glb']).default('glb'),
  blendshapes: z.enum(['arkit', 'basic']).default('arkit'),
  realism: z.enum(['high', 'medium']).default('high')
}).partial();

type JobStatus = 'queued' | 'processing' | 'done' | 'error';
const jobs: Record<string, { status: JobStatus; progress: number; assetId?: string; error?: string }> = {};

router.post('/jobs', upload.single('photo'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'photo (jpg/png) is required' });
    const options = OptionsSchema.parse(req.body?.options ? JSON.parse(String(req.body.options)) : {});

    const jobId = randomUUID();
    jobs[jobId] = { status: 'queued', progress: 0 };

    // Fire and forget async processing
    (async () => {
      try {
        jobs[jobId].status = 'processing';
        jobs[jobId].progress = 0.1;

        const providerResp = await providerClient.createJob({
          imageBuffer: file.buffer,
          filename: file.originalname,
          mimeType: file.mimetype,
          options
        });

        // poll provider
        let done = false;
        while (!done) {
          const st = await providerClient.getJobStatus(providerResp.jobId);
          jobs[jobId].progress = st.progress ?? jobs[jobId].progress;
          if (st.status === 'done') {
            done = true;
            // download asset
            const glb = await providerClient.downloadAsset(st.assetUrl!);
            const assetId = randomUUID();
            const key = path.join('avatars', assetId, 'model.glb');
            await storage.save(key, glb);
            jobs[jobId] = { status: 'done', progress: 1, assetId };
          } else if (st.status === 'error') {
            jobs[jobId] = { status: 'error', progress: jobs[jobId].progress, error: st.error || 'provider error' };
            done = true;
          } else {
            await new Promise(r => setTimeout(r, 1500));
          }
        }
      } catch (err: any) {
        jobs[jobId] = { status: 'error', progress: 1, error: err?.message || 'unexpected error' };
      }
    })();

    res.status(202).json({ jobId });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || 'bad request' });
  }
});

router.get('/jobs/:id', (req, res) => {
  const job = jobs[req.params.id];
  if (!job) return res.status(404).json({ error: 'not found' });
  res.json(job);
});

router.get('/assets/:assetId', async (req, res) => {
  const key = path.join('avatars', req.params.assetId, 'model.glb');
  if (!(await storage.exists(key))) return res.status(404).json({ error: 'asset not found' });
  const url = await storage.getSignedUrl(key, 60 * 60);
  res.json({ url, expiresIn: 3600 });
});

export default router;
