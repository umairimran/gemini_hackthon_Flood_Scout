// In-memory storage for demo purposes
// In production, use a proper database (Postgres/Supabase/Neon)

interface StoredReport {
  id: string;
  imageUrl: string;
  analysis: any;
  timestamp: string;
}

// Use global to persist across hot reloads in development
declare global {
  var floodscout_reports: Map<string, StoredReport> | undefined;
}

// Initialize global storage
if (!global.floodscout_reports) {
  global.floodscout_reports = new Map<string, StoredReport>();
}

const reports = global.floodscout_reports;

export function storeReport(report: StoredReport): void {
  console.log("[STORAGE] Storing report:", report.id);
  reports.set(report.id, report);
  console.log("[STORAGE] Total reports in memory:", reports.size);
  console.log("[STORAGE] All report IDs:", Array.from(reports.keys()));
}

export function getReport(id: string): StoredReport | undefined {
  console.log("[STORAGE] Looking for report:", id);
  console.log("[STORAGE] Available reports:", Array.from(reports.keys()));
  const report = reports.get(id);
  console.log("[STORAGE] Report found:", report ? "YES" : "NO");
  return report;
}

