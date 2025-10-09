# 🚀 Deployment Guide

This guide explains how to deploy the Anomia LLM game with:
- **Frontend**: GitHub Pages (free hosting)
- **Backend**: Railway (free tier available)

## 📋 Prerequisites

1. **GitHub Account** with repository access
2. **Railway Account** (free tier available)
3. **Git** installed locally
4. **Node.js** and **Python** for local development

## 🎯 Deployment Steps

### **Step 1: Deploy Backend to Railway**

1. **Sign up for Railway**:
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub account

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `anomia-llm` repository
   - Select the `backend` folder as the root directory

3. **Configure Environment Variables**:
   In Railway dashboard, go to Variables tab and add:
   ```
   PORT=3001
   HOST=0.0.0.0
   DEBUG=false
   FRONTEND_URL=https://carriee-liuu.github.io/anomia-llm
   OPENAI_API_KEY=your_openai_api_key_here
   SECRET_KEY=your_secret_key_here
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Deploy**:
   - Railway will automatically build and deploy
   - Note the generated URL (e.g., `https://your-app.railway.app`)

### **Step 2: Deploy Frontend to GitHub Pages**

1. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Scroll to "Pages" section
   - Source: "GitHub Actions"

2. **Set Repository Secrets**:
   In Settings > Secrets and variables > Actions, add:
   ```
   REACT_APP_BACKEND_URL=https://your-railway-app.railway.app
   REACT_APP_WS_URL=wss://your-railway-app.railway.app
   ```

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

After getting your Railway URL, update the backend CORS settings:

1. **In Railway Dashboard**:
   - Go to Variables tab
   - Update `FRONTEND_URL` to your GitHub Pages URL

2. **Or update code**:
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
- **Backend API**: `https://your-app.railway.app`
- **Backend Health**: `https://your-app.railway.app/health`

## 🐛 Troubleshooting

### **Frontend Issues**
- **Build fails**: Check GitHub Actions logs
- **CORS errors**: Verify backend CORS configuration
- **Environment variables**: Ensure secrets are set correctly

### **Backend Issues**
- **Deployment fails**: Check Railway logs
- **Port issues**: Railway sets PORT automatically
- **Dependencies**: Ensure requirements.txt is complete

### **Connection Issues**
- **WebSocket not connecting**: Check WSS vs WS protocol
- **API calls failing**: Verify backend URL in frontend
- **CORS errors**: Update backend CORS origins

## 📊 Monitoring

### **Frontend**
- GitHub Actions: Build and deployment status
- GitHub Pages: Site availability

### **Backend**
- Railway Dashboard: App status and logs
- Health endpoint: `https://your-app.railway.app/health`

## 🔄 Updates

To update your deployment:

1. **Make code changes**
2. **Commit and push to main branch**
3. **Frontend**: Automatically deploys via GitHub Actions
4. **Backend**: Automatically deploys via Railway

## 💰 Costs

- **GitHub Pages**: Free
- **Railway**: Free tier (500 hours/month)
- **Total**: $0/month for small projects

## 🎮 Testing Your Deployment

1. **Visit your GitHub Pages URL**
2. **Create a room**
3. **Join with another browser/device**
4. **Test the full game flow**

Your Anomia LLM game is now live and ready to play! 🎉
