# RULES.md — Development, Documentation & Deployment Rules

## 📌 Standard Operating Rules

### 1. Documentation & Git Sync Rule
- **Rule**: Whenever documentation in `/www/wwwroot/siegfriedoutreach-docs` is modified locally, the agent MUST immediately build (`npm run build`) and push (`git push origin main`) to GitHub:
  - Repository: `https://github.com/sonusainiemulator/siegfriedoutreach-docs.git`
  - Target Branch: `main`

### 2. Bilingual Documentation Structure
- Every feature doc must have:
  - Overview & Features
  - Step-by-Step Walkthrough in **English** and **हिंदी** using `<Tabs>`
  - Concrete **Real-World Industry Use Cases & Practical Case Studies** (D2C, Service Agencies, Real Estate, Hospitals, EdTech)

### 3. UI/UX Excellence
- Premium aesthetics, glassmorphism, balanced grid layouts, dark mode support, and smooth micro-animations.
- No misaligned cards or squished containers.

### 4. Build Validation
- Always test with `npm run build` prior to production PM2 restarts.
