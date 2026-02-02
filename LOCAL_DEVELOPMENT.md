# Local Development Guide

## Running FloodScout Locally

FloodScout is designed to work seamlessly in both local development and production environments.

## Setup for Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here

# Optional for local dev (will use base64 fallback if not present)
# BLOB_READ_WRITE_TOKEN=
```

**Important**: You only need the `GEMINI_API_KEY` for local development.

### 3. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000

## How It Works Locally

### Image Storage
- **Local Dev**: Images are converted to base64 data URLs (no external storage needed)
- **Production (Vercel)**: Images are uploaded to Vercel Blob storage

The app automatically detects the environment and uses the appropriate method.

### AI Analysis
- Works the same in both environments
- Requires valid `GEMINI_API_KEY`

## Testing the Full Flow Locally

1. **Upload Image**: Use the drag & drop interface
2. **Analysis**: Gemini AI processes the image
3. **Report**: View results dashboard

Everything works locally except:
- ✅ Image upload (uses base64)
- ✅ AI analysis (uses Gemini API)
- ✅ Report generation
- ❌ Persistent storage (in-memory only)

## Limitations in Local Development

### In-Memory Storage
- Reports are stored in memory only
- Refreshing the server will clear all reports
- For production, reports persist in Vercel Blob

### No Database
- Current implementation uses in-memory storage
- For production with persistent storage, add:
  - PostgreSQL (Neon/Supabase)
  - Prisma ORM
  - Database schema

## Environment Detection

The app automatically detects:
- Local development: `NODE_ENV === 'development'`
- Missing Blob token: `!process.env.BLOB_READ_WRITE_TOKEN`
- Falls back to base64 encoding

## Common Local Development Issues

### Issue: "No token found"
**Solution**: This is expected! The app now falls back to base64 encoding for local dev.

### Issue: "Module not found"
**Solution**: 
```bash
npm install
```

### Issue: "Invalid API key"
**Solution**: Check your `GEMINI_API_KEY` in `.env.local`

### Issue: Reports disappear after restart
**Solution**: This is expected in local dev (in-memory storage)

## Production vs Development

| Feature | Local Dev | Production (Vercel) |
|---------|-----------|---------------------|
| Image Storage | Base64 | Vercel Blob |
| Report Storage | In-memory | In-memory* |
| AI Analysis | Gemini API | Gemini API |
| Performance | Slower (base64) | Fast (CDN) |
| Persistence | Session only | Deployment lifetime |

*For persistent storage, add a database.

## Upgrading to Database Storage (Optional)

For production-grade persistent storage:

### 1. Add Prisma & PostgreSQL
```bash
npm install prisma @prisma/client
npm install -D prisma
```

### 2. Initialize Prisma
```bash
npx prisma init
```

### 3. Create Schema
```prisma
model Report {
  id        String   @id @default(uuid())
  imageUrl  String
  analysis  Json
  timestamp DateTime @default(now())
}
```

### 4. Update Storage Layer
Replace `lib/storage.ts` with Prisma client calls.

## Testing Before Deployment

### Checklist
- [ ] `npm install` completes
- [ ] `.env.local` has valid `GEMINI_API_KEY`
- [ ] `npm run dev` starts without errors
- [ ] Can upload image
- [ ] AI analysis completes
- [ ] Report displays correctly

## Deploying to Vercel

When you deploy to Vercel:
1. Vercel automatically provides `BLOB_READ_WRITE_TOKEN`
2. App switches to Blob storage automatically
3. No code changes needed!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment guide.

## Development Tips

### Hot Reload
- Changes to code trigger automatic reload
- No need to restart server

### Console Logs
- Check terminal for server logs
- Check browser console for client logs

### Error Debugging
- API errors appear in terminal
- Client errors appear in browser console

### Testing with Sample Images
Place test images in `public/test/` (create folder):
- `public/test/flood1.jpg`
- `public/test/flood2.jpg`

## Port Already in Use?

If port 3000 is busy:
```bash
npm run dev -- -p 3001
```

Or kill the process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

## Next Steps

1. ✅ Get local development working
2. 🧪 Test all features
3. 🚀 Deploy to Vercel
4. 📊 Add database (optional)
5. 🎨 Customize for your needs

---

**Your local environment is now ready for development!** 🚀

