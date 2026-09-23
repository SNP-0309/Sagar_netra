# SagarNetra AI

SagarNetra AI analyzes side-scan sonar imagery and surfaces candidate marine
debris and anomaly regions for operator review.

## Structure

```text
client/       React + Vite interface
server/       Express API gateway
ml-service/   Python FastAPI analysis service
data/         Synthetic upload fixtures
docs/         Architecture notes
```

## Run locally

Install dependencies:

```powershell
npm install
```

Start the Python analysis service:

```powershell
cd ml-service
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Start the Express API in a second terminal:

```powershell
npm run dev:server
```

Start the React client in a third terminal:

```powershell
npm run dev:client
```

Open `http://localhost:5173/analyze` and upload an image from
`data/test-images/`.

## Validate

```powershell
npm run build
npm run test:ml
```

The current Python detector is a local-contrast baseline. Replace
`ml-service/app/detector.py` with the trained model after labeled sonar data is
available, keeping the response contract unchanged.
