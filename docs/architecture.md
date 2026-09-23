# SagarNetra structure

```text
SIH-PS2/
├── client/                    # React + Vite interface
│   └── src/
│       ├── components/        # Navbar, footer, consent UI
│       ├── pages/             # Home, analyze, legal, 404
│       └── styles/            # Shared design system
├── server/                    # Express API gateway
│   └── src/routes/analyze.ts  # Upload validation and ML proxy
├── ml-service/                # Python FastAPI analysis service
│   ├── app/main.py            # HTTP entrypoint
│   ├── app/detector.py        # Baseline detector
│   └── tests/                 # Detector tests
├── data/test-images/          # Synthetic upload fixtures
└── docs/                      # Architecture notes
```

The browser talks only to Express. Express validates and rate-limits uploads,
then forwards them to the Python service. This keeps frontend, HTTP gateway,
and model code independently replaceable.
