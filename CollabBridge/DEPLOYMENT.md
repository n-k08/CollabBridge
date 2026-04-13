# CollabBridge Render Deployment Guide

This guide walks through deploying CollabBridge on Render.com with proper environment variable configuration and error handling.

## Prerequisites

- Render.com account
- MongoDB Atlas account (or MongoDB database connection string)
- Git repository with code pushed to GitHub/GitLab

## Deployment Architecture

CollabBridge will be deployed as:
1. **collabbridge-server** - Node.js Express API backend
2. **collabbridge-web** - React Vite frontend (built as static or Node preview)
3. **collabbridge-db** - MongoDB Atlas database

## Step 1: Set Up MongoDB Atlas

1. Create MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
2. Get your connection string: `mongodb+srv://username:password@cluster.xxx.mongodb.net/collabbridge?retryWrites=true&w=majority`
3. Keep this handy for environment variables

## Step 2: Deploy on Render

### Option A: Using render.yaml (Recommended)

1. Ensure `render.yaml` is in the root of your repository
2. Connect your GitHub repo to Render
3. Render will auto-detect and deploy all services

### Option B: Manual Deployment

#### Deploy Server (Backend)

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `collabbridge-server`
   - **Runtime**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Instance Type**: Free (or Starter if needed)

5. Add Environment Variables:
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/collabbridge?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key-here-change-this
   JWT_EXPIRES_IN=7d
   CLIENT_URL=https://collabbridge-web.onrender.com
   ```

6. Deploy

#### Deploy Frontend (Web)

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `collabbridge-web`
   - **Runtime**: Node
   - **Build Command**: `cd web && npm install && npm run build`
   - **Start Command**: `cd web && npm run preview`
   - **Instance Type**: Free

4. Add Environment Variables:
   ```
   VITE_API_URL=https://collabbridge-server.onrender.com
   VITE_SOCKET_URL=https://collabbridge-server.onrender.com
   ```

5. Deploy

## Step 3: Verify Deployment

### Check Server Health

```bash
curl https://collabbridge-server.onrender.com/api/health
```

Should return: `{"status":"ok","timestamp":"2024-..."}`

### Check Frontend

Visit `https://collabbridge-web.onrender.com` in browser - should load the application

### Test API Connection

1. Try logging in on the frontend
2. Check Render logs for any errors: Dashboard → Your Service → Logs

## Step 4: Environment Variables Checklist

Ensure these are set correctly:

**Server:**
- ✅ `PORT` = 5000
- ✅ `NODE_ENV` = production
- ✅ `MONGODB_URI` = your atlas connection string
- ✅ `JWT_SECRET` = strong secret key
- ✅ `CLIENT_URL` = frontend URL (with https://)

**Web:**
- ✅ `VITE_API_URL` = backend URL ending with /api (with https://)
- ✅ `VITE_SOCKET_URL` = backend URL (with https://)

## Common Issues & Solutions

### "Cannot connect to database"
- Check MONGODB_URI is correct
- Verify IP whitelist on MongoDB Atlas allows all IPs (0.0.0.0/0)

### "CORS error"
- Ensure CLIENT_URL is set to your frontend domain (with https://)
- Rebuild and redeploy server

### "Socket connection failed"
- Ensure VITE_SOCKET_URL is set correctly
- Both server and web must be using https:// URLs

### "401 Unauthorized"
- Check JWT_SECRET is the same on server and stored correctly
- Clear browser localStorage and try logging in again

### "Build fails"
- Check that `server/package.json` and `web/package.json` exist
- Ensure all dependencies are properly listed
- Check build logs in Render dashboard

## Advanced Configuration

### Custom Domain

1. Go to Service Settings
2. Add Custom Domain
3. Update your DNS records
4. Update environment variables with new domain URLs

### Database Backups

MongoDB Atlas handles automated backups. Configure in Atlas dashboard.

### Monitoring

- Use Render's built-in monitoring
- Check server logs regularly
- Set up email alerts for deployment failures

## Updating Code

To deploy updates:

1. Push changes to GitHub
2. Render automatically redeploys on commit (if auto-deploy enabled)
3. Check Logs tab for deployment progress

## Troubleshooting

### View Real-time Logs

```
Render Dashboard → Service → Logs → View Live Logs
```

### SSH into Service (if needed)

Not available on free tier, upgrade to Starter tier for SSH access

### Manual Redeploy

1. Service Dashboard → Manual Deploys
2. Select branch and click "Deploy Latest Commit"

## Cost Optimization

- Use free tier during development
- Upgrade to Starter ($7/month) for production reliability
- MongoDB Atlas: Free tier has 512MB storage limit

## Security Checklist

- ✅ Change all default passwords
- ✅ Use strong JWT_SECRET (minimum 32 characters)
- ✅ Keep sensitive env vars out of .env file (only in Render)
- ✅ MongoDB Atlas: whitelist IPs if possible (currently 0.0.0.0/0 for flexibility)
- ✅ Use HTTPS everywhere (Render handles this automatically)

## Next Steps

1. Test all authentication flows
2. Upload test files to verify uploads work
3. Test real-time chat features
4. Monitor logs for any errors
5. Scale up resources if needed

## Support

For Render-specific issues: https://render.com/docs
For application issues: Check server and client logs
