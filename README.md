# Neural Compression Ops Console

Mission-grade neural image compression console inspired by Mars rover downlink workflows. It pairs a FastAPI backend (autoencoder compression + metrics) with a React + Vite frontend dashboard for telemetry, analysis, and reconstruction QA.

## Highlights
- Autoencoder-based image compression with artifact export (latents, scales, shape).
- Metrics: PSNR, SSIM, BPP, compression ratio.
- Ops console UI with Pareto frontier, anomaly detection, and mission timeline.
- Reconstruction compare view with slider overlay.
- Batch upload queue and history log.

## Repo Structure
- `backend/` FastAPI API + compression pipeline
- `frontend/` React + Vite dashboard
- `model.pth` Pretrained weights
- `results_api/` API output artifacts (local)

## Quick Start

### Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r ../requirements.txt
uvicorn api:app --reload --port 8000
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

Then open the UI at `http://localhost:5173` and point the API base to `http://localhost:8000` in Settings if needed.

## API Endpoints
- `POST /compress` — multipart form with `file` (image) and `level` (2–256)
- `GET /history` — list of previous runs
- `GET /result/{id}` — reconstructed PNG
- `GET /artifact/{id}/{kind}` — `original`, `latents`, `scales`, `shape`
- `DELETE /result/{id}` — delete stored results

## Notes
- SSIM is computed if `scikit-image` is installed; otherwise it returns `null`.
- Model weights are fixed at runtime; training is not part of the UI workflow.
- Results are stored under `results_api/` per run.

## Screens
The UI includes dashboards for:
- System telemetry and recent runs
- Rate–distortion plots with Pareto frontier
- Anomaly detection for high-compression/low-PSNR outliers
- Mission timeline (capture → encode → downlink → decode)

## License
Not specified.

## Contact
Om Srivastava  
srivastavaom078@gmail.com
