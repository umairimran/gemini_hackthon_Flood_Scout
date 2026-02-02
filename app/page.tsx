"use client";

import Link from "next/link";
import { CloudUpload, Shield, Zap, DollarSign } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">FloodScout</h1>
            </div>
            <nav className="hidden md:block">
              <span className="text-sm text-slate-600">AI-Powered Damage Assessment</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold text-slate-900 mb-4">
            AI-Powered Flood Damage Assessment
          </h2>
          <p className="text-xl text-slate-600 mb-2 max-w-3xl mx-auto">
            Instant analysis from just a photo. Get structural insights, hazard detection, 
            and repair cost estimates in seconds.
          </p>
          <p className="text-sm text-slate-500 italic max-w-2xl mx-auto">
            Developed in response to the devastating Swat Valley floods, providing rapid 
            assessment capabilities for disaster response teams and affected communities.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mb-16">
          <Link
            href="/analyze"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <CloudUpload className="mr-2 h-5 w-5" />
            Upload & Analyze Image
            <span className="absolute inset-0 rounded-lg bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-blue-600" />}
            title="Instant Analysis"
            description="Upload a flood-damaged building photo and receive comprehensive analysis in under 10 seconds."
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-blue-600" />}
            title="Structural Insights"
            description="Deep analysis beyond satellite imagery—detect foundation cracks, wall displacement, and collapse risks."
          />
          <FeatureCard
            icon={<DollarSign className="h-10 w-10 text-blue-600" />}
            title="Cost Estimates"
            description="Evidence-based repair material estimates including cement, bricks, steel, and labor costs."
          />
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            How It Works
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <Step number="1" title="Upload" description="Drag and drop your flood damage photo" />
            <Step number="2" title="Analyze" description="AI processes structural damage using Gemini" />
            <Step number="3" title="Review" description="Get detailed findings and hazard assessment" />
            <Step number="4" title="Report" description="Download actionable repair estimates" />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <p className="text-sm text-amber-900">
            <strong>Important:</strong> FloodScout provides preliminary assessments based on visual analysis only. 
            This tool does not replace professional structural engineering inspections. 
            Always consult certified engineers before making repair decisions.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-600 text-sm">
            Built with Next.js and Google Gemini AI • Serverless • Open Source
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-lg mb-3">
        {number}
      </div>
      <h4 className="font-semibold text-slate-900 mb-1">{title}</h4>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

