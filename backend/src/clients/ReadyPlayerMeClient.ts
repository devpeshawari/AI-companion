import axios, { AxiosInstance } from 'axios';

export type CreateAnonymousUserResult = { userId: string };

export class ReadyPlayerMeClient {
    private readonly http: AxiosInstance;
    private readonly baseUrl: string;
    private readonly apiKey?: string;

    constructor(params?: { baseUrl?: string; apiKey?: string }) {
        this.baseUrl = params?.baseUrl || 'https://api.readyplayer.me';
        this.apiKey = params?.apiKey || process.env.RPM_API_KEY;
        this.http = axios.create();
    }

    async createAnonymousUser(): Promise<CreateAnonymousUserResult> {
        try {
            const resp = await this.http.post(
                `${this.baseUrl}/v1/users`,
                {},
                { headers: { Authorization: `x-api-key ${this.apiKey}` } }
            );
            const data = resp.data;
            const userId: string = data.id;
            if (!userId) throw new Error('RPM create user: missing id');
            return { userId };
        } catch (error: any) {
            throw new Error(`RPM create user: ${error?.message}`);
        }

    }

    // Placeholders for future RPM calls (to be filled incrementally):
    // async listTemplates(userToken: string): Promise<any> { /* ... */ }
    // async createDraftFromTemplate(userToken: string, templateId: string, partner: string, bodyType: 'fullbody'|'halfbody'): Promise<{ avatarId: string }> { /* ... */ }
    // async saveAvatar(userToken: string, avatarId: string, assets?: Record<string, unknown>): Promise<void> { /* ... */ }
    // getFinalGlbUrl(avatarId: string): string { return `https://models.readyplayer.me/${avatarId}.glb`; }
}


