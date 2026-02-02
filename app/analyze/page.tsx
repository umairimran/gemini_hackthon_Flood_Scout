"use client";

import { useState, useRef } from "react";
import { Upload, X, AlertCircle, Shield, Home, AlertTriangle, CheckCircle, XCircle, Download } from "lucide-react";
import Link from "next/link";
import { AnalysisResult, StructuralFinding, Hazard, RepairEstimate } from "@/types/analysis";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
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
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">FloodScout</h1>
            </Link>
            {analysisResult && (
              <button
                onClick={() => window.print()}
                className="hidden sm:flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!analysisResult ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Upload Flood Damage Image
              </h2>
              <p className="text-slate-600">
                Upload a clear photo of the flood-damaged building for instant AI analysis
              </p>
            </div>

            {/* Upload Area */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                {!preview ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-3 border-dashed border-slate-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <Upload className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-slate-700 mb-2">
                      Drop your image here, or click to browse
                    </p>
                    <p className="text-sm text-slate-500">
                      Supports: JPG, PNG, WebP (Max 10MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
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
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                      <p className="text-blue-800 font-semibold">{progress}</p>
                    </div>
                    <div className="mt-3 bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
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
                    className="w-full mt-6 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Analyze Damage
                  </button>
                )}
              </div>

              {/* Guidelines */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-slate-900 mb-3">
                  For Best Results:
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Use clear, well-lit photos showing the entire structure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Capture visible damage including cracks, water lines, and debris</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Avoid blurry or heavily filtered images</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Include context like surrounding terrain if possible</span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div ref={resultsRef}>
            {/* Title */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Flood Damage Assessment Report
              </h2>
              <p className="text-slate-600">
                Generated on {new Date().toLocaleString()}
              </p>
              <button
                onClick={handleNewAnalysis}
                className="mt-4 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Upload className="mr-2 h-5 w-5" />
                Analyze New Image
              </button>
            </div>

            {/* Severity Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Severity Assessment
                  </h3>
                  <SeverityBadge severity={analysisResult.severity} />
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600 mb-1">Confidence Score</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(analysisResult.confidence_score * 100)}%
                  </p>
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed">{analysisResult.summary}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* Image */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-4 sticky top-24">
                  <h3 className="font-semibold text-slate-900 mb-3">Analyzed Image</h3>
                  <img
                    src={analyzedImageUrl || preview || ""}
                    alt="Flood damage"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Structural Findings */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                    <Home className="mr-2 h-5 w-5 text-blue-600" />
                    Structural Findings
                  </h3>
                  <div className="space-y-3">
                    {analysisResult.structural_findings.map((finding, index) => (
                      <StructuralCard key={index} finding={finding} />
                    ))}
                  </div>
                </div>

                {/* Flood Indicators */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    Flood Indicators
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <IndicatorItem
                      label="Water Line Visible"
                      value={analysisResult.flood_indicators.water_line_visible ? "Yes" : "No"}
                      highlight={analysisResult.flood_indicators.water_line_visible}
                    />
                    <IndicatorItem
                      label="Estimated Depth"
                      value={
                        analysisResult.flood_indicators.estimated_depth_meters
                          ? `${analysisResult.flood_indicators.estimated_depth_meters}m`
                          : "Unknown"
                      }
                      highlight={!!analysisResult.flood_indicators.estimated_depth_meters}
                    />
                    <IndicatorItem
                      label="Debris Level"
                      value={analysisResult.flood_indicators.debris_level}
                      highlight={analysisResult.flood_indicators.debris_level !== "none"}
                    />
                    <IndicatorItem
                      label="Mud Staining"
                      value={analysisResult.flood_indicators.mud_staining ? "Present" : "Absent"}
                      highlight={analysisResult.flood_indicators.mud_staining}
                    />
                  </div>
                </div>

                {/* Hazards */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-amber-600" />
                    Identified Hazards
                  </h3>
                  <div className="space-y-3">
                    {analysisResult.hazards
                      .sort((a, b) => {
                        const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                        return riskOrder[b.risk] - riskOrder[a.risk];
                      })
                      .map((hazard, index) => (
                        <HazardCard key={index} hazard={hazard} />
                      ))}
                  </div>
                </div>

                {/* Repair Estimates */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Repair Cost Estimates
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 italic">
                    Evidence-based heuristic estimates for repair materials
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">
                            Material
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">
                            Estimated Quantity
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisResult.repair_estimates.map((estimate, index) => (
                          <RepairRow key={index} estimate={estimate} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-6 w-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-900 mb-2">
                        Important Disclaimer
                      </h4>
                      <p className="text-amber-800 text-sm leading-relaxed">
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
    low: "bg-green-100 text-green-800 border-green-300",
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
    intact: "bg-green-50 border-green-200 text-green-800",
    damaged: "bg-yellow-50 border-yellow-200 text-yellow-800",
    critical: "bg-red-50 border-red-200 text-red-800",
    unknown: "bg-slate-50 border-slate-200 text-slate-800",
  };

  const statusIcons = {
    intact: <CheckCircle className="h-5 w-5 text-green-600" />,
    damaged: <AlertCircle className="h-5 w-5 text-yellow-600" />,
    critical: <XCircle className="h-5 w-5 text-red-600" />,
    unknown: <AlertTriangle className="h-5 w-5 text-slate-600" />,
  };

  return (
    <div
      className={`border-2 rounded-lg p-4 ${
        statusStyles[finding.status as keyof typeof statusStyles]
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          {statusIcons[finding.status as keyof typeof statusIcons]}
          <h4 className="ml-2 font-semibold capitalize">{finding.component}</h4>
        </div>
        {finding.risk_level && (
          <span className="text-xs uppercase font-semibold px-2 py-1 rounded bg-white/50">
            {finding.risk_level} Risk
          </span>
        )}
      </div>
      <p className="text-sm">{finding.evidence}</p>
    </div>
  );
}

function HazardCard({ hazard }: { hazard: Hazard }) {
  const riskStyles = {
    low: "bg-blue-50 border-blue-200",
    medium: "bg-yellow-50 border-yellow-200",
    high: "bg-orange-50 border-orange-200",
    critical: "bg-red-50 border-red-200",
  };

  const riskBadgeStyles = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${riskStyles[hazard.risk]}`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-slate-900">{hazard.type}</h4>
        <span
          className={`text-xs uppercase font-semibold px-2 py-1 rounded ${
            riskBadgeStyles[hazard.risk]
          }`}
        >
          {hazard.risk}
        </span>
      </div>
      <p className="text-sm text-slate-700">{hazard.evidence}</p>
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
    <div
      className={`p-3 rounded-lg ${
        highlight ? "bg-blue-50 border border-blue-200" : "bg-slate-50 border border-slate-200"
      }`}
    >
      <p className="text-xs text-slate-600 mb-1">{label}</p>
      <p className={`font-semibold capitalize ${highlight ? "text-blue-900" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}

function RepairRow({ estimate }: { estimate: RepairEstimate }) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50">
      <td className="py-3 px-4 font-medium text-slate-900">{estimate.material}</td>
      <td className="py-3 px-4 text-slate-700">{estimate.estimated_quantity}</td>
      <td className="py-3 px-4 text-sm text-slate-600">{estimate.notes || "—"}</td>
    </tr>
  );
}
