# Gemini API Key Setup Guide

If you're getting a **404 Not Found** error with the Gemini API, follow these steps:

## 🔑 Step 1: Get a NEW API Key

1. **Visit Google AI Studio**: https://aistudio.google.com/apikey
2. **Sign in** with your Google account
3. Click **"Get API Key"**
4. Click **"Create API key in new project"** (or select existing project)
5. **Copy the API key** immediately (you won't be able to see it again)

## ⚠️ Important Notes:

- **Don't use old API keys** - they may not work with current models
- **Generate a fresh key** specifically for this project
- API keys look like: `AIzaSyD...` (39 characters long)

## 📝 Step 2: Add to .env.local

Create or update `.env.local` in your project root:

```env
GEMINI_API_KEY=AIzaSyD_your_actual_key_here
```

**Important:**
- No quotes around the key
- No spaces
- Just: `GEMINI_API_KEY=AIza...`

## 🔄 Step 3: Restart Server

```bash
# Stop the current server (Ctrl + C)
# Clear cache
Remove-Item -Recurse -Force .next

# Restart
npm run dev
```

## 🧪 Step 4: Test Your API Key

Visit this URL in your browser to test if your key works:

```
https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY_HERE
```

Replace `YOUR_API_KEY_HERE` with your actual key.

**Expected response:** A list of available models in JSON format

**If you get an error:** Your API key is invalid or not activated

## ❌ Common Issues:

### Issue: "404 Not Found"
**Causes:**
- API key is invalid
- API key not activated
- Copied key incorrectly (missing characters)
- Old/expired API key

**Solution:** Generate a **NEW** API key from https://aistudio.google.com/apikey

### Issue: "API key not valid"
**Causes:**
- Spaces in the .env.local file
- Quotes around the key
- Extra characters

**Solution:** Check your `.env.local` format:
```env
GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Issue: "429 Quota Exceeded"
**Causes:**
- Using gemini-2.0-flash on free tier
- Too many requests

**Solution:** 
- Use `gemini-pro-vision` or `gemini-1.5-flash`
- Wait a few minutes before retrying

## ✅ Verification Checklist:

- [ ] Generated NEW API key from https://aistudio.google.com/apikey
- [ ] API key is 39 characters long starting with "AIza"
- [ ] Added to `.env.local` without quotes or spaces
- [ ] Restarted dev server
- [ ] Cleared `.next` cache
- [ ] Tested API key with the URL above

## 🆘 Still Not Working?

### Option 1: Use Alternative Model

The code now tries `gemini-pro-vision` which is more compatible with various API keys.

### Option 2: Check API Key Status

Visit: https://aistudio.google.com/app/apikey

Check if your key is:
- Active
- Not restricted to specific domains
- Has no IP restrictions

### Option 3: Create New Project

Sometimes creating a new Google Cloud project helps:

1. Go to https://aistudio.google.com/apikey
2. Click "Create API key in new project"
3. Use the new key

## 📚 Official Resources:

- **Google AI Studio**: https://aistudio.google.com/
- **API Documentation**: https://ai.google.dev/docs
- **Available Models**: https://ai.google.dev/models/gemini

---

**Once your API key is working, you should see successful analysis results!** 🎉

