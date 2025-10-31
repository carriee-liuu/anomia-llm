# 🚀 Deployment Guide

This guide explains how to deploy the Anomia LLM game with:
- **Frontend**: GitHub Pages (free hosting)
- **Backend**: Render (free tier available)

## 📋 Prerequisites

1. **GitHub Account** with repository access
2. **Render Account** (free tier available at [render.com](https://render.com))
3. **Git** installed locally
4. **Node.js** and **Python** for local development

## 🎯 Deployment Steps

### **Step 1: Deploy Backend to Render**

1. **Sign up for Render**:
   - Go to [render.com](https://render.com)
   - Sign up with GitHub account

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub account if not already connected
   - Select your `anomia-llm` repository
   - Render will detect `render.yaml` automatically
   - **Important**: Make sure the root directory is set to `backend`

3. **Configure Settings** (if render.yaml wasn't detected):
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python start.py`

4. **Set Environment Variables**:
   In Render dashboard, go to Environment tab and add:
   ```
   PORT=3001
   HOST=0.0.0.0
   DEBUG=false
   PYTHON_VERSION=3.11
   PYTHONUNBUFFERED=1
   FRONTEND_URL=https://carriee-liuu.github.io/anomia-llm
   OPENAI_API_KEY=your_openai_api_key_here
   SECRET_KEY=your_secret_key_here  # Generate a random string
   JWT_SECRET=your_jwt_secret_here  # Generate a random string
   ```

5. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Wait for deployment to complete (5-10 minutes first time)
   - Note the generated URL (e.g., `https://anomia-llm-backend.onrender.com`)

**Note**: Free tier services on Render spin down after 15 minutes of inactivity, but wake up automatically when accessed (may take 30-60 seconds to wake up).

### **Step 2: Deploy Frontend to GitHub Pages**

1. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Scroll to "Pages" section
   - Source: "GitHub Actions"

2. **Set Repository Secrets**:
   In Settings > Secrets and variables > Actions, add:
   ```
   REACT_APP_BACKEND_URL=https://your-render-app.onrender.com
   REACT_APP_WS_URL=wss://your-render-app.onrender.com
   ```
   
   **Important**: Replace `your-render-app.onrender.com` with your actual Render service URL

3. **Push to Main Branch**:
   ```bash
   git add .
   git commit -m "Configure deployment"
   git push origin main
   ```

4. **Monitor Deployment**:
   - Go to Actions tab in GitHub
   - Watch the "Deploy Frontend to GitHub Pages" workflow
   - Once complete, your app will be live at:
     `https://carriee-liuu.github.io/anomia-llm`

### **Step 3: Update CORS Configuration**

After getting your Render URL, update the backend CORS settings:

1. **In Render Dashboard**:
   - Go to Environment tab
   - Update `FRONTEND_URL` to your GitHub Pages URL: `https://carriee-liuu.github.io/anomia-llm`
   - Save changes (will trigger a redeploy)

2. **Verify in code** (if needed):
   ```python
   # In backend/main.py
   allow_origins=[
       "http://localhost:3000",  # Development
       "https://carriee-liuu.github.io",  # Production
   ]
   ```

## 🔧 Configuration Files

### **Frontend Configuration**
- `frontend/package.json`: Contains homepage URL
- `.github/workflows/deploy-frontend.yml`: GitHub Actions workflow
- `frontend/env.example`: Environment variables template

### **Backend Configuration**
- `backend/railway.toml`: Railway deployment config
- `backend/Dockerfile.railway`: Docker configuration
- `backend/env.example`: Environment variables template
- `backend/start.py`: Production startup script

## 🌐 URLs After Deployment

- **Frontend**: `https://carriee-liuu.github.io/anomia-llm`
- **Backend API**: `https://your-app.onrender.com`
- **Backend Health**: `https://your-app.onrender.com/health`

## 🐛 Troubleshooting

### **Frontend Issues**
- **Build fails**: Check GitHub Actions logs
- **CORS errors**: Verify backend CORS configuration
- **Environment variables**: Ensure secrets are set correctly

### **Backend Issues**
- **Deployment fails**: Check Render logs in the dashboard
- **Port issues**: Render sets PORT automatically via environment variable
- **Dependencies**: Ensure requirements.txt is complete
- **Service sleeping**: Free tier services sleep after 15min inactivity (wake automatically)

### **Connection Issues**
- **WebSocket not connecting**: Check WSS vs WS protocol
- **API calls failing**: Verify backend URL in frontend
- **CORS errors**: Update backend CORS origins

## 📊 Monitoring

### **Frontend**
- GitHub Actions: Build and deployment status
- GitHub Pages: Site availability

### **Backend**
- Render Dashboard: App status and logs
- Health endpoint: `https://your-app.onrender.com/health`

## 🔄 Updates

To update your deployment:

1. **Make code changes**
2. **Commit and push to main branch**
3. **Frontend**: Automatically deploys via GitHub Actions
4. **Backend**: Automatically deploys via Render (auto-deploy on git push)

## 💰 Costs

- **GitHub Pages**: Free
- **Render**: Free tier (free web services, may sleep when inactive)
- **Total**: $0/month (completely free!)

**Note**: Render's free tier services will spin down after 15 minutes of inactivity but wake automatically when accessed (may take 30-60 seconds). For always-on hosting, consider Render's paid plans starting at $7/month.

## 🎮 Testing Your Deployment

1. **Visit your GitHub Pages URL**
2. **Create a room**
3. **Join with another browser/device**
4. **Test the full game flow**

Your Anomia LLM game is now live and ready to play! 🎉
