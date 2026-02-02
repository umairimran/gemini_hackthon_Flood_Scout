"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  Download,
  Loader2,
} from "lucide-react";
import { ReportData, StructuralFinding, Hazard, RepairEstimate } from "@/types/analysis";

export default function ReportPage() {
  const params = useParams();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/report/${params.id}`);
        if (!response.ok) {
          throw new Error("Report not found");
        }
        const data = await response.json();
        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Report Not Found</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link
            href="/analyze"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Home className="mr-2 h-5 w-5" />
            Analyze New Image
          </Link>
        </div>
      </div>
    );
  }

  const { analysis, imageUrl, timestamp } = report;

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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.print()}
                className="hidden sm:flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </button>
              <Link
                href="/analyze"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                New Analysis
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Flood Damage Assessment Report
          </h2>
          <p className="text-slate-600">
            Generated on {new Date(timestamp).toLocaleString()}
          </p>
        </div>

        {/* Severity Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Severity Assessment
              </h3>
              <SeverityBadge severity={analysis.severity} />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 mb-1">Confidence Score</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(analysis.confidence_score * 100)}%
              </p>
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed">{analysis.summary}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-24">
              <h3 className="font-semibold text-slate-900 mb-3">Analyzed Image</h3>
              <img
                src={imageUrl}
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
                {analysis.structural_findings.map((finding, index) => (
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
                  value={analysis.flood_indicators.water_line_visible ? "Yes" : "No"}
                  highlight={analysis.flood_indicators.water_line_visible}
                />
                <IndicatorItem
                  label="Estimated Depth"
                  value={
                    analysis.flood_indicators.estimated_depth_meters
                      ? `${analysis.flood_indicators.estimated_depth_meters}m`
                      : "Unknown"
                  }
                  highlight={!!analysis.flood_indicators.estimated_depth_meters}
                />
                <IndicatorItem
                  label="Debris Level"
                  value={analysis.flood_indicators.debris_level}
                  highlight={analysis.flood_indicators.debris_level !== "none"}
                />
                <IndicatorItem
                  label="Mud Staining"
                  value={analysis.flood_indicators.mud_staining ? "Present" : "Absent"}
                  highlight={analysis.flood_indicators.mud_staining}
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
                {analysis.hazards
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
                    {analysis.repair_estimates.map((estimate, index) => (
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
                    {analysis.disclaimer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-600 text-sm">
            FloodScout - AI-Powered Flood Damage Assessment • Not a substitute for professional inspection
          </p>
        </div>
      </footer>
    </div>
  );
}

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

