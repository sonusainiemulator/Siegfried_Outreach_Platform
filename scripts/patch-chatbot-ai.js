const fs = require('fs');
const path = require('path');

const BACKEND_DIR = '/www/wwwroot/api.siegfriedoutreach.com';

function run() {
  console.log('--- Step 1: Backup backend files ---');
  const controllerPath = path.join(BACKEND_DIR, 'controllers/chatbot.controller.js');
  const aiServicePath = path.join(BACKEND_DIR, 'services/aiChatService.js');

  fs.copyFileSync(controllerPath, `${controllerPath}.bak-20260915-ai`);
  fs.copyFileSync(aiServicePath, `${aiServicePath}.bak-20260915-ai`);
  console.log('Backups created successfully.');

  console.log('--- Step 2: Patch chatbot.controller.js ---');
  let controllerCode = fs.readFileSync(controllerPath, 'utf8');

  // 2a. In createChatbot, include persona and systemInstruction in new Chatbot(...)
  if (!controllerCode.includes('persona: req.body.persona || \'default\'')) {
    controllerCode = controllerCode.replace(
      /const chatbot = new Chatbot\(\{([\s\S]*?)name: name\.trim\(\),/,
      `const chatbot = new Chatbot({\n      persona: req.body.persona || 'default',\n      systemInstruction: req.body.systemInstruction || '',\n      name: name.trim(),`
    );
  }

  // 2b. In updateChatbot, handle trainingData parsing if string, and update persona/systemInstruction
  const updateChatbotTarget = `    const updateData = {};\n    if (name) updateData.name = name.trim();`;
  const updateChatbotReplacement = `    const updateData = {};
    if (name) updateData.name = name.trim();
    if (req.body.persona !== undefined) updateData.persona = req.body.persona;
    if (req.body.systemInstruction !== undefined) updateData.systemInstruction = req.body.systemInstruction;
    if (typeof trainingData === 'string') {
      try { trainingData = JSON.parse(trainingData); } catch (e) {}
    }`;
  if (controllerCode.includes(updateChatbotTarget) && !controllerCode.includes('updateData.systemInstruction = req.body.systemInstruction;')) {
    controllerCode = controllerCode.replace(updateChatbotTarget, updateChatbotReplacement);
  }

  // 2c. In getAllChatbots response projection, include persona, systemInstruction, config
  const getChatbotsProjectionTarget = `        provider: chatbot.provider,\n        appearance: {`;
  const getChatbotsProjectionReplacement = `        provider: chatbot.provider,
        persona: chatbot.persona || 'default',
        systemInstruction: chatbot.systemInstruction || '',
        config: chatbot.config,
        appearance: {`;
  if (controllerCode.includes(getChatbotsProjectionTarget)) {
    controllerCode = controllerCode.replace(getChatbotsProjectionTarget, getChatbotsProjectionReplacement);
  }

  // 2d. In getChatbotById response projection, include persona, systemInstruction
  const getChatbotByIdTarget = `        provider: chatbot.provider,\n        config: chatbot.config,`;
  const getChatbotByIdReplacement = `        provider: chatbot.provider,
        persona: chatbot.persona || 'default',
        systemInstruction: chatbot.systemInstruction || '',
        config: chatbot.config,`;
  if (controllerCode.includes(getChatbotByIdTarget) && !controllerCode.includes('persona: chatbot.persona || \'default\',\n        systemInstruction: chatbot.systemInstruction || \'\',\n        config: chatbot.config,')) {
    controllerCode = controllerCode.replace(getChatbotByIdTarget, getChatbotByIdReplacement);
  }

  // 2e. In updateChatbot response projection, include persona, systemInstruction
  const updateChatbotRespTarget = `        provider: chatbot.provider,\n        config: chatbot.config,\n        appearance: {`;
  const updateChatbotRespReplacement = `        provider: chatbot.provider,
        persona: chatbot.persona || 'default',
        systemInstruction: chatbot.systemInstruction || '',
        config: chatbot.config,
        appearance: {`;
  if (controllerCode.includes(updateChatbotRespTarget)) {
    controllerCode = controllerCode.replace(updateChatbotRespTarget, updateChatbotRespReplacement);
  }

  fs.writeFileSync(controllerPath, controllerCode, 'utf8');
  console.log('chatbot.controller.js patched successfully.');

  console.log('--- Step 3: Patch aiChatService.js ---');
  let aiServiceCode = fs.readFileSync(aiServicePath, 'utf8');

  // 3a. Increase token floor so answers are not cut off
  aiServiceCode = aiServiceCode.replace(
    /this\.maxTokens = chatbotConfig\.config\?\.maxTokens \|\| \d+;/,
    `this.maxTokens = Math.max(Number(chatbotConfig.config?.maxTokens) || 2000, 1000);`
  );

  // 3b. Improve getSystemPrompt
  const oldGetSystemPromptRegex = /getSystemPrompt\(\) \{[\s\S]*?return prompt;\n  \}/;
  const newGetSystemPrompt = `getSystemPrompt() {
    const botName = this.config.name || 'AI Assistant';
    const persona = this.config.persona || 'default';
    const basePersonaInstructions = {
      'event_planner': "You are the Party Planner. Your goal is to help users design and organize world-class events, from high-end weddings to professional corporate galas.",
      'nutritionist': "You are the Eat Right Guide. You provide expert dietary advice, personalized meal planning, and science-backed nutritional insights.",
      'finance_expert': "You are the Money Mentor. You assist with strategic budgeting, smart investments, and long-term financial planning.",
      'career_counselor': "You are the Career Boost Coach. You help users navigate their professional journey.",
      'time_management': "You are the Productivity Pro. You help users master their time and achieve peak efficiency.",
      'language_tutor': "You are the Language Buddy. You assist users in mastering new languages.",
      'cybersecurity_expert': "You are the Digital Security Expert. Your mission is to provide expert advice on cybersecurity.",
      'interior_designer': "You are the Home Design Helper. You help users transform their spaces into stunning environments.",
      'parenting_coach': "You are the Happy Family Guide. You provide compassionate, effective guidance on child-rearing.",
      'fitness_trainer': "You are the FitLife Trainer. You design elite workout routines.",
      'travel_advisor': "You are the Trip Planner. You create unforgettable travel experiences.",
      'sustainability_expert': "You are the Green Living Advisor. You provide expert advice on sustainable practices.",
      'image_generator': "You are the Pixel Art Creator. Your sole purpose is to generate images. If the user wants an image, respond ONLY with 'GENERATE: [prompt]'.",
      'default': \`You are \${botName}, a knowledgeable, professional, and friendly AI assistant representing \${botName}.\`
    };

    const personaInstruction = basePersonaInstructions[persona] || basePersonaInstructions['default'];
    const customInstruction = this.config.systemInstruction ? String(this.config.systemInstruction).trim() : '';

    const currentDate = new Date().toDateString();
    const currentTime = new Date().toLocaleTimeString();

    let prompt = \`You are \${botName}.
Current Date: \${currentDate}. Current Time: \${currentTime}.

[CORE IDENTITY & PERSONA]
\${personaInstruction}\`;

    if (customInstruction) {
      prompt += \`\\n\\n[CUSTOM INSTRUCTIONS & DIRECTIVES]\\n\${customInstruction}\`;
    }

    const trainingContext = this.formatTrainingData();
    if (trainingContext.trim()) {
      prompt += \`\\n\\n[VERIFIED KNOWLEDGE BASE & FACTS]
You MUST prioritize and ground your answers in the following verified knowledge base:
\${trainingContext}
If the user's question relates to topics covered in this knowledge base, answer accurately and faithfully based on these facts. Do not invent contradictory facts.\`;
    }

    prompt += \`\\n\\n[COMMUNICATION GUIDELINES]
1. Provide helpful, direct, and well-structured responses using markdown formatting.
2. If the user asks about booking, appointments, scheduling a call, pricing, or consulting, warmly provide the appointment link (e.g., Calendly) if available in your instructions or knowledge base.
3. Maintain high professionalism and warmth.\`;

    return prompt;
  }`;

  aiServiceCode = aiServiceCode.replace(oldGetSystemPromptRegex, newGetSystemPrompt);
  fs.writeFileSync(aiServicePath, aiServiceCode, 'utf8');
  console.log('aiChatService.js patched successfully.');
}

run();
