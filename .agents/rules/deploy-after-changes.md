# Deploy After Every Change

## Rule: Always rebuild and restart after code changes

This project runs in **production mode** via PM2:
- **Frontend**: `/www/wwwroot/siegfriedoutreach.com` → `next start -p 3000` (PM2 process: `frontend-app`)
- **Backend**: `/www/wwwroot/api.siegfriedoutreach.com` → Node.js Express (PM2 process: `api-backend`)

### After ANY frontend code change (.tsx, .ts, .css, etc.)

ALWAYS run these two steps **before considering the task complete**:

```bash
cd /www/wwwroot/siegfriedoutreach.com && npm run build 2>&1
pm2 restart frontend-app
```

### After ANY backend code change (.js files in api.siegfriedoutreach.com)

ALWAYS restart the backend **before considering the task complete**:

```bash
pm2 restart api-backend
```

### After changes to BOTH frontend AND backend

```bash
cd /www/wwwroot/siegfriedoutreach.com && npm run build 2>&1
pm2 restart frontend-app
pm2 restart api-backend
```

### Verification

Always verify the process is online:

```bash
pm2 list
```

NEVER finish a task involving code changes without completing the rebuild/restart.
Changes are invisible to users until the production bundle is regenerated and PM2 is restarted.
