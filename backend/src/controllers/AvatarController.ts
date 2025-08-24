import { Request, Response } from 'express';
import { z } from 'zod';
import { AvatarService } from '../services/AvatarService';

export class AvatarController {
  constructor(private readonly service: AvatarService) {}

  createAnonymousUser = async (req: Request, res: Response) => {
    try {
      const result = await this.service.createAnonymousUser();
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err?.message || 'bad request' });
    }
  };
}


