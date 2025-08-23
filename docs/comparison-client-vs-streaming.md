# Client Rendering vs Streaming (Pixel Streaming)

## Summary
- Client render: cheapest, scalable, works on low-end phones with tuned assets; visual fidelity limited by device.
- Streaming: best realism and consistency; requires good bandwidth and GPU server; added latency and cost.

## Detailed comparison

| Aspect | Client Render (Three.js) | Streaming (Unreal Pixel Streaming) |
|---|---|---|
| Visual fidelity | Medium→High with good PBR; below MetaHuman | Very high (MetaHuman shaders, hair, SSS) |
| Latency | Very low (local render) | Higher (encode+network+decode) 150–300 ms |
| Bandwidth | ~0.05–0.1 Mbps (audio + JSON) | 1.5–5 Mbps (720p–1080p) |
| Device requirements | WebGL2 capable; tuned GLB; 2–3 GB RAM phones OK | Any modern phone (video decode) |
| Battery | Moderate GPU use while active | Network/video decode heavy |
| Cost per minute | ≈ $0 (no GPU server) | GPU + egress; ~$0.01–$0.05/min stream |
| Scalability | Excellent; static assets cached | Bounded by GPU instances |
| Lip‑sync | Viseme morphs (simple) | High-quality viseme/curve driving |
| Implementation speed | Fast; simple web stack | Medium; UE build + infra |
| Offline fallback | Possible (cached assets, text) | No (requires connection) |

## When to choose which
- Start with Client Render for default experience and low-end devices.
- Offer Streaming as an opt-in “High Fidelity Mode” on Wi‑Fi/5G and newer phones.

## Optimization targets (Client Render)
- GLB ≤ 10–15 MB; ≤ 100k triangles; draw calls < 50
- KTX2 texture compression; Draco/Meshopt geometry compression
- Morph targets: core set (jawOpen, A/E/I/O/U, MBP, FV)
- No dynamic shadows on low-end; PMREM env lighting
- Clamp DPR to 0.75–1.0; cap FPS 30–45 if hot

## Network & cost (Streaming)
- 720p30 H.264 ≈ 1.5–2.5 Mbps (≈ 11–19 MB/min)
- 1080p30 ≈ 3–5 Mbps (≈ 22–37 MB/min)
- g4dn.xlarge (T4) ≈ $0.5–$1/hr → ~$0.01–$0.02/min/user at 1:1


