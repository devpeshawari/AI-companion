# AI Companion Backend

TypeScript Express service to accept a selfie (JPG) and options, create an avatar generation job via a pluggable provider client, poll status, and provide a downloadable GLB.

## Setup

```bash
cd backend
cp .env.example .env
# Set PROVIDER=didimo and PROVIDER_API_KEY in .env
npm install
npm run dev
```

## Endpoints
- POST /avatar/jobs (multipart: photo, options json)
- GET /avatar/jobs/:id
- GET /avatar/assets/:assetId

## Provider
- Current wired provider: **Didimo** (stubbed calls). Replace stubs in `src/vendor/providerClient.ts` with real API endpoints and auth headers.

## Notes
- Assets are saved to `STORAGE_DIR` (default `storage`).
- `/local/*` serves stored files in dev.
