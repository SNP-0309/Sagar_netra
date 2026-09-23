export type BoundingBox = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type AnalysisDetection = {
  id: string;
  label: string;
  confidence: number;
  severity: "high" | "medium" | "low";
  geo: { lat: number; lon: number } | null;
  area_m2: number | null;
  bounding_box: BoundingBox;
};

export type AnalysisResponse = {
  survey_id: string;
  status: "complete";
  model: string;
  detections: AnalysisDetection[];
  processing_time_ms: number;
  coverage_km: number | null;
  swath_width_m: number | null;
  image_width: number;
  image_height: number;
  notice?: string;
};
