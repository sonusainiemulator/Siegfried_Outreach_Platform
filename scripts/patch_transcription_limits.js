const fs = require('fs');
const path = require('path');

console.log('=== Starting Transcription Limits Patch ===');

// 1. Patch utils/upload.js in backend
const uploadPath = '/www/wwwroot/api.siegfriedoutreach.com/utils/upload.js';
if (fs.existsSync(uploadPath)) {
  let uploadContent = fs.readFileSync(uploadPath, 'utf8');

  // Backup original
  if (!fs.existsSync(uploadPath + '.bak_pre_500mb')) {
    fs.writeFileSync(uploadPath + '.bak_pre_500mb', uploadContent, 'utf8');
  }

  // A. Expand mimeToExtension if not already containing quicktime
  if (!uploadContent.includes("'video/quicktime': 'mov'")) {
    uploadContent = uploadContent.replace(
      "'video/mov': 'mov',",
      "'video/mov': 'mov',\n  'video/quicktime': 'mov',\n  'video/x-msvideo': 'avi',\n  'video/x-matroska': 'mkv',"
    );
    uploadContent = uploadContent.replace(
      "'audio/m4a': 'm4a',",
      "'audio/m4a': 'm4a',\n  'audio/x-m4a': 'm4a',\n  'audio/aac': 'aac',\n  'audio/flac': 'flac',\n  'audio/wave': 'wav',\n  'audio/x-wav': 'wav',\n  'audio/mp4': 'm4a',"
    );
    console.log('Added extended audio and video mime types to upload.js');
  }

  // B. Ensure maxCustom is at least 500MB
  uploadContent = uploadContent.replace(
    /Math\.max\(docLimit,\s*audLimit,\s*vidLimit,\s*imgLimit,\s*50\s*\*\s*1024\s*\*\s*1024\)/g,
    'Math.max(docLimit, audLimit, vidLimit, imgLimit, 500 * 1024 * 1024)'
  );

  // C. Update asyncFileFilter to always allow audio/video formats for media processing
  if (!uploadContent.includes('const isAudioOrVideo =')) {
    const filterTarget = `const asyncFileFilter = async (req, file, cb) => {
  const { allowedTypes } = await getDynamicSettings();
  const ext = (mimeToExtension[file.mimetype] || path.extname(file.originalname).slice(1)).toLowerCase();

  if (allowedTypes.length === 0 || allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(\`File type '\${ext}' is not allowed.\`), false);
  }
};`;

    const filterReplacement = `const asyncFileFilter = async (req, file, cb) => {
  const { allowedTypes } = await getDynamicSettings();
  const ext = (mimeToExtension[file.mimetype] || path.extname(file.originalname).slice(1)).toLowerCase();
  const isAudioOrVideo = (file.mimetype && (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('video/'))) ||
    ['mp3', 'wav', 'm4a', 'ogg', 'flac', 'aac', 'mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext);

  if (allowedTypes.length === 0 || allowedTypes.includes(ext) || isAudioOrVideo) {
    cb(null, true);
  } else {
    cb(new Error(\`File type '\${ext}' is not allowed.\`), false);
  }
};`;

    if (uploadContent.includes(filterTarget)) {
      uploadContent = uploadContent.replace(filterTarget, filterReplacement);
      console.log('Updated asyncFileFilter to permit audio/video types in upload.js');
    }
  }

  // D. Update uploadSingle signature and logic to accept customMaxSize
  const uploadSingleTarget = `const uploadSingle = (subfolder = '', fieldName = 'file', isStatus = false) => {
  return async (req, res, next) => {
    const { limits } = await getDynamicSettings();
    const maxSize = Math.max(...Object.values(limits));

    const upload = multer({
      storage: createUploader(subfolder),
      fileFilter,
      limits: { fileSize: maxSize, files: 1 },
    }).single(fieldName);

    upload(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      if (req.file) {
        const file = req.file;
        const type = getTypePrefix(file.mimetype);
        const allowedSize = (limits[type] || limits.file);

        if (file.size > allowedSize) {
          fs.unlinkSync(file.path);
          return res.status(400).json({ message: \`\${file.originalname} is too large.\` });
        }
      }

      next();
    });
  };
};`;

  const uploadSingleReplacement = `const uploadSingle = (subfolder = '', fieldName = 'file', isStatus = false, customMaxSize = null) => {
  return async (req, res, next) => {
    const { limits } = await getDynamicSettings();
    const effectiveMaxSize = customMaxSize || Math.max(...Object.values(limits));

    const upload = multer({
      storage: createUploader(subfolder),
      fileFilter,
      limits: { fileSize: effectiveMaxSize, files: 1 },
    }).single(fieldName);

    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          const maxMB = (effectiveMaxSize / (1024 * 1024)).toFixed(0);
          return res.status(400).json({ message: \`File too large. Maximum allowed size is \${maxMB} MB.\` });
        }
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message || 'Upload failed' });
      }

      if (req.file) {
        const file = req.file;
        const type = getTypePrefix(file.mimetype);
        const allowedSize = customMaxSize || (limits[type] || limits.file);

        if (file.size > allowedSize) {
          try { fs.unlinkSync(file.path); } catch (e) {}
          const maxMB = (allowedSize / (1024 * 1024)).toFixed(0);
          const fileMB = (file.size / (1024 * 1024)).toFixed(2);
          return res.status(400).json({ message: \`\${file.originalname} is too large (\${fileMB} MB). Maximum allowed size is \${maxMB} MB.\` });
        }
      }

      next();
    });
  };
};`;

  if (uploadContent.includes(uploadSingleTarget)) {
    uploadContent = uploadContent.replace(uploadSingleTarget, uploadSingleReplacement);
    console.log('Updated uploadSingle in upload.js to accept customMaxSize parameter');
  }

  fs.writeFileSync(uploadPath, uploadContent, 'utf8');
  console.log('Successfully saved updated upload.js');
}

// 2. Patch routes/ai-content.routes.js in backend
const routesPath = '/www/wwwroot/api.siegfriedoutreach.com/routes/ai-content.routes.js';
if (fs.existsSync(routesPath)) {
  let routesContent = fs.readFileSync(routesPath, 'utf8');

  // Backup original
  if (!fs.existsSync(routesPath + '.bak_pre_500mb')) {
    fs.writeFileSync(routesPath + '.bak_pre_500mb', routesContent, 'utf8');
  }

  const oldRoute = "uploadSingle('audio', 'file'), aiContentController.transcribeAudio";
  const newRoute = "uploadSingle('audio', 'file', false, 500 * 1024 * 1024), aiContentController.transcribeAudio";

  if (routesContent.includes(oldRoute)) {
    routesContent = routesContent.replace(oldRoute, newRoute);
    fs.writeFileSync(routesPath, routesContent, 'utf8');
    console.log('Successfully updated /transcribe route in ai-content.routes.js to 500MB limit');
  } else {
    console.log('ai-content.routes.js already configured or route line different');
  }
}

// 3. Patch app.js in backend
const appPath = '/www/wwwroot/api.siegfriedoutreach.com/app.js';
if (fs.existsSync(appPath)) {
  let appContent = fs.readFileSync(appPath, 'utf8');

  // Backup original
  if (!fs.existsSync(appPath + '.bak_pre_500mb')) {
    fs.writeFileSync(appPath + '.bak_pre_500mb', appContent, 'utf8');
  }

  appContent = appContent.replace(
    "app.use(express.json({ limit: '50mb' }));",
    "app.use(express.json({ limit: '500mb' }));"
  );
  appContent = appContent.replace(
    "app.use(express.urlencoded({ limit: '50mb', extended: true }));",
    "app.use(express.urlencoded({ limit: '500mb', extended: true }));"
  );

  fs.writeFileSync(appPath, appContent, 'utf8');
  console.log('Successfully updated app.js express body parser limits to 500mb');
}

// 4. Patch controllers/ai-content.controller.js in backend
const controllerPath = '/www/wwwroot/api.siegfriedoutreach.com/controllers/ai-content.controller.js';
if (fs.existsSync(controllerPath)) {
  let controllerContent = fs.readFileSync(controllerPath, 'utf8');

  if (controllerContent.includes("duration: parseFloat(info.format?.duration || 0)")) {
    controllerContent = controllerContent.replace(
      "duration: parseFloat(info.format?.duration || 0)",
      "duration: parseFloat(info.format?.duration || info.streams?.[0]?.duration || 0)"
    );
    fs.writeFileSync(controllerPath, controllerContent, 'utf8');
    console.log('Enhanced audio duration extraction fallback in ai-content.controller.js');
  }
}

console.log('=== Transcription Limits Patch Finished ===');
