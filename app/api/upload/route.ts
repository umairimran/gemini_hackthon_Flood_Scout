import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Check if Vercel Blob is available (has token)
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;
    
    if (!hasBlobToken) {
      // No Vercel Blob: convert to base64 data URL (local or without blob storage)
      console.log("[UPLOAD] Using base64 fallback (no BLOB_READ_WRITE_TOKEN)");
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      
      return NextResponse.json({
        imageUrl: dataUrl,
      });
    }

    // Vercel Blob available: Upload to blob storage
    console.log("[UPLOAD] Uploading to Vercel Blob");
    const blob = await put(file.name, file, {
      access: "public",
    });

    return NextResponse.json({
      imageUrl: blob.url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

