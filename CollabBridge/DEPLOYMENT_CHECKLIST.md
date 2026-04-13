# CollabBridge Render Deployment Checklist

Use this checklist before deploying to Render to ensure everything is configured correctly.

## Code Preparation

- ✅ All code is pushed to GitHub/GitLab
- ✅ No local .env files with real credentials in git (only .env.example)
- ✅ All dependencies are listed in package.json
- ✅ No hardcoded localhost URLs in production code
- ✅ Error handling is in place
- ✅ Console.log statements are appropriate (not cluttered)
- ✅ Build scripts work locally (`npm run build`)

## Environment Variables

### Backend (.env)
- ✅ `PORT` - will be provided by Render (or use 5000)
- ✅ `NODE_ENV` - set to "production"
- ✅ `MONGODB_URI` - valid MongoDB Atlas connection string
- ✅ `JWT_SECRET` - strong secret (minimum 32 characters, randomly generated)
- ✅ `JWT_EXPIRES_IN` - expiration time (e.g., "7d")
- ✅ `CLIENT_URL` - frontend domain with https://

### Frontend (.env)
- ✅ `VITE_API_URL` - backend API domain (https://, with /api if needed)
- ✅ `VITE_SOCKET_URL` - backend WS/Socket domain (https://)

## Configuration Files

- ✅ `render.yaml` exists at project root
- ✅ `render.yaml` has correct build and start commands
- ✅ `render.yaml` specifies correct runtime (Node)
- ✅ Server package.json has `"start": "node src/server.js"` script
- ✅ Web package.json has `"build"` and `"preview"` scripts
- ✅ vite.config.js uses environment variables for API URL
- ✅ Socket configuration uses CLIENT_URL from env

## Database

- ✅ MongoDB Atlas cluster is created
- ✅ Database user is created with strong password
- ✅ Connection string is correct (mongodb+srv://...)
- ✅ IP whitelist is set to 0.0.0.0/0 (or your IP range)
- ✅ Connection tested locally before deploying
- ✅ Database name matches in connection string

## Port & Networking

- ✅ Server uses `process.env.PORT` (not hardcoded 5000)
- ✅ Frontend can reach backend via HTTPS (not HTTP)
- ✅ CORS is configured with proper CLIENT_URL
- ✅ Socket.io origin is configured correctly
- ✅ Uploads directory exists on server

## Security

- ✅ JWT secret is cryptographically random (not a simple string)
- ✅ Passwords are hashed (bcryptjs) in backend
- ✅ No sensitive data in frontend code
- ✅ CORS restricts to your frontend domain
- ✅ API validates all inputs
- ✅ Rate limiting is considered for auth endpoints
- ✅ HTTPS is enforced (Render does this)

## Testing

- ✅ Backend runs locally: `npm run dev` in server/
- ✅ Frontend runs locally: `npm run dev` in web/
- ✅ Frontend can reach backend API
- ✅ Socket.io connection works
- ✅ Authentication flow works end-to-end
- ✅ File uploads work (if applicable)
- ✅ Real-time features work (chat, notifications, etc.)
- ✅ No console errors in browser DevTools
- ✅ No console errors in backend logs

## Deployment Readiness

- ✅ README.md is complete and up-to-date
- ✅ DEPLOYMENT.md has clear instructions
- ✅ .env.example has all required variables
- ✅ All secrets are NOT in version control
- ✅ Git history is clean (no large files)
- ✅ Latest commit is tested and working

## Render Dashboard Setup

- ✅ Render account is created and active
- ✅ GitHub repository is connected to Render
- ✅ Two web services will be created:
  - Backend: `collabbridge-server`
  - Frontend: `collabbridge-web`
- ✅ Environment variables are added to each service
- ✅ Build commands are correct
- ✅ Start commands are correct

## Post-Deployment Verification

After deploying, verify:

- ✅ Backend service is running (green status)
- ✅ Frontend service is running (green status)
- ✅ Health check passes: `GET /api/health`
- ✅ Frontend loads without errors
- ✅ Can create account and login
- ✅ API calls work (check Network tab in DevTools)
- ✅ Socket.io connects (check console for "Socket connected")
- ✅ Real-time features work
- ✅ No 403/CORS errors
- ✅ No 401/Unauthorized errors
- ✅ Check Render logs for errors

## Debugging Steps

If anything fails:

1. **Check Render Logs**
   - Dashboard → [Service] → Logs
   - Look for error messages and stack traces

2. **Verify Environment Variables**
   - Dashboard → [Service] → Environment
   - Compare with .env.example

3. **Test Connection Strings**
   ```bash
   # For MongoDB
   mongosh "your-connection-string"
   ```

4. **Check Frontend Network Tab**
   - Browser DevTools → Network
   - Look for failed API requests
   - Check response status codes

5. **Test Backend Directly**
   ```bash
   curl https://your-server.onrender.com/api/health
   ```

6. **View Socket Errors**
   - Browser Console → look for socket.io errors
   - Server logs → look for socket initialization errors

## Common Deployment Issues

| Issue | Solution |
|-------|----------|
| "Cannot connect to MongoDB" | Check MONGODB_URI env var, Atlas IP whitelist |
| "CORS error" | Verify CLIENT_URL matches your frontend domain |
| "Socket connection failed" | Check VITE_SOCKET_URL and server Socket config |
| "Build failed" | Check build command, dependencies in package.json |
| "Port already in use" | Render handles this automatically |
| "Timeout errors" | Check MongoDB Atlas connection, scale up instance |
| "404 on /api routes" | Verify build command in render.yaml |

## Performance & Monitoring

- ✅ Set up Render alerts for deployment failures
- ✅ Monitor disk usage and memory on Render
- ✅ Check database query performance
- ✅ Implement basic analytics (optional)
- ✅ Set up error tracking (Sentry, etc. - optional)

## Rollback Plan

If deployment fails in production:

1. Go to Render dashboard
2. Service → Manual Deploys
3. Select previous stable commit
4. Click "Deploy"
5. Verify deployment succeeded

## Next Steps After Deployment

- 📧 Share frontend URL with team
- 📝 Update any documentation with new URLs
- 🔒 Change all default/test credentials
- 📊 Monitor logs for first 24 hours
- 🚀 Plan scaling if needed (upgrade from Free tier)

## Final Checklist Before "Deploy"

- ⭕ I have verified all environment variables
- ⭕ I have tested the application locally
- ⭕ I have updated .env.example
- ⭕ I have pushed all code to GitHub
- ⭕ I have read DEPLOYMENT.md
- ⭕ I understand the deployment architecture
- ⭕ I'm ready to deploy

**If all items are checked, you're ready to deploy!** ✨

---

**Support**: For issues, check Render logs, MongoDB Atlas status, or GitHub issues.
