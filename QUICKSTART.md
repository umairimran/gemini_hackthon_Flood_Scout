# FloodScout - Quick Start Guide

Get FloodScout running locally in 3 minutes.

## 🚀 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get your Gemini API key:**
1. Visit https://ai.google.dev/
2. Click "Get API Key"
3. Copy the key and paste it in `.env.local`

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📝 Quick Test

1. Navigate to "Upload & Analyze Image"
2. Upload a flood damage photo (or use a test image)
3. Click "Analyze Damage"
4. View the comprehensive report

## 🌐 Deploy to Vercel (3 clicks)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts and add GEMINI_API_KEY in dashboard
```

Or use the one-click button in README.md

## 📦 What's Included

- ✅ Landing page with hero and features
- ✅ Image upload with drag & drop
- ✅ AI analysis with Gemini 1.5 Flash
- ✅ Beautiful results dashboard
- ✅ Error handling and loading states
- ✅ Mobile responsive design
- ✅ Print-ready reports

## 🔧 Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Google Gemini AI
- Vercel (serverless)

## ⚡ Features

**Upload Page**
- Drag & drop image upload
- File validation (type, size)
- Real-time progress tracking

**Analysis**
- Gemini AI multimodal analysis
- Structural damage detection
- Hazard identification
- Repair cost estimation

**Dashboard**
- Severity classification (Low/Medium/Critical)
- Component-by-component findings
- Flood indicators (water depth, debris)
- Prioritized hazards list
- Material quantity estimates
- Confidence scoring

## 📁 Project Structure

```
floodscout/
├── app/
│   ├── page.tsx              # Landing page
│   ├── analyze/page.tsx      # Upload interface
│   ├── report/[id]/page.tsx  # Results dashboard
│   └── api/                  # Serverless functions
├── components/               # React components
├── lib/                      # Utilities
└── types/                    # TypeScript types
```

## 🐛 Troubleshooting

**"AI service not configured"**
- Check `.env.local` has `GEMINI_API_KEY`
- Restart dev server: `npm run dev`

**Upload fails**
- For local dev, Vercel Blob won't work
- Deploy to Vercel for full functionality
- Or modify to use local file storage

**Analysis timeout**
- Large images may take longer
- Ensure stable internet connection
- Check Gemini API quota

## 📚 Documentation

- [Full README](./README.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Gemini AI Docs](https://ai.google.dev/docs)

## 🎯 Next Steps

1. ✅ Get it running locally
2. 🚀 Deploy to Vercel
3. 🎨 Customize branding
4. 📊 Add analytics
5. 🗄️ Add database (optional)

## 💡 Tips

- Use high-quality, well-lit images
- Capture full structure in frame
- Test with various damage levels
- Share reports via URL

---

**Built for the hackathon. Ready for production.** 🛡️

