# 🚀 Deployment Guide

This guide will help you deploy your Mini Vutto application to production.

## 📋 Prerequisites

- GitHub account with your repositories
- Backend API running and accessible
- Frontend React application ready

## 🎯 Deployment Strategy

We'll use **Vercel for Frontend** and **Railway for Backend** as they offer:
- Free tiers
- Easy GitHub integration
- Automatic deployments
- Good performance

## 🔧 Step 1: Backend Deployment (Railway)

### 1.1 Prepare Your Backend
Make sure your backend has:
- `package.json` with start script
- Proper CORS configuration
- Environment variables for database

### 1.2 Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your backend repository
6. Railway will auto-detect Node.js and deploy
7. Note your deployment URL (e.g., `https://your-backend.railway.app`)

### 1.3 Configure Environment Variables
In Railway dashboard:
- Go to your project → Variables
- Add your database URL, JWT secret, etc.

## 🌐 Step 2: Frontend Deployment (Vercel)

### 2.1 Prepare Your Frontend
Your frontend is already configured to use environment variables.

### 2.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your `mini-vutto-frontend` repository
5. Vercel will auto-detect React and configure build settings

### 2.3 Configure Environment Variables
In Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add: `REACT_APP_API_URL` = `https://your-backend.railway.app`
3. Redeploy the project

### 2.4 Custom Domain (Optional)
In Vercel dashboard:
1. Go to Settings → Domains
2. Add your custom domain
3. Configure DNS settings

## 🔗 Step 3: Connect Frontend to Backend

### 3.1 Update CORS in Backend
Make sure your backend allows requests from your Vercel domain:

```javascript
// In your backend CORS configuration
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:3000' // for local development
  ],
  credentials: true
}));
```

### 3.2 Test the Connection
1. Visit your Vercel frontend URL
2. Try to register/login
3. Check if API calls work
4. Verify bike listings load

## 📱 Step 4: Share Your Application

### 4.1 Frontend URL
Your frontend will be available at:
```
https://mini-vutto-frontend.vercel.app
```

### 4.2 Backend URL
Your backend will be available at:
```
https://your-backend.railway.app
```

### 4.3 Share with Others
You can now share your frontend URL with anyone to test your application!

## 🔧 Alternative Deployment Options

### Netlify + Heroku
- **Frontend**: [netlify.com](https://netlify.com)
- **Backend**: [heroku.com](https://heroku.com)

### Render (Both)
- **Frontend**: Static Site
- **Backend**: Web Service
- Visit: [render.com](https://render.com)

### Railway (Both)
- Deploy both frontend and backend on Railway
- Visit: [railway.app](https://railway.app)

## 🚨 Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure backend allows your frontend domain
2. **Environment Variables**: Verify all required variables are set
3. **Build Failures**: Check build logs in deployment platform
4. **API Connection**: Test backend URL directly

### Debug Steps:
1. Check browser console for errors
2. Verify environment variables are loaded
3. Test backend API endpoints directly
4. Check deployment platform logs

## 📞 Support

If you encounter issues:
1. Check the deployment platform documentation
2. Review build logs
3. Test locally first
4. Contact platform support if needed

---

**Note**: Keep your backend URL private and only share the frontend URL with users.
