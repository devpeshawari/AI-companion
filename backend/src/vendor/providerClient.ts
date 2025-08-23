import axios from 'axios';

const PROVIDER = (process.env.PROVIDER || 'didimo').toLowerCase();
const API_KEY = process.env.PROVIDER_API_KEY || '';

type CreateJobOptions = {
  imageBuffer: Buffer;
  filename: string;
  mimeType: string;
  options: Record<string, unknown>;
};

type StatusResp = { status: 'queued'|'processing'|'done'|'error'; progress?: number; assetUrl?: string; error?: string };

async function didimoCreateJob({ imageBuffer, filename, mimeType, options }: CreateJobOptions): Promise<{ jobId: string }> {
  // Pseudo: mirror Didimo create call with multipart form
  // const form = new FormData(); form.append('photo', imageBuffer, filename); form.append('output', 'gltf'); ...
  // await axios.post('https://api.didimo.co/avatars', form, { headers: { Authorization: `Bearer ${API_KEY}` } });
  const jobId = `did_${Date.now()}`;
  return { jobId };
}

async function didimoGetStatus(jobId: string): Promise<StatusResp> {
  // Pseudo: GET https://api.didimo.co/avatars/{jobId}
  const p = Math.min(1, (Date.now() % 8000) / 8000);
  if (p < 0.8) return { status: 'processing', progress: p };
  // Pseudo: when ready, Didimo provides download links; we choose GLB
  return { status: 'done', progress: 1, assetUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/VC/glTF-Binary/VC.glb' };
}

async function downloadAsset(url: string): Promise<Buffer> {
  const resp = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(resp.data);
}

export const providerClient = {
  async createJob(opts: CreateJobOptions): Promise<{ jobId: string }> {
    if (PROVIDER === 'didimo') return didimoCreateJob(opts);
    // fallback stub
    const jobId = `prov_${Date.now()}`;
    return { jobId };
  },
  async getJobStatus(jobId: string): Promise<StatusResp> {
    if (PROVIDER === 'didimo') return didimoGetStatus(jobId);
    const p = Math.min(1, (Date.now() % 8000) / 8000);
    if (p < 0.8) return { status: 'processing', progress: p };
    return { status: 'done', progress: 1, assetUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/VC/glTF-Binary/VC.glb' };
  },
  downloadAsset
};
