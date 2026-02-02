"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, AlertCircle, Shield } from "lucide-react";
import Link from "next/link";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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

      const { reportId } = await analyzeResponse.json();
      setProgress("Generating report...");

      // Step 3: Redirect to report
      setTimeout(() => {
        router.push(`/report/${reportId}`);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsUploading(false);
      setIsAnalyzing(false);
      setProgress("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">FloodScout</h1>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Upload Flood Damage Image
          </h2>
          <p className="text-slate-600">
            Upload a clear photo of the flood-damaged building for instant AI analysis
          </p>
        </div>

        {/* Upload Area */}
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
      </main>
    </div>
  );
}

