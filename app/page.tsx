"use client";

import Link from "next/link";
import {
  CloudUpload,
  Shield,
  Zap,
  DollarSign,
  TrendingUp,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "./theme-provider";

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 light:bg-gradient-to-br light:from-slate-50 light:to-slate-100">
      {/* Header */}
      <header className="border-b dark:border-slate-700 light:border-slate-200 dark:bg-slate-800/80 light:bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold dark:text-white light:text-slate-900">
                FloodScout
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:block">
                <span className="text-sm dark:text-slate-300 light:text-slate-600">
                  Professional Flood Damage Assessment
                </span>
              </nav>
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
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold dark:text-white light:text-slate-900 mb-4">
            Professional Flood Damage
            <br />
            Assessment with AI
          </h2>
          <p className="text-xl dark:text-slate-300 light:text-slate-700 mb-3 max-w-3xl mx-auto leading-relaxed">
            Upload a single photograph and get comprehensive structural
            analysis, hazard detection, and repair estimates in seconds.
          </p>
          <p className="text-sm dark:text-slate-400 light:text-slate-600 italic max-w-2xl mx-auto">
            Built in response to the Swat Valley floods, trusted by disaster
            response teams and affected communities worldwide.
          </p>
        </section>

        {/* CTA Button */}
        <div className="flex justify-center mb-20">
          <Link
            href="/analyze"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-2xl hover:shadow-emerald-500/50 transform hover:-translate-y-1"
          >
            <CloudUpload className="mr-2 h-5 w-5" />
            Upload & Analyze Image
            <span className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-emerald-400" />}
            title="Rapid Analysis"
            description="Analyze flood damage in under 10 seconds. No long wait times or complicated processes."
          />
          <FeatureCard
            icon={<TrendingUp className="h-10 w-10 text-emerald-400" />}
            title="Structural Insights"
            description="Detect foundation damage, wall displacement, roof integrity, and critical collapse risks with precision."
          />
          <FeatureCard
            icon={<DollarSign className="h-10 w-10 text-emerald-400" />}
            title="Cost Estimates"
            description="Get evidence-based repair material quantities and labor estimates for accurate recovery planning."
          />
        </div>

        {/* How It Works */}
        <div className="dark:bg-slate-800/50 light:bg-white/50 dark:border-slate-700 light:border-slate-200 rounded-2xl p-10 mb-16 backdrop-blur-sm">
          <h3 className="text-3xl font-bold dark:text-white light:text-slate-900 mb-8 text-center">
            Simple 4-Step Process
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <Step
              number="1"
              title="Upload"
              description="Drag and drop your flood damage photo"
            />
            <Step
              number="2"
              title="Analyze"
              description="AI processes structural damage"
            />
            <Step
              number="3"
              title="Review"
              description="Get detailed findings instantly"
            />
            <Step
              number="4"
              title="Report"
              description="Download actionable estimates"
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="dark:bg-orange-900/20 light:bg-orange-100/30 dark:border-orange-700/50 light:border-orange-300/50 rounded-xl p-6 text-center">
          <p className="text-sm dark:text-orange-200 light:text-orange-800">
            <strong>Important:</strong> FloodScout provides preliminary
            assessments based on visual analysis only. This tool is not a
            substitute for professional structural engineering inspections.
            Always consult certified engineers before making repair decisions.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-800/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-400 text-sm">
            Built with Next.js and Google Gemini AI • Serverless • Open Source
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="dark:bg-slate-800/50 light:bg-white/50 dark:border-slate-700 light:border-slate-200 rounded-xl p-6 hover:dark:border-emerald-500/50 hover:light:border-emerald-400/50 hover:dark:bg-slate-800/80 hover:light:bg-white/80 transition-all backdrop-blur-sm">
      <div className="mb-4 p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg w-fit">
        {icon}
      </div>
      <h3 className="text-xl font-semibold dark:text-white light:text-slate-900 mb-2">
        {title}
      </h3>
      <p className="dark:text-slate-300 light:text-slate-600">
        {description}
      </p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-900 font-bold text-lg mb-3">
        {number}
      </div>
      <h4 className="font-semibold dark:text-white light:text-slate-900 mb-1">
        {title}
      </h4>
      <p className="text-sm dark:text-slate-300 light:text-slate-600">
        {description}
      </p>
    </div>
  );
}
