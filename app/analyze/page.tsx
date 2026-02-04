"use client";

import { useState, useRef } from "react";
import {
  Upload,
  X,
  AlertCircle,
  Shield,
  Home,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "../theme-provider";
import {
  AnalysisResult,
  StructuralFinding,
  Hazard,
  RepairEstimate,
} from "@/types/analysis";

// Color mapping constants
const RISK_COLORS = {
  low: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-900",
    icon: "text-emerald-600",
    badge: "bg-emerald-100",
    badgeText: "text-emerald-800",
  },
  medium: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-900",
    icon: "text-yellow-600",
    badge: "bg-yellow-100",
    badgeText: "text-yellow-800",
  },
  high: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-900",
    icon: "text-orange-600",
    badge: "bg-orange-100",
    badgeText: "text-orange-800",
  },
  critical: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-900",
    icon: "text-red-600",
    badge: "bg-red-100",
    badgeText: "text-red-800",
  },
};

// Cost estimation mapping
const MATERIAL_COSTS: Record<string, number> = {
  cement: 12, // per bag
  bricks: 2.5, // per unit
  "steel rods": 25, // per piece
  "wood planks": 18, // per piece
  labor: 120, // per hour
  sand: 18, // per bag
  gravel: 14, // per bag
  paint: 60, // per liter
  plumbing: 350, // per item
  electrical: 300, // per item
  drywall: 40, // per sheet
  flooring: 25, // per sq ft
  "garage door": 1200, // per unit
};

function estimateCost(material: string, quantity: string): number {
  const materialLower = material.toLowerCase();
  const costPerUnit =
    Object.entries(MATERIAL_COSTS).find(([key]) =>
      materialLower.includes(key),
    )?.[1] ?? 250; // default cost

  // Extract number from quantity string (e.g., "40 bags" -> 40)
  const match = quantity.match(/\d+(\.\d+)?/);
  const qty = match ? parseFloat(match[0]) : 1;

  return Math.round(qty * costPerUnit);
}

export default function AnalyzePage() {
  const { theme, toggleTheme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [analyzedImageUrl, setAnalyzedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, etc.)");
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setAnalysisResult(null); // Clear previous results

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsUploading(true);
    setIsAnalyzing(true);
    setError(null);
    setProgress("Uploading image...");
    setAnalysisResult(null);

    try {
      // Step 1: Upload image
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const { imageUrl } = await uploadResponse.json();
      setAnalyzedImageUrl(imageUrl);
      setIsUploading(false);
      setProgress("Analyzing damage with AI...");

      // Step 2: Analyze with Gemini
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const { analysis } = await analyzeResponse.json();
      setProgress("Complete!");

      // Display results directly
      setAnalysisResult(analysis);
      setIsAnalyzing(false);

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsUploading(false);
      setIsAnalyzing(false);
      setProgress("");
    }
  };

  const handleNewAnalysis = () => {
    setFile(null);
    setPreview(null);
    setAnalysisResult(null);
    setAnalyzedImageUrl(null);
    setError(null);
    setProgress("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 light:bg-gradient-to-br light:from-slate-50 light:to-slate-100">
      {/* Header */}
      <header className="border-b dark:border-slate-700 light:border-slate-200 dark:bg-slate-800/80 light:bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-3 hover:opacity-80 transition"
            >
              <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold dark:text-white light:text-slate-900">
                FloodScout
              </h1>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="group relative inline-flex items-center gap-1 rounded-full border border-slate-600/40 bg-slate-800/70 p-1 shadow-inner hover:border-emerald-400/60 transition dark:bg-slate-800/70 light:bg-white/80"
                aria-label="Toggle theme"
              >
                <span
                  className={`absolute top-1 bottom-1 w-7 rounded-full bg-emerald-400/90 transition-transform ${
                    theme === "dark" ? "translate-x-8" : "translate-x-0"
                  }`}
                />
                <span className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full text-slate-900">
                  <Sun className="h-4 w-4" />
                </span>
                <span className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full text-slate-200">
                  <Moon className="h-4 w-4" />
                </span>
              </button>
              {analysisResult && (
                <button
                  onClick={() => window.print()}
                  className="hidden sm:flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!analysisResult ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold dark:text-white light:text-slate-900 mb-2">
                Analyze Flood Damage
              </h2>
              <p className="dark:text-slate-300 light:text-slate-700">
                Upload a clear photo of the flood-damaged building for instant
                AI analysis
              </p>
            </div>

            {/* Upload Area */}
            <div className="max-w-4xl mx-auto">
              <div className="dark:bg-slate-800/50 light:bg-white/80 dark:border-slate-700 light:border-slate-200 rounded-xl backdrop-blur-sm shadow-lg p-8 mb-6">
                {!preview ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-3 border-dashed dark:border-slate-600 light:border-slate-300 rounded-xl p-12 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-500/5 transition-all"
                  >
                    <Upload className="h-16 w-16 dark:text-slate-500 light:text-slate-400 mx-auto mb-4" />
                    <p className="text-lg font-semibold dark:text-white light:text-slate-900 mb-2">
                      Drop your image here, or click to browse
                    </p>
                    <p className="text-sm dark:text-slate-400 light:text-slate-600">
                      Supports: JPG, PNG, WebP (Max 10MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileSelect(e.target.files[0])
                      }
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => {
                        setFile(null);
                        setPreview(null);
                        setError(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition z-10"
                      disabled={isAnalyzing}
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-auto rounded-lg max-h-[500px] object-contain"
                    />
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-red-800 font-semibold">Error</p>
                      <p className="text-red-700 text-sm">{error}</p>
                      <button
                        onClick={() => {
                          setError(null);
                          setFile(null);
                          setPreview(null);
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}

                {/* Progress */}
                {isAnalyzing && (
                  <div className="mt-4 bg-emerald-900/20 border border-emerald-700/50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-400 mr-3"></div>
                      <p className="text-emerald-200 font-semibold">
                        {progress}
                      </p>
                    </div>
                    <div className="mt-3 bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: isUploading ? "40%" : "80%",
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Analyze Button */}
                {file && !isAnalyzing && (
                  <button
                    onClick={handleAnalyze}
                    className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-emerald-500/50"
                  >
                    Analyze Damage
                  </button>
                )}
              </div>

              {/* Guidelines */}
              <div className="dark:bg-slate-800/50 light:bg-white/80 dark:border-slate-700 light:border-slate-200 rounded-xl backdrop-blur-sm shadow-md p-6">
                <h3 className="font-semibold dark:text-white light:text-slate-900 mb-3">
                  For Best Results:
                </h3>
                <ul className="space-y-2 text-sm dark:text-slate-300 light:text-slate-700">
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span>
                      Use clear, well-lit photos showing the entire structure
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span>
                      Capture visible damage including cracks, water lines, and
                      debris
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span>Avoid blurry or heavily filtered images</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-500 mr-2">•</span>
                    <span>
                      Include context like surrounding terrain if possible
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div ref={resultsRef}>
            {/* Title */}
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold text-white mb-2">
                Flood Damage Assessment Report
              </h2>
              <p className="text-slate-400">
                Generated on {new Date().toLocaleString()}
              </p>
              <button
                onClick={handleNewAnalysis}
                className="mt-4 inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition"
              >
                <Upload className="mr-2 h-5 w-5" />
                Analyze New Image
              </button>
            </div>

            {/* Severity Overview */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl backdrop-blur-sm shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Severity Assessment
                  </h3>
                  <SeverityBadge severity={analysisResult.severity} />
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400 mb-1">
                    Confidence Score
                  </p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {Math.round(analysisResult.confidence_score * 100)}%
                  </p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {analysisResult.summary}
              </p>
            </div>

            <div className="space-y-6 mb-6">
              {/* Image */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl backdrop-blur-sm shadow-lg p-4">
                <h3 className="font-semibold text-white mb-3">
                  Analyzed Image
                </h3>
                <img
                  src={analyzedImageUrl || preview || ""}
                  alt="Flood damage"
                  className="w-full h-auto rounded-lg border border-slate-700"
                />
              </div>

              {/* Main Content */}
              <div className="space-y-6">
                {/* Structural Findings */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl backdrop-blur-sm shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Home className="mr-2 h-5 w-5 text-emerald-400" />
                    Structural Findings
                  </h3>
                  <div className="space-y-3">
                    {analysisResult.structural_findings.map(
                      (finding, index) => (
                        <StructuralCard key={index} finding={finding} />
                      ),
                    )}
                  </div>
                </div>

                {/* Flood Indicators */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl backdrop-blur-sm shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Flood Indicators
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <IndicatorItem
                      label="Water Line Visible"
                      value={
                        analysisResult.flood_indicators.water_line_visible
                          ? "Yes"
                          : "No"
                      }
                      highlight={
                        analysisResult.flood_indicators.water_line_visible
                      }
                    />
                    <IndicatorItem
                      label="Estimated Depth"
                      value={
                        analysisResult.flood_indicators.estimated_depth_meters
                          ? `${analysisResult.flood_indicators.estimated_depth_meters}m`
                          : "Unknown"
                      }
                      highlight={
                        !!analysisResult.flood_indicators.estimated_depth_meters
                      }
                    />
                    <IndicatorItem
                      label="Debris Level"
                      value={analysisResult.flood_indicators.debris_level}
                      highlight={
                        analysisResult.flood_indicators.debris_level !== "none"
                      }
                    />
                    <IndicatorItem
                      label="Mud Staining"
                      value={
                        analysisResult.flood_indicators.mud_staining
                          ? "Present"
                          : "Absent"
                      }
                      highlight={analysisResult.flood_indicators.mud_staining}
                    />
                  </div>
                </div>

                {/* Hazards */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl backdrop-blur-sm shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-orange-400" />
                    Identified Hazards
                  </h3>
                  <div className="space-y-3">
                    {analysisResult.hazards
                      .sort((a, b) => {
                        const riskOrder = {
                          critical: 4,
                          high: 3,
                          medium: 2,
                          low: 1,
                        };
                        return riskOrder[b.risk] - riskOrder[a.risk];
                      })
                      .map((hazard, index) => (
                        <HazardCard key={index} hazard={hazard} />
                      ))}
                  </div>
                </div>

                {/* Repair Estimates */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl backdrop-blur-sm shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Repair Cost Estimates
                  </h3>
                  <p className="text-sm text-slate-400 mb-4 italic">
                    Evidence-based heuristic estimates for repair materials
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 font-semibold text-white">
                            Material
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-white">
                            Estimated Quantity
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-white">
                            Estimated Cost
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-white">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisResult.repair_estimates.map(
                          (estimate, index) => (
                            <RepairRow key={index} estimate={estimate} />
                          ),
                        )}
                        <tr className="border-t-2 border-emerald-500/50 bg-slate-800/50">
                          <td
                            colSpan={2}
                            className="py-4 px-4 font-semibold text-white text-right"
                          >
                            Total Estimated Cost:
                          </td>
                          <td className="py-4 px-4 font-bold text-emerald-400 text-lg">
                            $
                            {analysisResult.repair_estimates
                              .reduce((sum, estimate) => {
                                return (
                                  sum +
                                  estimateCost(
                                    estimate.material,
                                    estimate.estimated_quantity,
                                  )
                                );
                              }, 0)
                              .toLocaleString()}
                          </td>
                          <td className="py-4 px-4"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-orange-900/20 border-2 border-orange-700/50 rounded-xl p-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-6 w-6 text-orange-400 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-200 mb-2">
                        Important Disclaimer
                      </h4>
                      <p className="text-orange-100 text-sm leading-relaxed">
                        {analysisResult.disclaimer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Component functions from report page
function SeverityBadge({ severity }: { severity: string }) {
  const styles = {
    low: "bg-emerald-100 text-emerald-800 border-emerald-300",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    critical: "bg-red-100 text-red-800 border-red-300",
  };

  const icons = {
    low: <CheckCircle className="h-5 w-5" />,
    medium: <AlertCircle className="h-5 w-5" />,
    critical: <XCircle className="h-5 w-5" />,
  };

  return (
    <div
      className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold text-lg border-2 ${
        styles[severity as keyof typeof styles]
      }`}
    >
      {icons[severity as keyof typeof icons]}
      <span className="ml-2 uppercase">{severity}</span>
    </div>
  );
}

function StructuralCard({ finding }: { finding: StructuralFinding }) {
  const statusStyles = {
    intact: "bg-emerald-50 border-emerald-200 text-emerald-900",
    damaged: "bg-yellow-50 border-yellow-200 text-yellow-900",
    critical: "bg-red-50 border-red-200 text-red-900",
    unknown: "bg-slate-700 border-slate-600 text-slate-100",
  };

  const statusIcons = {
    intact: <CheckCircle className="h-5 w-5 text-emerald-600" />,
    damaged: <AlertCircle className="h-5 w-5 text-yellow-600" />,
    critical: <XCircle className="h-5 w-5 text-red-600" />,
    unknown: <AlertTriangle className="h-5 w-5 text-slate-400" />,
  };

  // Use risk_level colors if available, otherwise fall back to status colors
  const cardColors = finding.risk_level
    ? RISK_COLORS[finding.risk_level as keyof typeof RISK_COLORS]
    : null;

  const cardClassName = cardColors
    ? `border-2 rounded-lg p-4 ${cardColors.bg} ${cardColors.border}`
    : `border-2 rounded-lg p-4 ${statusStyles[finding.status as keyof typeof statusStyles]}`;

  const textClassName = cardColors
    ? cardColors.text
    : statusStyles[finding.status as keyof typeof statusStyles]
        .split(" ")
        .pop();

  const beaconTone =
    finding.risk_level === "critical"
      ? "bg-red-400/30"
      : finding.risk_level === "high"
        ? "bg-orange-400/30"
        : null;

  return (
    <div className="relative z-0 transition-transform duration-200 hover:scale-[1.02]">
      {beaconTone && (
        <span
          className={`absolute -inset-3 rounded-2xl blur-lg animate-ping ${beaconTone}`}
          aria-hidden="true"
        />
      )}
      <div className={`${cardClassName} relative overflow-hidden`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            {statusIcons[finding.status as keyof typeof statusIcons]}
            <h4 className={`ml-2 font-semibold capitalize ${textClassName}`}>
              {finding.component}
            </h4>
          </div>
          {finding.risk_level && (
            <span
              className={`text-xs uppercase font-semibold px-2 py-1 rounded ${
                RISK_COLORS[finding.risk_level as keyof typeof RISK_COLORS].badge
              } ${
                RISK_COLORS[finding.risk_level as keyof typeof RISK_COLORS]
                  .badgeText
              }`}
            >
              {finding.risk_level} Risk
            </span>
          )}
        </div>
        <p className={`text-sm ${textClassName}`}>{finding.evidence}</p>
      </div>
    </div>
  );
}

function HazardCard({ hazard }: { hazard: Hazard }) {
  const colors = RISK_COLORS[hazard.risk as keyof typeof RISK_COLORS];
  const beaconTone =
    hazard.risk === "critical"
      ? "bg-red-400/30"
      : hazard.risk === "high"
        ? "bg-orange-400/30"
        : null;

  return (
    <div className="relative z-0 transition-transform duration-200 hover:scale-[1.02]">
      {beaconTone && (
        <span
          className={`absolute -inset-3 rounded-2xl blur-lg animate-ping ${beaconTone}`}
          aria-hidden="true"
        />
      )}
      <div
        className={`border-2 rounded-lg p-4 ${colors.bg} ${colors.border} relative overflow-hidden`}
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className={`font-semibold ${colors.text}`}>{hazard.type}</h4>
          <span
            className={`text-xs uppercase font-semibold px-2 py-1 rounded ${colors.badge} ${colors.badgeText}`}
          >
            {hazard.risk}
          </span>
        </div>
        <p className={`text-sm ${colors.text}`}>{hazard.evidence}</p>
      </div>
    </div>
  );
}

function IndicatorItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight: boolean;
}) {
  return (
    <div className="transition-transform duration-200 hover:scale-[1.02]">
      <div
        className={`p-3 rounded-lg ${
          highlight
            ? "bg-emerald-50 border border-emerald-200"
            : "bg-slate-700 border border-slate-600"
        }`}
      >
        <p
          className={`text-xs mb-1 ${highlight ? "text-emerald-600" : "text-slate-400"}`}
        >
          {label}
        </p>
        <p
          className={`font-semibold capitalize ${highlight ? "text-emerald-900" : "text-slate-100"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function RepairRow({ estimate }: { estimate: RepairEstimate }) {
  const cost = estimateCost(estimate.material, estimate.estimated_quantity);

  return (
    <tr className="border-b border-slate-700 hover:bg-slate-700/50">
      <td className="py-3 px-4 font-medium text-white">{estimate.material}</td>
      <td className="py-3 px-4 text-slate-200">
        {estimate.estimated_quantity}
      </td>
      <td className="py-3 px-4 text-emerald-400 font-semibold">
        ${cost.toLocaleString()}
      </td>
      <td className="py-3 px-4 text-sm text-slate-400">
        {estimate.notes || "—"}
      </td>
    </tr>
  );
}
