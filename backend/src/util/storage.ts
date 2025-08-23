import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const baseDir = process.env.STORAGE_DIR || 'storage';

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export const storage = {
  async save(key: string, data: Buffer) {
    const filePath = path.join(baseDir, key);
    await ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, data);
  },
  async exists(key: string) {
    try {
      await fs.access(path.join(baseDir, key));
      return true;
    } catch {
      return false;
    }
  },
  async getSignedUrl(key: string, _expiresInSeconds: number): Promise<string> {
    // For local dev we expose a file URL via a static server path in the future.
    // For now, return a pseudo URL indicating local path.
    const token = crypto.randomBytes(8).toString('hex');
    return `/local/${encodeURIComponent(key)}?t=${token}`;
  }
};
