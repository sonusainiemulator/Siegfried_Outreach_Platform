# AGENTS.md — Siegfried Outreach Platform Agent Directives

## 🤖 Directives for AI Agents & Pair Programmers

1. **Auto-Push Documentation to GitHub**:
   - Whenever `/www/wwwroot/siegfriedoutreach-docs` is edited, you must run `npm run build` and `git push origin main` to keep the live GitHub repository (`sonusainiemulator/siegfriedoutreach-docs`) 100% in sync.

2. **Full-Feature Coverage & Bilingual Standards**:
   - Every platform module (Social Studio, AI Social Manager, AI Tools, Campaign Hub, Security & Passkeys, MCP Studio, Analytics) must be thoroughly documented in both **English** and **हिंदी**.
   - Every single feature guide must feature concrete **Real-World Industry Use Cases & Case Studies** (D2C E-Commerce, Agencies, Healthcare, Real Estate, EdTech, B2B SaaS).

3. **Production Stability & Verification**:
   - Always run `npm run build` before restarting PM2 services (`pm2 restart all` or `pm2 restart frontend-app`).
   - Maintain 0 TypeScript and 0 Lint errors across both frontend and docs portals.
