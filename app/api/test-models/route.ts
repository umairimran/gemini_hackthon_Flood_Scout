import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Call the REST API to list models
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    const response = await fetch(listUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API Error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Filter models that support generateContent
    const generateModels = data.models?.filter((model: any) => 
      model.supportedGenerationMethods?.includes('generateContent')
    ) || [];

    return NextResponse.json({
      success: true,
      apiKeyLength: apiKey.length,
      totalModels: data.models?.length || 0,
      generateContentModels: generateModels.length,
      availableModels: generateModels.map((m: any) => ({
        name: m.name,
        displayName: m.displayName,
        version: m.version,
        methods: m.supportedGenerationMethods
      })),
      allModels: data.models?.map((m: any) => m.name)
    });
  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to list models",
      },
      { status: 500 }
    );
  }
}

