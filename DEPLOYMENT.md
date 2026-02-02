# FloodScout Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. A [Vercel account](https://vercel.com/signup)
2. A [Google Gemini API key](https://ai.google.dev/)
3. Node.js 18+ installed locally (for testing)

## Step-by-Step Deployment

### 1. Get Google Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key"
3. Create a new API key
4. Copy and save it securely

### 2. Deploy to Vercel

#### Option A: One-Click Deploy

1. Click the "Deploy with Vercel" button in README.md
2. Fork/Clone the repository when prompted
3. Configure environment variables (see step 3)
4. Click "Deploy"

#### Option B: Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? Choose your account
   - Link to existing project? **No**
   - Project name? **floodscout** (or your choice)
   - Directory? **./** (press Enter)
   - Override settings? **No**

### 3. Configure Environment Variables

In your Vercel dashboard:

1. Go to your project → **Settings** → **Environment Variables**

2. Add the following variable:

| Name | Value | Environment |
|------|-------|-------------|
| `GEMINI_API_KEY` | Your Gemini API key | Production, Preview, Development |

3. Click **Save**

### 4. Enable Vercel Blob Storage

1. In Vercel dashboard, go to **Storage**
2. Click **Create Database**
3. Select **Blob**
4. Choose your project
5. Click **Create**

The `BLOB_READ_WRITE_TOKEN` will be automatically added to your environment variables.

### 5. Redeploy (if needed)

If you added environment variables after initial deployment:

```bash
vercel --prod
```

Or trigger a redeploy from the Vercel dashboard.

## Verification

1. Visit your deployed URL (e.g., `https://floodscout.vercel.app`)
2. Test the upload flow:
   - Click "Upload & Analyze Image"
   - Upload a test image
   - Click "Analyze Damage"
   - Verify the report loads correctly

## Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

## Troubleshooting

### "AI service not configured" error
- Ensure `GEMINI_API_KEY` is set in Vercel environment variables
- Redeploy after adding the variable

### "Failed to upload image" error
- Ensure Vercel Blob storage is enabled
- Check that `BLOB_READ_WRITE_TOKEN` exists in environment variables

### 404 on API routes
- Ensure all files are committed and pushed to Git
- Check build logs in Vercel dashboard for errors

### Analysis timeout
- Default timeout is 30 seconds (configured in vercel.json)
- For slower connections, consider upgrading Vercel plan

## Performance Optimization

### For Production Use:

1. **Add Database**: Replace in-memory storage with Postgres (Neon/Supabase)
   - Store reports persistently
   - Enable report history and analytics

2. **Add Caching**: Implement Redis for frequently accessed reports

3. **Rate Limiting**: Add rate limiting middleware to prevent abuse

4. **Image Optimization**: Add image compression before upload

5. **Analytics**: Integrate Vercel Analytics for monitoring

## Environment-Specific Configuration

### Development
```bash
# .env.local
GEMINI_API_KEY=your_dev_api_key
```

### Production
Set in Vercel dashboard as shown above.

## Monitoring

Monitor your deployment:

1. **Vercel Dashboard**: Real-time logs and analytics
2. **Error Tracking**: Check function logs for errors
3. **Performance**: Monitor function execution times

## Cost Considerations

### Vercel (Free Tier)
- 100GB bandwidth/month
- Serverless function executions: 100GB-hours
- Usually sufficient for hackathons and demos

### Google Gemini
- Free tier: 60 requests per minute
- Check [current pricing](https://ai.google.dev/pricing)

## Security Checklist

- ✅ API keys stored in environment variables (not in code)
- ✅ File upload validation enabled
- ✅ File size limits enforced (10MB)
- ✅ HTTPS enforced by Vercel
- ✅ No sensitive data logged

## Support

If you encounter issues:

1. Check Vercel function logs
2. Review browser console for errors
3. Verify environment variables are set
4. Check API key validity

## Production Readiness

For production use, consider:

- [ ] Add database for persistent storage
- [ ] Implement rate limiting
- [ ] Add user authentication (if needed)
- [ ] Set up monitoring and alerts
- [ ] Configure custom domain
- [ ] Add privacy policy
- [ ] Implement GDPR compliance (if applicable)

---

**Your FloodScout instance should now be live and ready to analyze flood damage!**

