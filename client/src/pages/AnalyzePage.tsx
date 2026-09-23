import { useCallback, useRef, useState } from "react";

type AnalysisState = "idle" | "processing" | "success" | "error";

type Detection = {
  id: string;
  label: string;
  confidence: number;
  severity: "high" | "medium" | "low";
  bounding_box?: { x: number; y: number; w: number; h: number };
};

type AnalysisMeta = {
  processing_time_ms?: number;
  coverage_km?: number | null;
};

type MissionView = "mission" | "aero" | "map" | "routes" | "control" | "report";

const PROCESSING_STAGES = [
  "File received",
  "Running fast baseline detector",
  "Preparing review results",
];

export default function AnalyzePage() {
  const [state, setState] = useState<AnalysisState>("idle");
  const [currentStage, setCurrentStage] = useState(0);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);
  const [analysisMeta, setAnalysisMeta] = useState<AnalysisMeta>({});
  const [fileName, setFileName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeView, setActiveView] = useState<MissionView>("mission");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runAnalysis = useCallback(async (file: File) => {
    setFileName(file.name);
    setErrorMessage("");
    setDetections([]);
    setSelectedDetection(null);
    setAnalysisMeta({});
    setImageUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
    setState("processing");
    setCurrentStage(1);

    let timeout: number | undefined;
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      const apiBaseUrl = import.meta.env.VITE_API_URL || "/api";
      const controller = new AbortController();
      timeout = window.setTimeout(() => controller.abort(), 15_000);
      const response = await fetch(`${apiBaseUrl}/analyze`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      window.clearTimeout(timeout);
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error || "Analysis failed. Please try again.");
      }

      const mappedDetections: Detection[] = (payload.detections || []).map((d: {
        id?: string;
        label?: string;
        confidence?: number;
        severity?: "high" | "medium" | "low";
        bounding_box?: { x?: number; y?: number; w?: number; h?: number };
      }, index: number) => ({
        id: d.id || `d${index + 1}`,
        label: d.label || "Unknown anomaly",
        confidence: Math.round((d.confidence || 0) <= 1 ? (d.confidence || 0) * 100 : d.confidence || 0),
        severity: d.severity || "low",
        bounding_box: d.bounding_box && {
          x: d.bounding_box.x || 0,
          y: d.bounding_box.y || 0,
          w: d.bounding_box.w || 0,
          h: d.bounding_box.h || 0,
        },
      }));

      setCurrentStage(PROCESSING_STAGES.length - 1);
      setDetections(mappedDetections);
      setAnalysisMeta({
        processing_time_ms: payload.processing_time_ms,
        coverage_km: payload.coverage_km,
      });
      setState("success");
    } catch (error) {
      if (timeout) window.clearTimeout(timeout);
      setErrorMessage(
        error instanceof DOMException && error.name === "AbortError"
          ? "Analysis timed out after 15 seconds. Please try a smaller image or restart the analysis service."
          : error instanceof Error
          ? error.message
          : "Analysis failed. Please try again.",
      );
      setState("error");
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    const validExtensions = [".tif", ".tiff", ".png", ".jpg", ".jpeg"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!validExtensions.includes(ext)) {
      setErrorMessage("Upload a TIFF, PNG, or JPEG sonar raster.");
      setState("error");
      return;
    }
    if (file.size > 200 * 1024 * 1024) {
      setErrorMessage("File exceeds the 200 MB limit.");
      setState("error");
      return;
    }
    void runAnalysis(file);
  }, [runAnalysis]);

  const reset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setState("idle");
    setCurrentStage(0);
    setDetections([]);
    setSelectedDetection(null);
    setAnalysisMeta({});
    setFileName("");
    setImageUrl(null);
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const stageProgress = state === "processing" ? 66 : state === "success" ? 100 : 0;
  const highestConfidence = detections.length
    ? Math.max(...detections.map((detection) => detection.confidence))
    : 0;

  return (
    <main className="mission-shell" aria-label="SagarNetra mission control">
      <header className="mission-header">
        <a href="/" className="mission-brand" aria-label="SagarNetra AI home">
          <span className="mission-brand-mark" aria-hidden="true">⌁</span>
          <span>
            <strong>SAGARNETRA</strong>
            <small>MARITIME INTELLIGENCE</small>
          </span>
        </a>

        <nav className="mission-nav" aria-label="Mission modes">
          {[
            ["Mission", "mission"],
            ["Aero", "aero"],
            ["Map", "map"],
            ["Routes", "routes"],
            ["Control", "control"],
            ["Report", "report"],
          ].map(([label, view], index) => (
            <button
              key={`${label}-${index}`}
              type="button"
              className={activeView === view ? "active" : ""}
              onClick={() => setActiveView(view as MissionView)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="mission-header-actions" aria-label="System status">
          <span className="mission-live"><i /> SYSTEM LIVE</span>
          <button type="button" aria-label="Toggle display grid">◌</button>
          <button type="button" aria-label="Open mission settings">⋮</button>
        </div>
      </header>

      {activeView === "mission" ? <section className="mission-stage" aria-label="Sonar mission view">
        <div className={`mission-visual ${state === "success" ? "has-image" : ""}`}>
          {imageUrl ? (
            <img src={imageUrl} alt={`${fileName} sonar raster`} className="mission-raster" />
          ) : (
            <div className="mission-ocean-texture" aria-hidden="true" />
          )}
          <div className="mission-grid-overlay" aria-hidden="true" />
          <div className="mission-scan-beam" aria-hidden="true" />
          <span className="mission-crosshair mission-crosshair-one" aria-hidden="true">+</span>
          <span className="mission-crosshair mission-crosshair-two" aria-hidden="true">+</span>

          {state === "success" && detections.map((detection) => {
            const box = detection.bounding_box;
            if (!box) return null;
            const color = detection.severity === "high" ? "#ff6b4a" : detection.severity === "medium" ? "#ffd166" : "#14ffec";
            const selected = selectedDetection?.id === detection.id;
            return (
              <button
                key={detection.id}
                type="button"
                className={`mission-detection-box ${selected ? "selected" : ""}`}
                style={{ left: `${box.x * 100}%`, top: `${box.y * 100}%`, width: `${box.w * 100}%`, height: `${box.h * 100}%`, borderColor: color }}
                onClick={() => setSelectedDetection(selected ? null : detection)}
                aria-label={`${detection.label}, ${detection.confidence}% confidence`}
              >
                <span style={{ backgroundColor: color }}>{detection.confidence}%</span>
              </button>
            );
          })}

          <div className="mission-telemetry mission-telemetry-top">
            <span>MISSION / SAGARNETRA-01</span>
            <span>DEPTH 42.8M</span>
            <span>BEARING 271°</span>
          </div>

          <div className="mission-telemetry mission-telemetry-bottom">
            <span>LAT 18° 55′ 04.2″ N</span>
            <span>LON 72° 49′ 11.8″ E</span>
            <span>RANGE 0.8 KM</span>
          </div>

          {state === "success" && (
            <aside className="mission-alert-card" aria-live="polite">
              <span className="eyebrow">ANOMALY SIGNAL</span>
              <strong>{selectedDetection?.label || "Multiple sonar anomalies"}</strong>
              <div className="mission-alert-icon" aria-hidden="true">⌁</div>
              <div className="mission-alert-meter"><i style={{ width: `${highestConfidence}%` }} /></div>
              <small>{detections.length} candidates · peak confidence {highestConfidence}%</small>
            </aside>
          )}

          {state === "idle" && (
            <div className="mission-empty-state">
              <span className="mission-radar-icon" aria-hidden="true">◎</span>
              <strong>Awaiting sonar raster</strong>
              <span>Load a side-scan image to begin the mission scan.</span>
            </div>
          )}
          {state === "processing" && <div className="mission-processing">FAST BASELINE SCAN / {stageProgress}%</div>}
        </div>

        <div className="mission-console">
          <section className="mission-console-card mission-vessel-card" aria-label="Survey vessel status">
            <div className="mission-card-heading"><span>SURVEY VESSEL</span><b>● ACTIVE</b></div>
            <div className="mission-vessel-illustration" aria-hidden="true">▰</div>
            <strong>SAGARNETRA-01</strong>
            <small>Side-scan platform / coastal survey</small>
            <div className="mission-meter-row"><span>BATTERY</span><b>84%</b></div>
            <div className="mission-meter"><i style={{ width: "84%" }} /></div>
          </section>

          <section className="mission-console-card mission-controls-card" aria-label="Mission controls">
            <div className="mission-console-tabs">
              <span className="active">TRACKING</span>
              <span>PERIMETER</span>
              <span>INSPECTION</span>
              <span>ESCORT</span>
              <span>RELAY</span>
            </div>
            <div className="mission-control-grid">
              <div className="mission-control-tile active"><span>◉</span><small>Auto track</small></div>
              <div className="mission-control-tile"><span>⌖</span><small>Point scan</small></div>
              <div className="mission-control-tile"><span>△</span><small>Swath view</small></div>
              <div className="mission-control-tile"><span>⌁</span><small>Signal lock</small></div>
            </div>
            <div className="mission-stage-list" aria-label="Analysis stages">
              {PROCESSING_STAGES.map((stage, index) => <span key={stage} className={index <= currentStage && state !== "idle" ? "complete" : ""}>{stage}</span>)}
            </div>
          </section>

          <section className="mission-console-card mission-action-card" aria-label="Sonar upload controls">
            <div className="mission-card-heading"><span>ANALYSIS LINK</span><b>{state === "success" ? "COMPLETE" : state === "processing" ? "SCANNING" : "READY"}</b></div>
            <p>{fileName || "No raster selected"}</p>
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              accept=".tif,.tiff,.png,.jpg,.jpeg"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleFile(file);
              }}
              aria-label="Choose sonar raster"
            />
            <button type="button" className="mission-load-button" onClick={() => fileInputRef.current?.click()} disabled={state === "processing"}>
              {state === "processing" ? "SCANNING…" : state === "success" ? "LOAD NEW RASTER" : "LOAD SONAR FILE"}
            </button>
            {state === "success" && <button type="button" className="mission-reset-button" onClick={reset}>RESET MISSION</button>}
            {state === "error" && <p className="mission-error" role="alert">{errorMessage}</p>}
          </section>

          <section className="mission-console-card mission-results-card" aria-label="Detection queue">
            <div className="mission-card-heading"><span>DETECTION QUEUE</span><b>{detections.length.toString().padStart(2, "0")}</b></div>
            {detections.length ? (
              <div className="mission-detection-list">
                {detections.slice(0, 4).map((detection) => (
                  <button
                    type="button"
                    key={detection.id}
                    className={selectedDetection?.id === detection.id ? "selected" : ""}
                    onClick={() => setSelectedDetection(detection)}
                  >
                    <i className={`severity-${detection.severity}`} />
                    <span>{detection.label.replace("Possible ", "")}</span>
                    <b>{detection.confidence}%</b>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mission-muted">No candidates in review queue.</p>
            )}
          </section>
        </div>
      </section> : activeView === "report" ? (
        <section className="mission-report-view" aria-labelledby="report-heading">
          <div className="mission-report-header">
            <div>
              <span className="mission-report-kicker">MISSION REPORT / SGN-01</span>
              <h1 id="report-heading">Sonar analysis report</h1>
              <p>{fileName || "No sonar raster has been analysed yet."}</p>
            </div>
            <div className="mission-report-actions">
              <button type="button" className="mission-report-secondary" onClick={() => setActiveView("mission")}>BACK TO MISSION</button>
              <button type="button" className="mission-report-primary" onClick={() => window.print()}>PRINT REPORT</button>
            </div>
          </div>

          <div className="mission-report-summary">
            <article><span>OBJECTS DETECTED</span><strong>{detections.length}</strong><small>Candidate regions</small></article>
            <article><span>HIGH PRIORITY</span><strong>{detections.filter((detection) => detection.severity === "high").length}</strong><small>Requires review first</small></article>
            <article><span>PEAK CONFIDENCE</span><strong>{highestConfidence}%</strong><small>Best baseline signal</small></article>
            <article><span>PROCESSING TIME</span><strong>{analysisMeta.processing_time_ms ? `${(analysisMeta.processing_time_ms / 1000).toFixed(1)}s` : "—"}</strong><small>Local analysis service</small></article>
          </div>

          <div className="mission-report-grid">
            <section className="mission-report-card mission-report-table-card">
              <div className="mission-report-card-title"><span>DETECTION REGISTER</span><b>{detections.length ? "HUMAN REVIEW REQUIRED" : "WAITING FOR DATA"}</b></div>
              {detections.length ? (
                <div className="mission-report-table-wrap">
                  <table className="mission-report-table">
                    <thead><tr><th>ID</th><th>CLASSIFICATION</th><th>CONFIDENCE</th><th>SEVERITY</th></tr></thead>
                    <tbody>{detections.map((detection) => <tr key={detection.id}>
                      <td>{detection.id}</td>
                      <td>{detection.label}</td>
                      <td>{detection.confidence}%</td>
                      <td><span className={`mission-severity mission-severity-${detection.severity}`}>{detection.severity}</span></td>
                    </tr>)}</tbody>
                  </table>
                </div>
              ) : <p className="mission-report-empty">Load and analyse a sonar raster to generate the detection register.</p>}
            </section>

            <aside className="mission-report-card mission-report-notes">
              <div className="mission-report-card-title"><span>OPERATOR NOTES</span><b>BASELINE</b></div>
              <p>Candidate regions are generated by the local-contrast baseline detector. Confirm targets against the original sonar waterfall before field action.</p>
              <dl>
                <div><dt>MODEL</dt><dd>baseline-local-contrast-v0</dd></div>
                <div><dt>FILE</dt><dd>{fileName || "—"}</dd></div>
                <div><dt>COVERAGE</dt><dd>{analysisMeta.coverage_km ? `${analysisMeta.coverage_km} km` : "Not supplied"}</dd></div>
              </dl>
            </aside>
          </div>
        </section>
      ) : (
        <OperationsView
          view={activeView}
          state={state}
          fileName={fileName}
          detectionCount={detections.length}
          coverage={analysisMeta.coverage_km}
          onMission={() => setActiveView("mission")}
        />
      )}

      <footer className="mission-footer">
        <span>SGN / MARINE INTELLIGENCE SYSTEM</span>
        <span>{state === "success" ? `${detections.length} OBJECTS DETECTED` : "SECURE LOCAL LINK"}</span>
        <span>BASELINE MODEL / HUMAN REVIEW REQUIRED</span>
      </footer>
    </main>
  );
}

function OperationsView({
  view,
  state,
  fileName,
  detectionCount,
  coverage,
  onMission,
}: {
  view: Exclude<MissionView, "mission" | "report">;
  state: AnalysisState;
  fileName: string;
  detectionCount: number;
  coverage?: number | null;
  onMission: () => void;
}) {
  const copy = {
    aero: {
      kicker: "AERO SUPPORT / RECONNAISSANCE",
      title: "Aerial observation",
      description: "Coordinate airborne support around the sonar survey and keep the operator view aligned with the active search area.",
    },
    map: {
      kicker: "MAP / SURVEY OVERVIEW",
      title: "Survey map",
      description: "See the current operating area, sonar coverage, and anomaly clusters in one readable mission map.",
    },
    routes: {
      kicker: "ROUTES / FIELD PLANNING",
      title: "Survey routes",
      description: "Plan the next pass, review the active lane, and send the strongest anomaly coordinates to the field team.",
    },
    control: {
      kicker: "CONTROL / SYSTEM STATUS",
      title: "Mission controls",
      description: "Monitor service health and choose how the local detector should prepare results for human review.",
    },
  }[view];

  return (
    <section className={`mission-ops-view mission-ops-${view}`} aria-labelledby={`${view}-heading`}>
      <div className="mission-ops-header">
        <div>
          <span className="mission-report-kicker">{copy.kicker}</span>
          <h1 id={`${view}-heading`}>{copy.title}</h1>
          <p>{copy.description}</p>
        </div>
        <button type="button" className="mission-report-secondary" onClick={onMission}>BACK TO MISSION</button>
      </div>

      <div className="mission-ops-statusbar">
        <span><i className="status-online" /> LOCAL LINK ONLINE</span>
        <span>ACTIVE FILE: <b>{fileName || "NO RASTER LOADED"}</b></span>
        <span>DETECTIONS: <b>{detectionCount.toString().padStart(2, "0")}</b></span>
      </div>

      {view === "aero" && (
        <div className="mission-ops-grid">
          <section className="mission-ops-card mission-aero-visual">
            <div className="mission-ops-card-title"><span>DRONE OVERWATCH</span><b>UNIT A-02 / ACTIVE</b></div>
            <div className="mission-aero-radar"><span>◎</span><i /><b>SEARCH RADIUS 1.2 KM</b></div>
            <div className="mission-ops-coordinate">18° 55′ 04.2″ N / 72° 49′ 11.8″ E</div>
          </section>
          <section className="mission-ops-card">
            <div className="mission-ops-card-title"><span>AIR ASSET STATUS</span><b>READY</b></div>
            <div className="mission-ops-metric-row"><span>ALTITUDE</span><strong>120 M</strong></div>
            <div className="mission-ops-metric-row"><span>BATTERY</span><strong>78%</strong></div>
            <div className="mission-ops-metric-row"><span>LINK QUALITY</span><strong className="text-good">98%</strong></div>
            <button type="button" className="mission-ops-wide-button">HOLD POSITION</button>
          </section>
          <section className="mission-ops-card">
            <div className="mission-ops-card-title"><span>OVERWATCH FEED</span><b>NO ALERTS</b></div>
            <p className="mission-ops-note">Aerial support is ready to inspect the sonar candidate regions after operator confirmation.</p>
            <div className="mission-ops-check"><i className="status-online" /> Perimeter clear</div>
            <div className="mission-ops-check"><i className="status-online" /> Signal acquired</div>
          </section>
        </div>
      )}

      {view === "map" && (
        <div className="mission-ops-grid mission-map-grid">
          <section className="mission-ops-card mission-map-canvas">
            <div className="mission-ops-card-title"><span>OPERATING AREA</span><b>LIVE POSITION</b></div>
            <div className="mission-map-surface"><span className="map-route-line" /><span className="map-vessel">◆</span><span className="map-target map-target-one">1</span><span className="map-target map-target-two">2</span><span className="map-target map-target-three">3</span></div>
            <div className="mission-ops-coordinate">COASTAL GRID / 0.8 KM SURVEY RANGE</div>
          </section>
          <section className="mission-ops-card">
            <div className="mission-ops-card-title"><span>AREA SUMMARY</span><b>SGN-01</b></div>
            <div className="mission-ops-metric-row"><span>SONAR COVERAGE</span><strong>{coverage ? `${coverage} KM` : "PENDING"}</strong></div>
            <div className="mission-ops-metric-row"><span>ANOMALY CLUSTERS</span><strong>{detectionCount || "—"}</strong></div>
            <div className="mission-ops-metric-row"><span>POSITION FIX</span><strong className="text-good">LOCKED</strong></div>
            <button type="button" className="mission-ops-wide-button">CENTER ON VESSEL</button>
          </section>
        </div>
      )}

      {view === "routes" && (
        <div className="mission-ops-grid">
          <section className="mission-ops-card mission-route-card">
            <div className="mission-ops-card-title"><span>ACTIVE ROUTE</span><b>PASS 03 / 05</b></div>
            {["Harbour entrance / lane 03", "Outer shelf / lane 04", "Anomaly sweep / return"].map((route, index) => (
              <div className={`mission-route-row ${index === 0 ? "active" : ""}`} key={route}><i>{String(index + 1).padStart(2, "0")}</i><span>{route}</span><b>{index === 0 ? "RUNNING" : "QUEUED"}</b></div>
            ))}
          </section>
          <section className="mission-ops-card">
            <div className="mission-ops-card-title"><span>NEXT WAYPOINT</span><b>ETA 04:20</b></div>
            <div className="mission-waypoint"><strong>ANOMALY SWEEP</strong><span>18° 55′ 22.0″ N</span><span>72° 49′ 40.3″ E</span></div>
            <button type="button" className="mission-ops-wide-button">SET AS PRIMARY</button>
          </section>
        </div>
      )}

      {view === "control" && (
        <div className="mission-ops-grid mission-control-grid-view">
          <section className="mission-ops-card">
            <div className="mission-ops-card-title"><span>SERVICE HEALTH</span><b>ALL SYSTEMS NOMINAL</b></div>
            <div className="mission-ops-check"><i className="status-online" /> Express API / connected</div>
            <div className="mission-ops-check"><i className="status-online" /> FastAPI detector / connected</div>
            <div className="mission-ops-check"><i className="status-online" /> Local file pipeline / ready</div>
          </section>
          <section className="mission-ops-card">
            <div className="mission-ops-card-title"><span>DETECTOR PROFILE</span><b>BASELINE V0</b></div>
            <label className="mission-control-option"><span>Human review required</span><input type="checkbox" defaultChecked /></label>
            <label className="mission-control-option"><span>Show confidence overlays</span><input type="checkbox" defaultChecked /></label>
            <label className="mission-control-option"><span>Fast local processing</span><input type="checkbox" defaultChecked /></label>
          </section>
          <section className="mission-ops-card">
            <div className="mission-ops-card-title"><span>SESSION</span><b>{state.toUpperCase()}</b></div>
            <p className="mission-ops-note">The analysis stays on the local Express and FastAPI services. No survey image is sent to an external service by this interface.</p>
          </section>
        </div>
      )}
    </section>
  );
}
