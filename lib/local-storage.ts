// Local file storage for development (when Vercel Blob is not available)

export async function uploadToLocalStorage(file: File): Promise<string> {
  // Convert file to base64 data URL for local storage
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function isLocalDevelopment(): boolean {
  return process.env.NODE_ENV === 'development' && !process.env.BLOB_READ_WRITE_TOKEN;
}

