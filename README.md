# FloodScout - AI-Powered Flood Damage Assessment

FloodScout is a serverless Next.js application that uses Google Gemini AI to instantly analyze flood-damaged buildings from a single photograph. Get comprehensive structural insights, hazard detection, and repair cost estimates in under 10 seconds.

![FloodScout Banner](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

## 🎯 Project Overview

Built for disaster response, FloodScout provides:

- **Instant Analysis**: Upload a photo, get results in < 10 seconds
- **Structural Insights**: Deep analysis of foundation, walls, roof, and structural integrity
- **Hazard Detection**: Identify collapse risks, exposed rebar, and safety concerns
- **Repair Estimates**: Evidence-based material quantity estimates (cement, bricks, steel, labor)
- **Confidence Scoring**: Transparent AI confidence levels
- **Professional Reports**: Shareable, printable damage assessment reports

Developed in response to the devastating Swat Valley floods.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://ai.google.dev/))
- Vercel account (for deployment)

### Installation

1. **Clone and Install**

```bash
npm install
```

2. **Configure Environment Variables**

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

For Vercel Blob storage, the `BLOB_READ_WRITE_TOKEN` is automatically provided when deployed to Vercel.

3. **Run Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
floodscout/
├── app/
│   ├── api/
│   │   ├── upload/route.ts      # Image upload to Vercel Blob
│   │   ├── analyze/route.ts     # Gemini AI analysis
│   │   └── report/[id]/route.ts # Report retrieval
│   ├── analyze/page.tsx         # Upload & processing page
│   ├── report/[id]/page.tsx     # Results dashboard
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   └── ErrorBoundary.tsx        # Error handling component
├── lib/
│   ├── gemini-prompt.ts         # AI prompt configuration
│   └── storage.ts               # In-memory report storage
├── types/
│   └── analysis.ts              # TypeScript type definitions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🔧 Technology Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React**

### Backend (Serverless)
- **Vercel Serverless Functions**
- **Google Gemini 1.5 Flash**
- **Vercel Blob Storage**

### Deployment
- **Vercel** (Zero-config deployment)

## 🌐 Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/floodscout)

### Manual Deployment

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Deploy**

```bash
vercel
```

3. **Configure Environment Variables in Vercel Dashboard**

Go to your project settings → Environment Variables:

- `GEMINI_API_KEY`: Your Google Gemini API key
- `BLOB_READ_WRITE_TOKEN`: (Automatically added by Vercel when you enable Blob storage)

4. **Enable Vercel Blob Storage**

In your Vercel project dashboard:
- Go to Storage → Create Database → Blob
- This automatically configures the `BLOB_READ_WRITE_TOKEN`

## 📊 API Endpoints

### POST `/api/upload`
Upload an image to Vercel Blob storage.

**Request:** `multipart/form-data` with `file` field

**Response:**
```json
{
  "imageUrl": "https://blob.vercel-storage.com/xyz.jpg"
}
```

### POST `/api/analyze`
Analyze flood damage using Gemini AI.

**Request:**
```json
{
  "imageUrl": "https://blob.vercel-storage.com/xyz.jpg"
}
```

**Response:**
```json
{
  "reportId": "uuid-v4",
  "analysis": { /* AnalysisResult */ }
}
```

### GET `/api/report/[id]`
Retrieve a stored report.

**Response:**
```json
{
  "id": "uuid-v4",
  "imageUrl": "https://...",
  "analysis": { /* AnalysisResult */ },
  "timestamp": "2026-02-02T10:30:00Z"
}
```

## 🎨 Features

### Landing Page (`/`)
- Professional hero section
- Feature highlights
- Clear call-to-action
- Trust-building disclaimers

### Analyze Page (`/analyze`)
- Drag & drop image upload
- File validation (type, size)
- Real-time progress indicators
- Intelligent loading states

### Report Dashboard (`/report/[id]`)
- **Severity Overview**: Color-coded badges (Low/Medium/Critical)
- **Structural Findings**: Component-by-component analysis
- **Flood Indicators**: Water depth, debris, mud staining
- **Hazards**: Risk-prioritized safety concerns
- **Repair Estimates**: Material quantities table
- **Confidence Score**: Transparency in AI assessment
- **Disclaimer**: Clear limitations statement

## 🔒 Security Features

- File type validation
- File size limits (10MB max)
- API key protection (server-side only)
- Rate limiting ready
- No personal data storage

## ⚡ Performance

- Image upload: < 2s
- AI analysis: < 6s
- Total flow: < 10s
- Optimized for mobile
- Edge function for uploads

## 🧪 Development

### Running Tests

```bash
npm run lint
```

### Building for Production

```bash
npm run build
npm start
```

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `BLOB_READ_WRITE_TOKEN` | Auto | Vercel Blob storage token (auto-provided) |

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## ⚠️ Important Disclaimers

- FloodScout provides **preliminary assessments only**
- **Not a substitute** for professional structural engineering inspection
- Always consult certified engineers before making repair decisions
- Assessments based solely on visible damage in provided images

## 📄 License

MIT License - feel free to use this project for educational or disaster response purposes.

## 🙏 Acknowledgments

- Built in response to the Swat Valley flood disaster
- Powered by Google Gemini AI
- Deployed on Vercel infrastructure

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ for disaster response and community resilience**

