"use client";

import { useState, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Types ──────────────────────────────────────────────────────
type AnalysisState = "idle" | "uploading" | "processing" | "success" | "error";

type Detection = {
  id: string;
  label: string;
  confidence: number;
  severity: "high" | "medium" | "low";
  lat: number;
  lon: number;
  area_m2: number;
};

const DEMO_DETECTIONS: Detection[] = [
  { id: "d1", label: "Derelict fishing net", confidence: 94, severity: "high", lat: 13.0827, lon: 80.2707, area_m2: 14.2 },
  { id: "d2", label: "Metallic debris cluster", confidence: 87, severity: "high", lat: 13.0823, lon: 80.2711, area_m2: 3.8 },
  { id: "d3", label: "Submerged wooden structure", confidence: 71, severity: "medium", lat: 13.0819, lon: 80.2698, area_m2: 28.5 },
  { id: "d4", label: "Sediment disturbance", confidence: 58, severity: "low", lat: 13.0831, lon: 80.2703, area_m2: 42.1 },
];

const PROCESSING_STAGES = [
  { label: "Validating file format", duration: 600 },
  { label: "Applying slant-range correction", duration: 900 },
  { label: "Beam-pattern compensation", duration: 700 },
  { label: "Bottom-tracking & normalisation", duration: 800 },
  { label: "Running CNN inference", duration: 1400 },
  { label: "Classifying detections", duration: 600 },
  { label: "Generating geo-referenced output", duration: 500 },
];

export default function DemoPage() {
  const [state, setState] = useState<AnalysisState>("idle");
  const [currentStage, setCurrentStage] = useState(0);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressRef = useRef<NodeJS.Timeout[]>([]);

  const runDemoAnalysis = useCallback((file: File) => {
    setFileName(file.name);
    setErrorMessage("");
    setDetections([]);
    setSelectedDetection(null);
    setState("uploading");

    // Simulate upload
    const uploadTimer = setTimeout(() => {
      setState("processing");
      setCurrentStage(0);

      // Run through processing stages sequentially
      let cumulativeDelay = 0;
      PROCESSING_STAGES.forEach((_, index) => {
        const stageDelay = PROCESSING_STAGES.slice(0, index).reduce(
          (sum, s) => sum + s.duration, 0
        );
        const t = setTimeout(() => {
          setCurrentStage(index);
        }, stageDelay);
        progressRef.current.push(t);
      });

      const totalDuration = PROCESSING_STAGES.reduce((s, p) => s + p.duration, 0);
      const doneTimer = setTimeout(() => {
        setDetections(DEMO_DETECTIONS);
        setState("success");
      }, totalDuration + 200);
      progressRef.current.push(doneTimer);

    }, 1200);

    progressRef.current.push(uploadTimer);
  }, []);

  const handleFile = useCallback((file: File) => {
    // Validate file type
    const validExtensions = [".xtf", ".jsf", ".tif", ".tiff", ".png", ".jpg", ".jpeg"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!validExtensions.includes(ext)) {
      setErrorMessage(`Unsupported file type. Accepted: XTF, JSF, TIFF, or image files.`);
      setState("error");
      return;
    }
    // Validate file size (max 200MB)
    if (file.size > 200 * 1024 * 1024) {
      setErrorMessage("File exceeds 200 MB limit.");
      setState("error");
      return;
    }
    runDemoAnalysis(file);
  }, [runDemoAnalysis]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleReset = () => {
    progressRef.current.forEach(clearTimeout);
    progressRef.current = [];
    setState("idle");
    setCurrentStage(0);
    setDetections([]);
    setSelectedDetection(null);
    setFileName("");
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const stageProgress = state === "processing"
    ? Math.round(((currentStage + 1) / PROCESSING_STAGES.length) * 100)
    : state === "success" ? 100 : 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16" aria-label="Live demo page">
        <div className="container-main">
          {/* Page header */}
          <div className="py-10 border-b border-[rgba(14,255,236,0.08)] mb-10">
            <p className="text-[#5E849E] text-label uppercase mb-2">Interactive Demo</p>
            <h1 className="text-h1 text-[#E8F4F8] mb-3">
              Sonar anomaly detection
            </h1>
            <p className="text-[#A8C8D8] max-w-2xl">
              Upload a side-scan sonar file (XTF, JSF, TIFF) or any image to
              run a demo analysis. Processing uses simulated data to demonstrate
              the detection pipeline without requiring a live ML backend.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left: Upload + Progress */}
            <div className="lg:col-span-2 space-y-6">

              {/* Upload zone */}
              {(state === "idle" || state === "error") && (
                <div>
                  <label htmlFor="sonar-file" className="block text-sm font-medium text-[#A8C8D8] mb-3">
                    Upload sonar file
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                      dragOver
                        ? "border-[#14FFEC] bg-[rgba(14,255,236,0.06)]"
                        : "border-[rgba(14,255,236,0.2)] hover:border-[rgba(14,255,236,0.4)] bg-[#0A1628]"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload sonar file — click or drag and drop"
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
                  >
                    <input
                      ref={fileInputRef}
                      id="sonar-file"
                      type="file"
                      className="sr-only"
                      accept=".xtf,.jsf,.tif,.tiff,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                      }}
                      aria-describedby="file-hint"
                    />
                    <div className="w-12 h-12 rounded-full bg-[rgba(13,115,119,0.15)] border border-[rgba(14,255,236,0.15)] flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <p className="text-[#E8F4F8] font-medium mb-1">
                      Drop your sonar file here
                    </p>
                    <p id="file-hint" className="text-[#5E849E] text-sm">
                      XTF · JSF · TIFF · PNG · JPEG — max 200 MB
                    </p>
                  </div>

                  {state === "error" && (
                    <div
                      role="alert"
                      className="mt-3 p-3 rounded-lg bg-[rgba(224,82,82,0.1)] border border-[rgba(224,82,82,0.25)] text-sm text-[#E05252]"
                    >
                      {errorMessage}
                    </div>
                  )}
                </div>
              )}

              {/* Processing card */}
              {(state === "uploading" || state === "processing") && (
                <div
                  className="surface-card p-6"
                  aria-label="Analysis in progress"
                  aria-live="polite"
                  aria-atomic="false"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full border-2 border-[#14FFEC] border-t-transparent animate-spin" aria-hidden="true" />
                    <div>
                      <p className="text-[#E8F4F8] font-medium">
                        {state === "uploading" ? "Uploading…" : "Analysing…"}
                      </p>
                      <p className="text-[#5E849E] text-xs font-mono">{fileName}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-5">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-[#5E849E]">Progress</span>
                      <span className="text-xs font-mono text-[#14FFEC]">{stageProgress}%</span>
                    </div>
                    <div className="h-1.5 bg-[#0E1F38] rounded-full overflow-hidden" role="progressbar" aria-valuenow={stageProgress} aria-valuemin={0} aria-valuemax={100}>
                      <div
                        className="h-full bg-[#0AAFA3] rounded-full transition-all duration-500"
                        style={{ width: `${stageProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stage list */}
                  <ol className="space-y-2" aria-label="Processing stages">
                    {PROCESSING_STAGES.map((stage, i) => (
                      <li
                        key={stage.label}
                        className={`flex items-center gap-2.5 text-xs ${
                          i < currentStage
                            ? "text-[#2ECC71]"
                            : i === currentStage && state === "processing"
                            ? "text-[#E8F4F8]"
                            : "text-[#3A5A6E]"
                        }`}
                        aria-current={i === currentStage && state === "processing" ? "step" : undefined}
                      >
                        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center" aria-hidden="true">
                          {i < currentStage ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : i === currentStage && state === "processing" ? (
                            <div className="w-2 h-2 rounded-full bg-[#14FFEC] animate-pulse" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1A2A3A]" />
                          )}
                        </span>
                        {stage.label}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Success summary */}
              {state === "success" && (
                <div className="surface-card p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-full bg-[rgba(46,204,113,0.15)] flex items-center justify-center" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2ECC71" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#E8F4F8] font-medium">Analysis complete</p>
                      <p className="text-[#5E849E] text-xs font-mono">{fileName}</p>
                    </div>
                  </div>

                  <dl className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { label: "Objects detected", value: detections.length.toString() },
                      { label: "High severity", value: detections.filter(d => d.severity === "high").length.toString() },
                      { label: "Survey coverage", value: "1.4 km" },
                      { label: "Processing time", value: "2:51" },
                    ].map((s) => (
                      <div key={s.label} className="bg-[#060E1A] rounded-lg p-3">
                        <dt className="text-[#5E849E] text-xs mb-1">{s.label}</dt>
                        <dd className="text-[#14FFEC] font-bold font-mono text-lg">{s.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="flex gap-2">
                    <button className="btn-secondary flex-1 text-sm py-2 justify-center">
                      Export GeoJSON
                    </button>
                    <button
                      onClick={handleReset}
                      className="btn-ghost flex-1 text-sm py-2 justify-center"
                    >
                      New scan
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Sonar view + detections */}
            <div className="lg:col-span-3 space-y-6">

              {/* Sonar waterfall display */}
              <div
                className="surface-card overflow-hidden"
                aria-label="Sonar waterfall display"
              >
                <div className="flex items-center justify-between p-4 border-b border-[rgba(14,255,236,0.06)]">
                  <p className="text-sm font-medium text-[#E8F4F8]">Waterfall view</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#5E849E] font-mono">Port of Chennai — B3</span>
                    {state === "processing" && (
                      <span className="badge badge-warning animate-pulse" aria-live="polite">Scanning</span>
                    )}
                    {state === "success" && (
                      <span className="badge badge-success">Complete</span>
                    )}
                  </div>
                </div>

                {/* Waterfall canvas */}
                <div
                  className="relative bg-[#020810] h-64"
                  role="img"
                  aria-label={
                    state === "success"
                      ? `Sonar waterfall showing ${detections.length} detected objects`
                      : "Sonar waterfall display"
                  }
                >
                  {/* Simulated sonar lines */}
                  <div className="absolute inset-0 flex flex-col" aria-hidden="true">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1"
                        style={{
                          background: `linear-gradient(90deg,
                            rgba(6,14,26,1) 0%,
                            rgba(13,115,119,${0.05 + Math.abs(Math.sin(i * 0.4 + 0.5)) * 0.12}) 15%,
                            rgba(10,175,163,${0.08 + Math.abs(Math.sin(i * 0.6 + 1)) * 0.18}) ${40 + Math.sin(i * 0.3) * 8}%,
                            rgba(13,115,119,${0.04 + Math.abs(Math.sin(i * 0.5)) * 0.1}) 80%,
                            rgba(6,14,26,1) 100%
                          )`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Detection boxes — only shown after success */}
                  {state === "success" && (
                    <>
                      {detections.map((d, i) => {
                        const positions = [
                          { top: "18%", left: "38%", w: "22%", h: "24%" },
                          { top: "52%", left: "22%", w: "14%", h: "18%" },
                          { top: "30%", left: "62%", w: "18%", h: "28%" },
                          { top: "68%", left: "48%", w: "26%", h: "20%" },
                        ];
                        const pos = positions[i];
                        const color = d.severity === "high" ? "#E05252" : d.severity === "medium" ? "#D4A017" : "#2ECC71";
                        const isSelected = selectedDetection?.id === d.id;
                        return (
                          <button
                            key={d.id}
                            className="absolute border-2 rounded cursor-pointer transition-all"
                            style={{
                              top: pos.top, left: pos.left,
                              width: pos.w, height: pos.h,
                              borderColor: color,
                              backgroundColor: isSelected ? `${color}20` : "transparent",
                              boxShadow: isSelected ? `0 0 12px ${color}40` : "none",
                            }}
                            onClick={() => setSelectedDetection(isSelected ? null : d)}
                            aria-label={`Detection: ${d.label} — ${d.confidence}% confidence`}
                            aria-pressed={isSelected}
                          >
                            <span
                              className="absolute -top-5 left-0 text-[9px] font-mono text-white px-1 py-px rounded leading-none"
                              style={{ backgroundColor: color }}
                              aria-hidden="true"
                            >
                              {d.severity.toUpperCase()}
                            </span>
                          </button>
                        );
                      })}
                    </>
                  )}

                  {/* Empty state */}
                  {state === "idle" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-[#3A5A6E] text-sm font-mono">
                        Upload a file to begin analysis
                      </p>
                    </div>
                  )}

                  {/* Scanning animation */}
                  {state === "processing" && (
                    <div
                      className="absolute inset-y-0 w-0.5 bg-[#14FFEC] opacity-70"
                      style={{ left: `${stageProgress}%`, transition: "left 0.5s ease" }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>

              {/* Detection list */}
              {state === "success" && detections.length > 0 && (
                <div className="surface-card p-5">
                  <h2 className="text-[#E8F4F8] font-semibold mb-4">
                    Detected objects
                    <span className="ml-2 text-xs text-[#5E849E] font-normal font-mono">
                      ({detections.length} total)
                    </span>
                  </h2>
                  <div className="space-y-2" role="list" aria-label="Detection results">
                    {detections.map((d) => {
                      const isSelected = selectedDetection?.id === d.id;
                      return (
                        <button
                          key={d.id}
                          role="listitem"
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                            isSelected
                              ? "border-[rgba(14,255,236,0.3)] bg-[rgba(14,255,236,0.05)]"
                              : "border-[rgba(14,255,236,0.06)] hover:border-[rgba(14,255,236,0.15)] bg-[#060E1A]"
                          }`}
                          onClick={() => setSelectedDetection(isSelected ? null : d)}
                          aria-pressed={isSelected}
                          aria-label={`${d.label}, ${d.severity} severity, ${d.confidence}% confidence`}
                        >
                          <div
                            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                              d.severity === "high"
                                ? "bg-[#E05252]"
                                : d.severity === "medium"
                                ? "bg-[#D4A017]"
                                : "bg-[#2ECC71]"
                            }`}
                            aria-hidden="true"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[#E8F4F8] text-sm font-medium truncate">
                              {d.label}
                            </p>
                            {isSelected && (
                              <p className="text-[#5E849E] text-xs font-mono mt-0.5">
                                {d.lat.toFixed(4)}°N, {d.lon.toFixed(4)}°E · {d.area_m2} m²
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div
                              className="w-12 h-1 bg-[#0E1F38] rounded-full overflow-hidden"
                              role="img"
                              aria-hidden="true"
                            >
                              <div
                                className="h-full bg-[#0AAFA3] rounded-full"
                                style={{ width: `${d.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs font-mono text-[#5E849E] w-8 text-right">
                              {d.confidence}%
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {state === "idle" && (
                <div className="surface-card p-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-[rgba(13,115,119,0.12)] border border-[rgba(14,255,236,0.1)] flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5E849E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                  </div>
                  <p className="text-[#A8C8D8] font-medium mb-1">No analysis yet</p>
                  <p className="text-[#5E849E] text-sm">
                    Upload a sonar file to detect marine debris and anomalies.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
