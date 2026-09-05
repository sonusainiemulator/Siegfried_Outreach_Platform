# Mandatory Rule: Documentation Updates & Automatic GitHub Push

## 🎯 Scope & Trigger
Whenever any documentation file (`.mdx`, `.json`, `.tsx`, `.ts`, or assets) inside `/www/wwwroot/siegfriedoutreach-docs` is created, updated, or deleted, you **MUST ALWAYS** follow these steps:

---

## 📋 Mandatory Execution Steps:

1. **Verify Build**:
   ```bash
   cd /www/wwwroot/siegfriedoutreach-docs
   npm run build
   ```
   Ensure `0 errors` and all static pages (SSG) compile cleanly.

2. **Stage & Commit**:
   ```bash
   cd /www/wwwroot/siegfriedoutreach-docs
   git add .
   git commit -m "docs: <concise summary of changes>"
   ```

3. **Automatic Push to GitHub**:
   ```bash
   cd /www/wwwroot/siegfriedoutreach-docs
   git push origin main
   ```
   Always ensure local updates are pushed immediately to `https://github.com/sonusainiemulator/siegfriedoutreach-docs.git`.

4. **Bilingual Requirement**:
   - All documentation guides MUST contain dual-language (**English & हिंदी**) tabs using `<Tabs items={['English Guide', 'हिंदी गाइड']}>`.
   - Every feature must include a dedicated **"🏢 Real-World Use Cases & Practical Case Studies (वास्तविक उपयोग और केस स्टडी)"** section.

5. **AI Assistant Sync**:
   - Ensure `AiDocsAssistant.tsx` knowledge base is updated if new key features or routes are added.
