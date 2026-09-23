# SagarNetra analysis service

This service provides the first real upload-to-result integration for the
React and Express app. It currently uses a local-contrast baseline to identify candidate
regions in raster sonar imagery. It is deliberately labelled as a baseline:
it is not a trained marine-debris classifier.

## Run locally

```powershell
cd ml-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:ML_API_KEY = "local-dev-key"
uvicorn app.main:app --reload --port 8000
```

In the Express server environment:

```text
ML_API_URL=http://127.0.0.1:8000
ML_API_KEY=local-dev-key
```

Then start the web app with `npm run dev` and open `/analyze`.

## API

- `GET /health` checks service availability.
- `POST /analyze` accepts a multipart field named `file` containing a PNG,
  JPEG, or TIFF image and returns the detection contract consumed by the analysis workspace.

Replace `baseline_detect` in `app/detector.py` with the trained detector after a
labeled dataset and evaluation split are available.
