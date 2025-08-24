import { ReadyPlayerMeClient } from '../clients/ReadyPlayerMeClient';

export class AvatarService {
  constructor(private readonly rpm: ReadyPlayerMeClient) {}

  async createAnonymousUser() {
    return this.rpm.createAnonymousUser();
  }
}


