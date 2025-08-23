# Architecture and Flows — Photoreal Avatar Route

## High-Level Components
- Frontend (Web/PWA): React + Three.js viewer, questionnaire, upload
- Backend API: Node/Express or FastAPI; avatar job proxy; storage; auth (optional)
- Avatar Provider: Avatar SDK / in3D / Didimo (trial)
- Storage: S3-compatible bucket for GLB + textures

## Data Flow (Avatar Generation)

```mermaid
sequenceDiagram
  participant U as User (browser)
  participant FE as Frontend
  participant BE as Backend API
  participant AV as Avatar Provider
  participant S3 as Storage

  U->>FE: Upload selfie + select properties
  FE->>BE: POST /avatar/jobs (file + options)
  BE->>AV: Create job (photo, output=glb, blendshapes=arkit)
  AV-->>BE: 202 Accepted (job_id)
  BE-->>FE: { jobId }
  loop Poll status
    FE->>BE: GET /avatar/jobs/:jobId
    BE->>AV: GET job status
    AV-->>BE: { status, progress }
    BE-->>FE: { status, progress }
  end
  AV-->>BE: Job done + download URL
  BE->>AV: Download GLB
  BE->>S3: Store GLB (and textures)
  BE-->>FE: { assetUrl }
```

## Data Flow (Viewing in Browser)

```mermaid
sequenceDiagram
  participant FE as Frontend
  participant S3 as Storage
  participant BE as Backend

  FE->>BE: GET /avatar/assets/:id (signed URL)
  BE->>S3: Generate signed URL
  S3-->>BE: URL
  BE-->>FE: URL
  FE->>S3: GET model.glb
  FE: Three.js GLTFLoader → render
```

## Component Diagram

```mermaid
graph TD
  subgraph Client
    A[React UI]
    B[Three.js Viewer]
  end
  subgraph Server
    C[Backend API]
    D[(DB: users, jobs)]
    E[(S3 Storage)]
  end
  F[Avatar Provider API]

  A -->|Upload, poll| C
  B -->|Download GLB| E
  C -->|Create job| F
  C -->|Cache asset| E
  C --> D
```

## Minimal Blendshape/Viseme Contract (for later lip-sync)
- Ensure provider exports ARKit‑style shapes or name mapping table
- Example minimal set we will use:
  - jawOpen, mouthFunnel, mouthPucker, mouthSmile, mouthClose
  - eyeBlinkLeft, eyeBlinkRight, browInnerUp

## Performance Budget (mobile‑friendly)
- Geometry: 100–200k triangles
- Textures: 2–4k max; KTX2 compression
- GLB size target: < 20 MB (ideally 8–12 MB)
- FPS: 30–60 on mid‑range Android

## Security/Privacy
- Store explicit consent with selfie upload (checkbox + timestamp)
- Delete raw photos after job completion
- Signed URLs for GLB access
- Age confirmation (18+)


