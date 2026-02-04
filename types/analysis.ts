export interface StructuralFinding {
  component: string;
  status: "intact" | "damaged" | "critical" | "unknown";
  evidence: string;
  risk_level?: "low" | "medium" | "high" | "critical";
}

export interface FloodIndicator {
  water_line_visible: boolean;
  estimated_depth_meters: number | null;
  debris_level: "none" | "light" | "moderate" | "heavy";
  mud_staining: boolean;
}

export interface Hazard {
  type: string;
  risk: "low" | "medium" | "high" | "critical";
  evidence: string;
}

export interface RepairEstimate {
  material: string;
  estimated_quantity: string;
  notes?: string;
}

export interface AnalysisResult {
  severity: "low" | "medium" | "critical";
  summary: string;
  structural_findings: StructuralFinding[];
  flood_indicators: FloodIndicator;
  hazards: Hazard[];
  repair_estimates: RepairEstimate[];
  confidence_score: number;
  disclaimer: string;
}

export interface ReportData {
  id: string;
  imageUrl: string;
  analysis: AnalysisResult;
  timestamp: string;
}

