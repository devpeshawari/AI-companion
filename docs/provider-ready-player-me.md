# Ready Player Me — API Integration Cheat Sheet

Source: Ready Player Me API Quickstart and REST docs — see [docs](https://docs.readyplayer.me/ready-player-me/integration-guides/api-integration/quickstart).

## What RPM gives you
- Full‑body/half‑body avatars, web‑ready (GLB/VRM)
- Public REST API + SDKs
- Morph targets (ARKit, Oculus OVR) for facial animation
- Asset system (hair, outfits, etc.), user accounts (anonymous/linked)

## Minimal flow (server-backed)
1) Create anonymous user → get token
   - POST `https://api.readyplayer.me/v1/users`
   - Body: `{ data: { applicationId: "<your_app_id>" } }`
   - Returns: user `id` and `token` (Bearer)

2) Fetch templates (to pick a base avatar)
   - GET `https://api.readyplayer.me/v2/avatars/templates`
   - Header: `Authorization: Bearer <token>`
   - Returns: list of template IDs with gender/images

3) Create draft avatar from template
   - POST `https://api.readyplayer.me/v2/avatars/templates/<template-id>`
   - Header: `Authorization: Bearer <token>`
   - Body: `{ partner: "<subdomain>", bodyType: "fullbody" }`
   - Returns: draft avatar `id`

4) Fetch draft GLB (preview)
   - GET `https://api.readyplayer.me/v2/avatars/<avatar-id>.glb?preview=true`
   - Returns: GLB stream (draft; not permanent)

5) Save avatar (make permanent)
   - PUT `https://api.readyplayer.me/v2/avatars/<avatar-id>`
   - Header: `Authorization: Bearer <token>`
   - Body: `{ /* optional updated assets */ }`

6) Fetch final GLB
   - GET `https://models.readyplayer.me/<avatar-id>.glb`

## Useful endpoints
- Users: POST `/v1/users` (anonymous) → returns token
- Templates: GET `/v2/avatars/templates`
- Create from template: POST `/v2/avatars/templates/:templateId`
- Draft GLB: GET `/v2/avatars/:avatarId.glb?preview=true`
- Save avatar: PUT `/v2/avatars/:avatarId`
- Final GLB: GET `https://models.readyplayer.me/:avatarId.glb`

## Auth
- Use the token provided when creating the user (Bearer Authorization) for subsequent API calls.
- Your application subdomain/ID is configured in RPM Studio and used in requests.

## Morph targets (facial animation)
- RPM supports ARKit and OVR morph target sets; see docs under Avatars → Morph targets.
- You can map TTS visemes to ARKit shapes for lip‑sync in Three.js.

## Web integration tips
- Load GLB in Three.js via `GLTFLoader`.
- Optimize with KTX2 textures + Draco/Meshopt compression if post‑processing.
- Clamp DPR on mobile; keep draw calls low; disable dynamic shadows.

## Our backend adapter (planned)
- Create RPM user on‑demand → store token with our user/session
- Choose template by persona → create draft avatar
- Save avatar and cache GLB in our storage (optional)
- Expose `/avatar/assets/:id` returning the RPM GLB URL or our cached copy


