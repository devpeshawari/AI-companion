import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getDb } from '../db/mongo';

type JwtPair = { accessToken: string; refreshToken: string };

export class JwtAuthService {
  private accessSecret = process.env.JWT_ACCESS_SECRET || 'access-dev';
  private refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-dev';
  private accessTtl = process.env.JWT_ACCESS_TTL || '15m';
  private refreshTtl = process.env.JWT_REFRESH_TTL || '7d';

  async signup(email: string, password: string) {
    const db = await getDb();
    const users = db.collection('users');
    const existing = await users.findOne({ email });
    if (existing) throw new Error('Email already in use');
    const hash = await bcrypt.hash(password, 10);
    const { insertedId } = await users.insertOne({ email, hash, createdAt: new Date() });
    return { userId: String(insertedId) };
  }

  async login(email: string, password: string): Promise<JwtPair & { userId: string }> {
    const db = await getDb();
    const users = db.collection('users');
    const user = await users.findOne<{ _id: any; email: string; hash: string }>({ email });
    if (!user) throw new Error('Invalid credentials');
    const ok = await bcrypt.compare(password, user.hash);
    if (!ok) throw new Error('Invalid credentials');
    const userId = String(user._id);
    return { userId, ...this.issueTokens(userId) };
  }

  issueTokens(userId: string): JwtPair {
    const accessToken = jwt.sign({ sub: userId }, this.accessSecret, { expiresIn: this.accessTtl });
    const refreshToken = jwt.sign({ sub: userId }, this.refreshSecret, { expiresIn: this.refreshTtl });
    return { accessToken, refreshToken };
  }

  refresh(refreshToken: string): JwtPair {
    const payload = jwt.verify(refreshToken, this.refreshSecret) as any;
    return this.issueTokens(payload.sub);
  }
}


