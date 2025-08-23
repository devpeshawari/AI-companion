# Photoreal Avatar Route — Implementation Plan (Free/Trial First)

## Goal
Create a photoreal, browser‑ready female avatar asset using a selfie‑to‑3D API (trial/free tier), store it, and render it on web/mobile with room to add lip‑sync later.

## Constraints
- Minimize cost (use free trials or local tools)
- Output must be web‑native (GLB/glTF), usable in Three.js on phones and laptops
- Reusable asset: rigged with facial blendshapes (ARKit/visemes preferred)

## Provider options (photoreal, API)
- Avatar SDK Cloud — selfie→3D head, API first, GLB/FBX, blendshapes (ARKit optional)
- in3D — photoreal full‑body from video/selfies, API + SDK, GLB/FBX
- Didimo — photo→3D, high‑quality textures, exports for web engines

Pick the one with: (1) trial credits, (2) GLB export, (3) ARKit or standardized facial blendshapes.

## Milestones
1) Accounts & Keys (0.5 day)
   - Create provider account; get API key and trial credits
   - Create a secure .env for backend

2) Avatar Generation API (1 day)
   - Endpoint: POST /avatar/jobs → proxy to provider (photo upload, options: output=glb, blendshapes=arkit)
   - Polling: GET /avatar/jobs/:id → status (queued | processing | done | error)
   - Download: GET /avatar/assets/:id.glb → fetch and cache to storage

3) Web Viewer (0.5–1 day)
   - Three.js page to load GLB, basic camera/lighting, performance budget
   - Property toggles: show/hide accessories, swap materials/outfit variants
   - Idle realism: blinks, subtle head sway (no lips yet)

4) Lip‑sync Ready (0.5–1 day; optional now)
   - Decide TTS (Piper/Coqui/ElevenLabs trial) and viseme/phoneme mapping
   - Define minimal viseme schema and client mixer (weights only)

5) Safety & Storage (0.5 day)
   - Simple consent screen; age checkbox
   - Store assets in S3‑compatible bucket; signed URLs

6) Packaging & Demo (0.5 day)
   - Minimal onboarding (language, appearance toggles)
   - One‑click demo page that loads the avatar and plays a sample line

## Deliverables
- Backend routes to create/poll/download avatar jobs
- Stored GLB with facial blendshapes
- Web viewer page (mobile‑friendly) rendering the avatar
- Docs: architecture, flows, API/data model

## Success criteria
- Generate an avatar in < 10 minutes (excluding queue)
- Render at 30–60 fps on mid phones; < 150k triangles; textures fit < 20 MB total
- Blendshapes accessible by name; can set jaw/eye/mouth weights programmatically

## Risks & mitigations
- Provider limits/trials: abstract provider behind our API, keep switchable
- Missing blendshapes: fallback to limited mouth shapes or jaw only
- Asset size: add texture compression (KTX2/Basis)
- Legal/licensing: confirm personal/commercial use; store consent with selfie

## Timeline (aggressive)
- Day 1: provider integration + first GLB
- Day 2: web viewer + toggles + idle realism; write docs

## Dual Approach Plan (Client Render + Streaming)

We will support two delivery modes in parallel:

### Track A — Client‑side Rendering (default)
- Scope: Three.js viewer renders GLB on device; lip‑sync later
- Targets: low/mid phones; 30–60 fps
- Milestones:
  1) Optimize asset (≤100k tris, KTX2, Draco/Meshopt)
  2) Viewer with env‑light, no shadows, DPR clamp to 0.75–1.0
  3) Idle realism (blink/head sway); property toggles
  4) Optional viseme mixer (A/E/I/O/U + jawOpen)

### Track B — Streaming (Pixel Streaming, optional premium)
- Scope: Unreal Engine renders MetaHuman; browser receives WebRTC stream
- Targets: high‑end phones/Wi‑Fi/5G; 720p30 baseline
- Milestones:
  1) UE project with MetaHuman; enable Pixel Streaming plugin
  2) Package build; run signaling server; 720p NVENC/VP8
  3) Basic lip‑sync in UE (Oculus LipSync or viseme curves)
  4) Frontend toggle to switch to streaming mode when bandwidth allows

### Release Strategy
- Default to Track A for everyone; detect network and device for Track B opt‑in.
- Keep identical UI across modes; only the rendering source changes.


