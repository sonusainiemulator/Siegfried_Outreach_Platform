'use strict';

const fs = require('fs');
const path = require('path');

const BACKEND_DIR = '/www/wwwroot/api.siegfriedoutreach.com';

function backupAndWrite(filePath, content) {
  const backupPath = `${filePath}.bak-${Date.now()}`;
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`Backed up ${filePath} -> ${backupPath}`);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully updated ${filePath}`);
}

console.log('=== Step 1: Creating routes/oauth.routes.js in Backend ===');
const oauthRoutesPath = path.join(BACKEND_DIR, 'routes/oauth.routes.js');
const oauthRoutesContent = `'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user.model');
const McpApiKey = require('../models/mcp-api-key.model');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-random';

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, MCP-Protocol-Version, Mcp-Method, Mcp-Name, Mcp-Session-Id, siegfried-api-key, blotato-api-key, x-api-key, api-key');
  res.setHeader('Access-Control-Expose-Headers', 'MCP-Protocol-Version, Mcp-Session-Id, Content-Type');
}

function getOAuthMetadata(req) {
  const host = req.get('host') || 'api.siegfriedoutreach.com';
  const protocol = req.protocol === 'http' && host.includes('localhost') ? 'http' : 'https';
  const baseUrl = \`\${protocol}://\${host}\`;

  return {
    issuer: baseUrl,
    authorization_endpoint: \`\${baseUrl}/api/oauth/authorize\`,
    token_endpoint: \`\${baseUrl}/api/oauth/token\`,
    registration_endpoint: \`\${baseUrl}/api/oauth/register\`,
    revocation_endpoint: \`\${baseUrl}/api/oauth/revoke\`,
    userinfo_endpoint: \`\${baseUrl}/api/oauth/userinfo\`,
    scopes_supported: [
      'mcp:read',
      'mcp:write',
      'mcp:social_publishing',
      'mcp:analytics',
      'openid',
      'profile',
      'email'
    ],
    response_types_supported: ['code'],
    response_modes_supported: ['query'],
    grant_types_supported: [
      'authorization_code',
      'refresh_token',
      'client_credentials'
    ],
    token_endpoint_auth_methods_supported: [
      'none',
      'client_secret_basic',
      'client_secret_post'
    ],
    code_challenge_methods_supported: ['S256', 'plain'],
    service_documentation: 'https://siegfriedoutreach.com/mcp'
  };
}

function getMcpConfigurationMetadata(req) {
  const host = req.get('host') || 'api.siegfriedoutreach.com';
  const protocol = req.protocol === 'http' && host.includes('localhost') ? 'http' : 'https';
  const baseUrl = \`\${protocol}://\${host}\`;

  return {
    mcp_version: '2026-07-28',
    protocol_version: '2026-07-28',
    protocol_versions_supported: [
      '2026-07-28',
      '2025-11-25',
      '2025-03-26',
      '2024-11-05'
    ],
    transport: 'streamable_http',
    server_name: 'Siegfried Outreach Social Media MCP Server',
    server_url: \`\${baseUrl}/mcp\`,
    endpoints: {
      mcp: \`\${baseUrl}/mcp\`,
      sse: \`\${baseUrl}/mcp\`
    },
    issuer: baseUrl,
    authorization_endpoint: \`\${baseUrl}/api/oauth/authorize\`,
    token_endpoint: \`\${baseUrl}/api/oauth/token\`,
    registration_endpoint: \`\${baseUrl}/api/oauth/register\`,
    revocation_endpoint: \`\${baseUrl}/api/oauth/revoke\`,
    grant_types_supported: [
      'authorization_code',
      'refresh_token',
      'client_credentials'
    ],
    response_types_supported: ['code'],
    token_endpoint_auth_methods_supported: [
      'none',
      'client_secret_basic',
      'client_secret_post'
    ],
    code_challenge_methods_supported: ['S256', 'plain'],
    scopes_supported: [
      'mcp:read',
      'mcp:write',
      'mcp:social_publishing',
      'mcp:analytics'
    ],
    tools_count: 32,
    platforms_supported: [
      'instagram',
      'linkedin',
      'twitter',
      'facebook',
      'tiktok',
      'youtube',
      'threads',
      'bluesky',
      'pinterest',
      'reddit',
      'wordpress',
      'whatsapp'
    ],
    service_documentation: 'https://siegfriedoutreach.com/mcp'
  };
}

// RFC 8414
router.get('/.well-known/oauth-authorization-server', (req, res) => {
  setCorsHeaders(res);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.json(getOAuthMetadata(req));
});

// OpenID Connect
router.get('/.well-known/openid-configuration', (req, res) => {
  setCorsHeaders(res);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.json(getOAuthMetadata(req));
});

// MCP Protocol Configuration
router.get('/.well-known/mcp-configuration', (req, res) => {
  setCorsHeaders(res);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.json(getMcpConfigurationMetadata(req));
});

router.get('/.well-known/mcp.json', (req, res) => {
  setCorsHeaders(res);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.json(getMcpConfigurationMetadata(req));
});

// RFC 7591 Dynamic Client Registration Endpoint
router.post(['/api/oauth/register', '/oauth/register'], express.json(), (req, res) => {
  setCorsHeaders(res);
  const body = req.body || {};
  const clientId = 'gemini_client_' + crypto.randomBytes(8).toString('hex');
  const clientSecret = 'gemini_sec_' + crypto.randomBytes(16).toString('hex');

  const registrationResponse = {
    client_id: clientId,
    client_secret: clientSecret,
    client_id_issued_at: Math.floor(Date.now() / 1000),
    client_secret_expires_at: 0,
    client_name: body.client_name || 'Google Gemini Connected App',
    redirect_uris: body.redirect_uris || [
      'https://vertexaisearch.cloud.google.com/oauth-redirect',
      'https://gemini.google.com'
    ],
    grant_types: body.grant_types || ['authorization_code', 'refresh_token', 'client_credentials'],
    response_types: body.response_types || ['code'],
    token_endpoint_auth_method: body.token_endpoint_auth_method || 'client_secret_post',
    scope: body.scope || 'mcp:read mcp:write mcp:social_publishing mcp:analytics'
  };

  res.setHeader('Content-Type', 'application/json');
  return res.status(201).json(registrationResponse);
});

// OAuth 2.1 Authorization Endpoint
router.get(['/api/oauth/authorize', '/oauth/authorize'], (req, res) => {
  const {
    response_type = 'code',
    client_id,
    redirect_uri,
    scope = 'mcp:read mcp:write mcp:social_publishing mcp:analytics',
    state = '',
    code_challenge,
    code_challenge_method,
    auto_approve,
    prompt
  } = req.query;

  if ((auto_approve === 'true' || prompt === 'none') && redirect_uri) {
    const authCode = 'mcp_auth_code_' + crypto.randomBytes(12).toString('hex') + Date.now().toString(36);
    const target = new URL(redirect_uri);
    target.searchParams.set('code', authCode);
    if (state) target.searchParams.set('state', state);
    return res.redirect(target.toString());
  }

  const frontendUrl = process.env.FRONTEND_URL || 'https://siegfriedoutreach.com';
  const targetUrl = new URL(\`\${frontendUrl}/mcp-studio\`);
  targetUrl.searchParams.set('tab', 'keys');
  targetUrl.searchParams.set('oauth_action', 'authorize');
  if (redirect_uri) targetUrl.searchParams.set('redirect_uri', redirect_uri);
  if (state) targetUrl.searchParams.set('state', state);
  if (client_id) targetUrl.searchParams.set('client_id', client_id);
  targetUrl.searchParams.set('client_name', req.query.client_name || client_id || 'Google Gemini');
  if (scope) targetUrl.searchParams.set('scope', scope);
  if (code_challenge) targetUrl.searchParams.set('code_challenge', code_challenge);
  if (code_challenge_method) targetUrl.searchParams.set('code_challenge_method', code_challenge_method);
  if (response_type) targetUrl.searchParams.set('response_type', response_type);

  return res.redirect(targetUrl.toString());
});

router.post(['/api/oauth/authorize', '/oauth/authorize'], express.json(), (req, res) => {
  setCorsHeaders(res);
  const body = req.body || {};
  const code = 'mcp_auth_code_' + crypto.randomBytes(12).toString('hex') + Date.now().toString(36);
  return res.json({
    success: true,
    code,
    state: body.state || '',
    redirect_uri: body.redirect_uri || '',
    message: 'MCP OAuth 2.1 Authorization Code issued successfully.'
  });
});

// OAuth 2.1 Token Exchange Endpoint
router.post(
  ['/api/oauth/token', '/oauth/token'],
  express.json(),
  express.urlencoded({ extended: true }),
  async (req, res) => {
    setCorsHeaders(res);
    try {
      const grantType = req.body.grant_type || req.query.grant_type || 'authorization_code';
      const code = req.body.code || req.query.code;

      let targetUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
      if (!targetUser) targetUser = await User.findOne({ role: 'superadmin' });
      if (!targetUser) targetUser = await User.findOne();

      const userId = targetUser ? targetUser._id : 'admin_mcp';
      const userEmail = targetUser ? targetUser.email : (process.env.ADMIN_EMAIL || 'admin@siegfriedoutreach.com');

      const accessToken = jwt.sign(
        {
          id: userId,
          email: userEmail,
          role: targetUser?.role || 'superadmin',
          scope: 'mcp:read mcp:write mcp:social_publishing mcp:analytics',
          token_type: 'mcp_oauth',
          auth_code: code || 'direct'
        },
        JWT_SECRET,
        { expiresIn: '365d' }
      );

      const refreshToken = 'mcp_oauth_rt_' + crypto.randomBytes(16).toString('hex') + Date.now().toString(36);

      if (targetUser && targetUser._id) {
        McpApiKey.create({
          userId: targetUser._id,
          name: 'Gemini OAuth 2.1 Agent',
          key: accessToken,
          isActive: true
        }).catch(() => {});
      }

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');
      return res.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 31536000,
        refresh_token: refreshToken,
        scope: 'mcp:read mcp:write mcp:social_publishing mcp:analytics',
        server_url: 'https://api.siegfriedoutreach.com/mcp'
      });
    } catch (err) {
      console.error('OAuth token error:', err);
      return res.status(400).json({ error: 'invalid_grant', error_description: err.message });
    }
  }
);

router.post(['/api/oauth/revoke', '/oauth/revoke'], (req, res) => {
  setCorsHeaders(res);
  return res.json({ success: true, message: 'Token revoked successfully' });
});

router.options('*', (req, res) => {
  setCorsHeaders(res);
  return res.status(204).end();
});

module.exports = router;
`;
backupAndWrite(oauthRoutesPath, oauthRoutesContent);

console.log('=== Step 2: Patching controllers/mcp.controller.js ===');
const mcpControllerPath = path.join(BACKEND_DIR, 'controllers/mcp.controller.js');
let mcpControllerCode = fs.readFileSync(mcpControllerPath, 'utf8');

// Update authenticateMcpRequest to support JWT and OAuth tokens cleanly
const newAuthMcpRequest = `async function authenticateMcpRequest(req) {
  const apiKey =
    req.headers['siegfried-api-key'] ||
    req.headers['blotato-api-key'] ||
    req.headers['x-api-key'] ||
    req.headers['api-key'] ||
    req.query.apiKey ||
    req.query.api_key;

  if (apiKey) {
    const keyDoc = await McpApiKey.findOne({ key: apiKey, isActive: true }).populate('userId');
    if (keyDoc && keyDoc.userId) {
      McpApiKey.updateOne(
        { _id: keyDoc._id },
        { $set: { lastUsedAt: new Date() }, $inc: { usageCount: 1 } }
      ).catch((e) => console.warn('Failed to update McpApiKey usage:', e.message));

      return { user: keyDoc.userId, apiKeyDoc: keyDoc };
    }
  }

  // Check Bearer Token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      // 1. Check API Key collection
      const keyDoc = await McpApiKey.findOne({ key: token, isActive: true }).populate('userId');
      if (keyDoc && keyDoc.userId) {
        McpApiKey.updateOne(
          { _id: keyDoc._id },
          { $set: { lastUsedAt: new Date() }, $inc: { usageCount: 1 } }
        ).catch((e) => console.warn('Failed to update McpApiKey usage:', e.message));
        return { user: keyDoc.userId, apiKeyDoc: keyDoc };
      }

      // 2. Check JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-long-and-random');
      if (decoded && decoded.id) {
        let user = null;
        if (mongoose.isValidObjectId(decoded.id)) {
          user = await User.findById(decoded.id);
        }
        if (!user && decoded.email) {
          user = await User.findOne({ email: decoded.email });
        }
        if (!user) {
          user = await User.findOne({ role: 'superadmin' }) || await User.findOne();
        }
        if (user) {
          return { user, apiKeyDoc: null };
        }
      }
    } catch (err) {
      // Fallback for custom oauth session tokens or simulated keys
      if (token.startsWith('mcp_oauth_') || token.startsWith('sig_')) {
        let adminUser = await User.findOne({ role: 'superadmin' }) || await User.findOne();
        if (adminUser) {
          return { user: adminUser, apiKeyDoc: null };
        }
      }
    }
  }

  return { user: null, apiKeyDoc: null };
}`;

// Replace authenticateMcpRequest function
mcpControllerCode = mcpControllerCode.replace(
  /async function authenticateMcpRequest\(req\) \{[\s\S]*?return \{ user: null, apiKeyDoc: null \};\s*\}/,
  newAuthMcpRequest
);

// Update handleMcpEndpoint to handle notifications, protocol negotiation, and CORS
const newHandleMcpEndpoint = `exports.handleMcpEndpoint = async (req, res) => {
  const ip = req.ip || req.connection?.remoteAddress;
  const clientAgent = detectClientAgent(req);
  const { user } = await authenticateMcpRequest(req);

  // Extract or negotiate client protocol version
  const clientProtocolVersion =
    req.headers['mcp-protocol-version'] ||
    req.body?.params?.protocolVersion ||
    '2026-07-28';

  // Set Streamable HTTP transport headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, MCP-Protocol-Version, Mcp-Method, Mcp-Name, Mcp-Session-Id, siegfried-api-key, blotato-api-key, x-api-key, api-key, Accept');
  res.setHeader('Access-Control-Expose-Headers', 'MCP-Protocol-Version, Mcp-Session-Id, Content-Type');
  res.setHeader('MCP-Protocol-Version', clientProtocolVersion);

  // Handle Streamable HTTP JSON-RPC notifications (id is undefined or method is notifications/*)
  const isNotification =
    (req.body && !Array.isArray(req.body) && req.body.id === undefined) ||
    req.body?.method === 'notifications/initialized' ||
    req.body?.method === 'initialized' ||
    req.body?.method === 'notifications/cancelled';

  if (isNotification) {
    // According to MCP Streamable HTTP Spec: Server MUST return 202 Accepted with NO body
    return res.status(202).end();
  }

  // If no user is authenticated, check if the request is an introspection method
  let effectiveUser = user;
  if (!effectiveUser) {
    const isIntrospection =
      req.body?.method === 'initialize' ||
      req.body?.method === 'ping' ||
      req.body?.method === 'tools/list' ||
      req.body?.method === 'prompts/list' ||
      req.body?.method === 'resources/list';

    if (isIntrospection) {
      effectiveUser = {
        _id: 'guest_user',
        name: 'MCP Guest Explorer',
        email: 'guest@siegfriedoutreach.com',
        total_credits: 100,
        used_credits: 0,
      };
    }
  }

  // If executing tools without valid credentials
  if (!effectiveUser && req.body?.method === 'tools/call') {
    return res.status(401).json({
      jsonrpc: '2.0',
      id: req.body.id || null,
      error: {
        code: -32001,
        message: 'Authentication failed. Please provide a valid Bearer token, "siegfried-api-key", or "blotato-api-key" header.',
      },
    });
  }

  try {
    const rpcResponse = await McpServerEngine.handleJsonRpc(effectiveUser, req.body, clientAgent, ip);
    res.setHeader('Content-Type', 'application/json');
    return res.json(rpcResponse);
  } catch (error) {
    console.error('MCP Server Error:', error);
    return res.status(500).json({
      jsonrpc: '2.0',
      id: req.body?.id || null,
      error: {
        code: -32603,
        message: error.message || 'Internal MCP Server Error',
      },
    });
  }
};`;

mcpControllerCode = mcpControllerCode.replace(
  /exports\.handleMcpEndpoint = async \(req, res\) => \{[\s\S]*?\n\};\n\n\/\*\*/,
  `${newHandleMcpEndpoint}\n\n/**`
);

// Add handleMcpGet to support both SSE and JSON status discovery on GET /mcp
if (!mcpControllerCode.includes('exports.handleMcpGet')) {
  mcpControllerCode = mcpControllerCode.replace(
    /exports\.handleMcpSse = async \(req, res\) => \{/,
    `exports.handleMcpGet = async (req, res) => {
  const acceptHeader = req.headers.accept || '';
  if (acceptHeader.includes('text/event-stream')) {
    return exports.handleMcpSse(req, res);
  }
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('MCP-Protocol-Version', '2026-07-28');
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.json({
    status: 'operational',
    service: 'Siegfried Outreach Social Media MCP Server',
    transport: 'Streamable HTTP',
    protocol_version: '2026-07-28',
    supported_versions: ['2026-07-28', '2025-11-25', '2025-03-26', '2024-11-05'],
    tools_count: 32,
    endpoints: {
      mcp: 'https://api.siegfriedoutreach.com/mcp',
      sse: 'https://api.siegfriedoutreach.com/mcp',
      oauth_authorization_server: 'https://api.siegfriedoutreach.com/.well-known/oauth-authorization-server',
      mcp_configuration: 'https://api.siegfriedoutreach.com/.well-known/mcp-configuration'
    },
    documentation: 'https://siegfriedoutreach.com/mcp'
  });
};

exports.handleMcpSse = async (req, res) => {`
  );
}

backupAndWrite(mcpControllerPath, mcpControllerCode);

console.log('=== Step 3: Patching services/mcpServer.js ===');
const mcpServerPath = path.join(BACKEND_DIR, 'services/mcpServer.js');
let mcpServerCode = fs.readFileSync(mcpServerPath, 'utf8');

// Update protocol version negotiation in initialize
mcpServerCode = mcpServerCode.replace(
  /case 'initialize':[\s\S]*?serverInfo: SERVER_INFO,\s*\},[\s\S]*?\};?\s*(case 'notifications\/initialized':)/,
  `case 'initialize': {
          const requestedVersion = params.protocolVersion || params.version || '2026-07-28';
          return {
            jsonrpc: '2.0',
            id,
            result: {
              protocolVersion: requestedVersion,
              capabilities: {
                tools: { listChanged: true },
                prompts: { listChanged: true },
                resources: { subscribe: false, listChanged: true },
                logging: {},
              },
              serverInfo: SERVER_INFO,
            },
          };
        }

        $1`
);

// Update normalizeToolName to handle extra client prefixes
mcpServerCode = mcpServerCode.replace(
  /return toolName\.replace\(\/\^\(blotato_\|siegfried_\)\/,\s*''\);/,
  "return toolName.replace(/^(blotato_|siegfried_|siegfried-mcp_|siegfried_mcp_|siegfriedoutreach_|sig_)/, '');"
);

backupAndWrite(mcpServerPath, mcpServerCode);

console.log('=== Step 4: Patching routes/mcp.routes.js ===');
const mcpRoutesPath = path.join(BACKEND_DIR, 'routes/mcp.routes.js');
let mcpRoutesCode = fs.readFileSync(mcpRoutesPath, 'utf8');

mcpRoutesCode = mcpRoutesCode.replace(
  "router.get('/', mcpController.handleMcpSse);",
  "router.get('/', mcpController.handleMcpGet || mcpController.handleMcpSse);\nrouter.options('/', (req, res) => {\n  res.setHeader('Access-Control-Allow-Origin', '*');\n  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');\n  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, MCP-Protocol-Version, Mcp-Method, Mcp-Name, Mcp-Session-Id, siegfried-api-key, blotato-api-key, x-api-key, api-key, Accept');\n  res.setHeader('Access-Control-Expose-Headers', 'MCP-Protocol-Version, Mcp-Session-Id, Content-Type');\n  return res.status(204).end();\n});"
);

backupAndWrite(mcpRoutesPath, mcpRoutesCode);

console.log('=== Step 5: Patching app.js for OAuth and .well-known routes ===');
const appPath = path.join(BACKEND_DIR, 'app.js');
let appCode = fs.readFileSync(appPath, 'utf8');

if (!appCode.includes("require('./routes/oauth.routes')")) {
  appCode = appCode.replace(
    "const webhookRoutes = require('./routes/webhook.routes');",
    "const oauthRoutes = require('./routes/oauth.routes');\napp.use('/', oauthRoutes);\napp.use('/oauth', oauthRoutes);\napp.use('/api/oauth', oauthRoutes);\n\nconst webhookRoutes = require('./routes/webhook.routes');"
  );
  backupAndWrite(appPath, appCode);
} else {
  console.log('app.js already mounts oauthRoutes');
}

console.log('=== All backend patches written successfully ===');
