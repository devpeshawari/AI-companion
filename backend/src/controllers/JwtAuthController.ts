import { Request, Response } from 'express';
import { z } from 'zod';
import { JwtAuthService } from '../services/JwtAuthService';

const CredsSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
const RefreshSchema = z.object({ refreshToken: z.string().min(10) });

export class JwtAuthController {
  constructor(private readonly service: JwtAuthService) {}

  signup = async (req: Request, res: Response) => {
    try {
      const body = CredsSchema.parse(req.body);
      const { userId } = await this.service.signup(body.email, body.password);
      const tokens = this.service.issueTokens(userId);
      res.json({ userId, ...tokens });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || 'bad request' });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const body = CredsSchema.parse(req.body);
      const result = await this.service.login(body.email, body.password);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err?.message || 'bad request' });
    }
  };

  refresh = async (req: Request, res: Response) => {
    try {
      const body = RefreshSchema.parse(req.body);
      const tokens = this.service.refresh(body.refreshToken);
      res.json(tokens);
    } catch (err: any) {
      res.status(401).json({ error: 'invalid refresh token' });
    }
  };

  me = async (req: Request, res: Response) => {
    try {
      const auth = req.headers.authorization || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
      if (!token) return res.status(401).json({ error: 'unauthorized' });
      // lightweight parse: don't verify here; ideally add verify middleware
      res.json({ token });
    } catch {
      res.status(401).json({ error: 'unauthorized' });
    }
  };
}


