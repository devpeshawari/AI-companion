# AI Companion Backend

TypeScript Express service to accept a selfie (JPG) and options, create an avatar generation job via a pluggable provider client, poll status, and provide a downloadable GLB.

## Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

## Endpoints
- POST /avatar/jobs (multipart: photo, options json)
- GET /avatar/jobs/:id
- GET /avatar/assets/:assetId

## Notes
- Provider client is pluggable; default is a stub you can swap for a real provider.
- Assets are saved to `STORAGE_DIR` (default `storage`).
