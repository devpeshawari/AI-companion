# API and Data Model — Photoreal Avatar Route

## Environment
- PROVIDER: "avatar-sdk" | "in3d" | "didimo"
- PROVIDER_API_KEY: <secret>
- STORAGE_BUCKET: s3://bucket-name

## REST Endpoints (Backend)

### POST /avatar/jobs
Create an avatar generation job.

Request (multipart/form-data):
- file: selfie.jpg/png (required by most providers)
- options (JSON):
  - output: "glb"
  - blendshapes: "arkit" | "basic"
  - realism: "high"

Response 202:
```json
{ "jobId": "abc123" }
```

### GET /avatar/jobs/:jobId
Poll job status.

Response 200:
```json
{ "status": "queued|processing|done|error", "progress": 0.0, "assetId": "opt" }
```

### GET /avatar/assets/:assetId
Return a signed URL to download the GLB.

Response 200:
```json
{ "url": "https://.../model.glb?signature=...", "expiresIn": 3600 }
```

### POST /avatar/preferences
Save appearance/voice/persona preferences linked to the asset/user.

Request JSON:
```json
{
  "assetId": "abc",
  "appearance": { "bindi": true, "earrings": "jhumka" },
  "voice": { "language": "hinglish", "pitch": 0.1, "speed": -0.05 },
  "persona": { "warmth": 0.8, "humor": 0.4, "formality": 0.3 }
}
```

Response 200: `{ "ok": true }`

## Data Model (DB)

### users
- id (uuid)
- created_at
- age_confirmed (bool)
- consent_selfie (bool)

### avatar_jobs
- id (uuid)
- user_id (uuid)
- provider (text)
- provider_job_id (text)
- status (text)
- progress (float)
- created_at, updated_at

### avatar_assets
- id (uuid)
- user_id (uuid)
- job_id (uuid)
- storage_key (text) // e.g., avatars/abc/model.glb
- blendshape_map (jsonb) // name mapping if provider differs
- created_at

### preferences
- id (uuid)
- user_id (uuid)
- asset_id (uuid)
- appearance (jsonb)
- voice (jsonb)
- persona (jsonb)
- created_at, updated_at

## Blendshape/Viseme Mapping (example JSON)
```json
{
  "MBP": [ ["mouthClose", 1.0] ],
  "A":   [ ["jawOpen", 0.8], ["mouthFunnel", 0.2] ],
  "E":   [ ["mouthSmile", 0.6], ["jawOpen", 0.2] ],
  "O":   [ ["mouthPucker", 0.9], ["jawOpen", 0.3] ],
  "U":   [ ["mouthPucker", 0.8] ],
  "FV":  [ ["mouthFunnel", 0.6] ]
}
```

## Frontend Loader (reference snippet)
```js
// fetch signed URL then:
const loader = new GLTFLoader();
loader.load(url, (gltf) => {
  scene.add(gltf.scene);
  // locate the face mesh with morph targets and store dictionaries
});
```


