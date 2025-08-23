import axios from 'axios';

type CreateJobOptions = {
  imageBuffer: Buffer;
  filename: string;
  mimeType: string;
  options: Record<string, unknown>;
};

export const providerClient = {
  async createJob({ imageBuffer, filename, mimeType, options }: CreateJobOptions): Promise<{ jobId: string }> {
    // Stub: in real impl, POST to third-party provider with form-data
    // For now, return a fake job id and simulate processing via routes
    const jobId = `prov_${Date.now()}`;
    return { jobId };
  },

  async getJobStatus(jobId: string): Promise<{ status: 'queued'|'processing'|'done'|'error'; progress?: number; assetUrl?: string; error?: string }> {
    // Stub: simulate progress then done with a placeholder asset URL
    const p = Math.min(1, (Date.now() % 8000) / 8000);
    if (p < 0.8) return { status: 'processing', progress: p };
    return { status: 'done', progress: 1, assetUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/VC/glTF-Binary/VC.glb' };
  },

  async downloadAsset(url: string): Promise<Buffer> {
    const resp = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(resp.data);
  }
};
