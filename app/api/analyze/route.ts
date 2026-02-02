import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { storeReport } from "@/lib/storage";
import { GEMINI_SYSTEM_PROMPT } from "@/lib/gemini-prompt";
import { AnalysisResult } from "@/types/analysis";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not configured");
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    console.log("API Key present:", apiKey ? "Yes (length: " + apiKey.length + ")" : "No");

    // Use gemini-2.5-flash which is available in your API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // Handle image data
    let imageBase64: string;
    let mimeType: string;

    if (imageUrl.startsWith('data:')) {
      // Local development: imageUrl is already a base64 data URL
      const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        throw new Error("Invalid data URL format");
      }
      mimeType = matches[1];
      imageBase64 = matches[2];
    } else {
      // Production: fetch from Vercel Blob
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      imageBase64 = Buffer.from(imageBuffer).toString("base64");
      mimeType = imageResponse.headers.get("content-type") || "image/jpeg";
    }

    // Prepare the request for REST API
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: GEMINI_SYSTEM_PROMPT
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: imageBase64
              }
            }
          ]
        }
      ]
    };

    // Call Gemini REST API directly
    console.log("Calling Gemini API...");
    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("API Error:", apiResponse.status, errorText);
      throw new Error(`Gemini API error: ${apiResponse.status} - ${errorText}`);
    }

    const apiData = await apiResponse.json();
    console.log("=== GEMINI API RESPONSE ===");
    console.log(JSON.stringify(apiData, null, 2));
    console.log("=== END RESPONSE ===");
    
    const text = apiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error("No text found in response. Full response:", JSON.stringify(apiData, null, 2));
      throw new Error("No text in API response");
    }
    
    console.log("=== EXTRACTED TEXT ===");
    console.log(text);
    console.log("=== END TEXT ===");

    // Parse JSON response
    let analysis: AnalysisResult;
    try {
      // Try to extract JSON from response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = JSON.parse(text);
      }
      
      console.log("=== PARSED ANALYSIS ===");
      console.log(JSON.stringify(analysis, null, 2));
      console.log("=== END ANALYSIS ===");
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      return NextResponse.json(
        { error: "Invalid AI response format" },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!analysis.severity || !analysis.structural_findings || !analysis.hazards) {
      console.error("Missing required fields in analysis:", analysis);
      return NextResponse.json(
        { error: "Incomplete analysis data" },
        { status: 500 }
      );
    }

    // Store report
    const reportId = uuidv4();
    console.log("=== STORING REPORT ===");
    console.log("Report ID:", reportId);
    console.log("Image URL length:", imageUrl.length);
    
    storeReport({
      id: reportId,
      imageUrl,
      analysis,
      timestamp: new Date().toISOString(),
    });
    
    console.log("Report stored successfully!");

    return NextResponse.json({
      reportId,
      analysis,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Analysis failed"
      },
      { status: 500 }
    );
  }
}

