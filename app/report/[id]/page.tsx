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
  Moon,
  Sun,
} from "lucide-react";
import {
  ReportData,
  StructuralFinding,
  Hazard,
  RepairEstimate,
} from "@/types/analysis";
import { useTheme } from "../../theme-provider";

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

// Cost estimation
const MATERIAL_COSTS: Record<string, number> = {
  cement: 12,
  bricks: 2.5,
  "steel rods": 25,
  "wood planks": 18,
  labor: 120,
  sand: 18,
  gravel: 14,
  paint: 60,
  plumbing: 350,
  electrical: 300,
  drywall: 40,
  flooring: 25,
  "garage door": 1200,
};

function estimateCost(material: string, quantity: string): number {
  const materialLower = material.toLowerCase();
  const costPerUnit =
    Object.entries(MATERIAL_COSTS).find(([key]) =>
      materialLower.includes(key),
    )?.[1] ?? 250;
  const match = quantity.match(/\d+(\.\d+)?/);
  const qty = match ? parseFloat(match[0]) : 1;
  return Math.round(qty * costPerUnit);
}

export default function ReportPage() {
  const params = useParams();
  const { theme, toggleTheme } = useTheme();
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
      <div className="min-h-screen dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 light:bg-gradient-to-br light:from-slate-50 light:to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="dark:text-slate-300 light:text-slate-600">
            Loading report...
          </p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 light:bg-gradient-to-br light:from-slate-50 light:to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold dark:text-white light:text-slate-900 mb-2">
            Report Not Found
          </h2>
          <p className="dark:text-slate-300 light:text-slate-600 mb-6">
            {error}
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition"
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
              <button
                onClick={() => window.print()}
                className="hidden sm:flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </button>
              <Link
                href="/analyze"
                className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition"
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
          <h2 className="text-3xl font-bold dark:text-white light:text-slate-900 mb-2">
            Flood Damage Assessment Report
          </h2>
          <p className="dark:text-slate-400 light:text-slate-600">
            Generated on {new Date(timestamp).toLocaleString()}
          </p>
        </div>

        {/* Severity Overview */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl backdrop-blur-sm shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Severity Assessment
              </h3>
              <SeverityBadge severity={analysis.severity} />
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400 mb-1">Confidence Score</p>
              <p className="text-2xl font-bold text-emerald-400">
                {Math.round(analysis.confidence_score * 100)}%
              </p>
            </div>
          </div>
          <p className="text-slate-300 leading-relaxed">{analysis.summary}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Image */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl backdrop-blur-sm shadow-lg p-4 sticky top-24">
              <h3 className="font-semibold text-white mb-3">Analyzed Image</h3>
              <img
                src={imageUrl}
                alt="Flood damage"
                className="w-full h-auto rounded-lg border border-slate-700"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Structural Findings */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl backdrop-blur-sm shadow-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Home className="mr-2 h-5 w-5 text-emerald-400" />
                Structural Findings
              </h3>
              <div className="space-y-3">
                {analysis.structural_findings.map((finding, index) => (
                  <StructuralCard key={index} finding={finding} />
                ))}
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
                    analysis.flood_indicators.water_line_visible ? "Yes" : "No"
                  }
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
                  value={
                    analysis.flood_indicators.mud_staining
                      ? "Present"
                      : "Absent"
                  }
                  highlight={analysis.flood_indicators.mud_staining}
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
                {analysis.hazards
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
                    {analysis.repair_estimates.map((estimate, index) => (
                      <RepairRow key={index} estimate={estimate} />
                    ))}
                    <tr className="border-t-2 border-emerald-500/50 bg-slate-800/50">
                      <td
                        colSpan={2}
                        className="py-4 px-4 font-semibold text-white text-right"
                      >
                        Total Estimated Cost:
                      </td>
                      <td className="py-4 px-4 font-bold text-emerald-400 text-lg">
                        $
                        {analysis.repair_estimates
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
                    {analysis.disclaimer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-800/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-400 text-sm">
            FloodScout - Professional Flood Damage Assessment • Not a substitute
            for professional inspection
          </p>
        </div>
      </footer>
    </div>
  );
}

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

  return (
    <div className={cardClassName}>
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
  );
}

function HazardCard({ hazard }: { hazard: Hazard }) {
  const colors = RISK_COLORS[hazard.risk as keyof typeof RISK_COLORS];

  return (
    <div className={`border-2 rounded-lg p-4 ${colors.bg} ${colors.border}`}>
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
