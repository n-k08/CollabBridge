# Environment Variables Quick Reference

## Render Environment Variables Setup

### Copy these into Render Dashboard for each service

---

## 🔧 Backend Service (collabbridge-server)

| Key | Value | Notes |
|-----|-------|-------|
| `PORT` | `5000` | Keep as is |
| `NODE_ENV` | `production` | Important for production optimizations |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/collabbridge?retryWrites=true&w=majority` | Get from MongoDB Atlas |
| `JWT_SECRET` | `<random-32-char-string>` | Generate random: `openssl rand -base64 32` |
| `JWT_EXPIRES_IN` | `7d` | Token expiration time |
| `CLIENT_URL` | `https://collabbridge-web.onrender.com` | Update with your frontend URL |

### MongoDB Atlas Connection String Format
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
```

Example:
```
mongodb+srv://collabbridge_user:Tz8kL9pQr2x9@collabbridge.abc1234.mongodb.net/collabbridge?retryWrites=true&w=majority
```

---

## 🎨 Frontend Service (collabbridge-web)

| Key | Value | Notes |
|-----|-------|-------|
| `VITE_API_URL` | `https://collabbridge-server.onrender.com` | Backend URL without /api |
| `VITE_SOCKET_URL` | `https://collabbridge-server.onrender.com` | WebSocket URL (same as API) |

---

## 🔐 How to Generate JWT_SECRET

### Using OpenSSL
```bash
openssl rand -base64 32
```

### Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Using Python
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Example output:**
```
aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890=
```

---

## 📋 MongoDB Atlas Setup

1. **Create Cluster**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Wait for provisioning (5-10 minutes)

2. **Create Database User**
   - Database Access → Add Database User
   - Username: `collabbridge_user`
   - Password: Generate strong password
   - Permissions: Read/Write to any database

3. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<USERNAME>` and `<PASSWORD>` with your credentials
   - Change database name to `collabbridge`

4. **IP Whitelist**
   - Network Access → Add IP Address
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add specific Render IPs

---

## 🚀 Render Service Configuration

### Build Commands
- **Backend**: `cd server && npm install`
- **Frontend**: `cd web && npm install && npm run build`

### Start Commands
- **Backend**: `cd server && npm start`
- **Frontend**: `cd web && npm run preview`

### Runtimes
- **Backend**: Node
- **Frontend**: Node

### Health Check
- **Backend**: GET `/api/health` → Returns `{"status":"ok"}`

---

## ✅ Verification After Deployment

```bash
# Test backend is running
curl https://your-backend-url.onrender.com/api/health

# Should return:
# {"status":"ok","timestamp":"2024-..."}

# Test frontend loads
curl https://your-frontend-url.onrender.com
```

---

## 🆘 Troubleshooting

### "Cannot connect to MongoDB"
```
Solution:
1. Verify MONGODB_URI is correct
2. Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
3. Verify database user password
```

### "CORS error in browser"
```
Solution:
1. Verify CLIENT_URL matches your frontend domain exactly
2. Include https:// in the URL
3. Redeploy backend after changing CLIENT_URL
```

### "Socket connection failed"
```
Solution:
1. Verify VITE_SOCKET_URL is set
2. Use same URL as VITE_API_URL (minus /api if included)
3. Ensure both services are running
```

---

## 📱 Example: Complete Environment Setup

### Backend (.env on Render)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://collabbridge_user:MyP@ss123@collabbridge.abc123.mongodb.net/collabbridge?retryWrites=true&w=majority
JWT_SECRET=aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890abc123=
JWT_EXPIRES_IN=7d
CLIENT_URL=https://app-web.onrender.com
```

### Frontend (.env on Render)
```
VITE_API_URL=https://app-server.onrender.com
VITE_SOCKET_URL=https://app-server.onrender.com
```

---

## 🔒 Security Best Practices

✅ **DO:**
- Use strong, random JWT_SECRET
- Regenerate secrets periodically
- Use environment variables only (not hardcoded)
- Keep .env files local only (not in git)
- Rotate passwords after deployment

❌ **DON'T:**
- Commit .env files to git
- Use simple passwords or secrets
- Share credentials via email/chat
- Reuse secrets across projects
- Leave test credentials in production

---

## 📞 Quick Links

- Render Dashboard: https://dashboard.render.com
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Render Documentation: https://render.com/docs
- MongoDB Documentation: https://www.mongodb.com/docs/
- JWT Best Practices: https://tools.ietf.io/html/rfc7519

---

**Print this page for easy reference during deployment!**
