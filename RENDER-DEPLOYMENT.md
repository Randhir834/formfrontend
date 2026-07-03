# Render Deployment Guide for Frontend

## 🚀 Deployment Configuration

### Required Settings on Render:

#### **1. Build Command:**
```bash
npm install && npm run build
```

#### **2. Publish Directory:**
```
build
```

#### **3. Environment Variables:**
Add the following in Render Dashboard → Environment tab:

```
REACT_APP_API_URL=https://formbackend-1-v0n3.onrender.com/api
```

⚠️ **IMPORTANT:** After adding or changing environment variables, you **MUST** click **"Clear build cache & deploy"** to rebuild the app with the new variables.

---

## 🔧 Step-by-Step Deployment

### Initial Setup:

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Create New Static Site**
3. **Connect GitHub Repository**: `Randhir834/formfrontend`
4. **Configure Build Settings**:
   - **Name**: `formfrontend` (or your preferred name)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

5. **Add Environment Variable**:
   - Click "Environment" tab
   - Click "Add Environment Variable"
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://formbackend-1-v0n3.onrender.com/api`
   - Click "Save Changes"

6. **Deploy**:
   - Click "Create Static Site"
   - Wait for build to complete
   - Your site will be live at: `https://formfrontend-xxxxx.onrender.com`

---

## 🔄 Updating After Code Changes:

### Method 1: Automatic (Recommended)
- Simply push to GitHub `main` branch
- Render will auto-deploy

### Method 2: Manual Deploy
- Go to your Render Dashboard
- Click your frontend service
- Click "Manual Deploy" → "Deploy latest commit"

---

## ⚙️ Updating Environment Variables:

If you need to change the backend URL or add new environment variables:

1. **Go to your frontend service** on Render
2. **Click "Environment" tab**
3. **Update the variable** or add new ones
4. **CRITICAL**: Click "Manual Deploy" → **"Clear build cache & deploy"**

❌ **Don't just click "Save Changes"** - React bakes env variables at build time!

✅ **Always use "Clear build cache & deploy"** after changing environment variables

---

## 🐛 Troubleshooting

### Issue: Login/Signup Returns 404 Error

**Cause**: Environment variable not baked into build

**Solution**:
1. Verify `REACT_APP_API_URL` is set in Environment tab
2. Click "Manual Deploy" → "Clear build cache & deploy"
3. Wait for build to complete
4. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: CORS Error

**Cause**: Backend doesn't allow your frontend domain

**Solution**:
1. Go to backend service on Render
2. Add environment variable: `FRONTEND_URL=https://formfrontend-p8e7.onrender.com`
3. Save and redeploy backend

### Issue: Build Fails with "react-scripts: not found"

**Cause**: Dependencies not installed

**Solution**:
Ensure build command is: `npm install && npm run build`

### Issue: Changes Not Appearing

**Cause**: Browser cache

**Solution**:
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Try in Incognito/Private mode

---

## 📋 Checklist

Before deploying, ensure:

- [ ] Backend is deployed and running
- [ ] Backend URL is correct in `REACT_APP_API_URL`
- [ ] Backend has `FRONTEND_URL` set to your frontend domain
- [ ] Build command includes `npm install &&`
- [ ] Publish directory is set to `build`
- [ ] After setting environment variables, used "Clear build cache & deploy"

---

## 🔗 Important URLs

- **Frontend**: https://formfrontend-p8e7.onrender.com
- **Backend**: https://formbackend-1-v0n3.onrender.com
- **Backend API**: https://formbackend-1-v0n3.onrender.com/api
- **Backend Health Check**: https://formbackend-1-v0n3.onrender.com/health

---

## 🛠️ Local Development

To test with production backend locally:

```bash
# Create .env file
echo "REACT_APP_API_URL=https://formbackend-1-v0n3.onrender.com/api" > .env

# Install dependencies
npm install

# Start development server
npm start
```

To test with local backend:

```bash
# Update .env file
echo "REACT_APP_API_URL=http://localhost:5001/api" > .env

# Start development server
npm start
```

---

## ✅ Verification

After deployment, verify everything works:

1. **Visit**: https://formfrontend-p8e7.onrender.com/test-api.html
2. **Click**: "Test Health Endpoint" - should show ✅ SUCCESS
3. **Click**: "Test Login Endpoint" - should return response (even if invalid credentials)
4. **Open**: https://formfrontend-p8e7.onrender.com/signup
5. **Open Browser Console** (F12)
6. **Look for**: `🌐 API Base URL configured as: https://formbackend-1-v0n3.onrender.com/api`
7. **Try signing up** - should see network request in Network tab

If all checks pass, your deployment is successful! 🎉
