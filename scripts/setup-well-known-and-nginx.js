'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BACKEND_DIR = '/www/wwwroot/api.siegfriedoutreach.com';
const FRONTEND_DIR = '/www/wwwroot/siegfriedoutreach.com';

const oauthMetadata = {
  issuer: 'https://api.siegfriedoutreach.com',
  authorization_endpoint: 'https://api.siegfriedoutreach.com/api/oauth/authorize',
  token_endpoint: 'https://api.siegfriedoutreach.com/api/oauth/token',
  registration_endpoint: 'https://api.siegfriedoutreach.com/api/oauth/register',
  revocation_endpoint: 'https://api.siegfriedoutreach.com/api/oauth/revoke',
  userinfo_endpoint: 'https://api.siegfriedoutreach.com/api/oauth/userinfo',
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

const mcpMetadata = {
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
  server_url: 'https://api.siegfriedoutreach.com/mcp',
  endpoints: {
    mcp: 'https://api.siegfriedoutreach.com/mcp',
    sse: 'https://api.siegfriedoutreach.com/mcp'
  },
  issuer: 'https://api.siegfriedoutreach.com',
  authorization_endpoint: 'https://api.siegfriedoutreach.com/api/oauth/authorize',
  token_endpoint: 'https://api.siegfriedoutreach.com/api/oauth/token',
  registration_endpoint: 'https://api.siegfriedoutreach.com/api/oauth/register',
  revocation_endpoint: 'https://api.siegfriedoutreach.com/api/oauth/revoke',
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

function writeStaticFiles(dir) {
  const wellKnownDir = path.join(dir, '.well-known');
  if (!fs.existsSync(wellKnownDir)) {
    fs.mkdirSync(wellKnownDir, { recursive: true });
  }

  fs.writeFileSync(path.join(wellKnownDir, 'oauth-authorization-server'), JSON.stringify(oauthMetadata, null, 2), 'utf8');
  fs.writeFileSync(path.join(wellKnownDir, 'openid-configuration'), JSON.stringify(oauthMetadata, null, 2), 'utf8');
  fs.writeFileSync(path.join(wellKnownDir, 'mcp-configuration'), JSON.stringify(mcpMetadata, null, 2), 'utf8');
  fs.writeFileSync(path.join(wellKnownDir, 'mcp.json'), JSON.stringify(mcpMetadata, null, 2), 'utf8');
  console.log(`Created static .well-known files in ${wellKnownDir}`);
}

console.log('Writing static .well-known files...');
writeStaticFiles(BACKEND_DIR);
writeStaticFiles(path.join(FRONTEND_DIR, 'public'));

console.log('Updating Nginx config for api.siegfriedoutreach.com...');
const apiNginxConfPath = '/www/server/panel/vhost/nginx/api.siegfriedoutreach.com.conf';
if (fs.existsSync(apiNginxConfPath)) {
  let conf = fs.readFileSync(apiNginxConfPath, 'utf8');
  
  conf = conf.replace(
    /location \^~ \/\.well-known\/acme-challenge\/[\s\S]*?proxy_set_header X-Forwarded-Proto \$scheme;\s*\}/,
    `location ^~ /.well-known/acme-challenge/ {
        allow all;
    }

    location ^~ /.well-known/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        default_type application/json;
    }`
  );
  fs.writeFileSync(apiNginxConfPath, conf, 'utf8');
  console.log('Updated api.siegfriedoutreach.com.conf successfully');
}

console.log('Updating Nginx config for siegfriedoutreach.com...');
const frontendNginxConfPath = '/www/server/panel/vhost/nginx/siegfriedoutreach.com.conf';
if (fs.existsSync(frontendNginxConfPath)) {
  let conf = fs.readFileSync(frontendNginxConfPath, 'utf8');
  conf = conf.replace(
    /location \^~ \/\.well-known\/acme-challenge\/[\s\S]*?proxy_set_header X-Forwarded-Proto \$scheme;\s*\}/,
    `location ^~ /.well-known/acme-challenge/ {
        allow all;
    }

    location ^~ /.well-known/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        default_type application/json;
    }`
  );
  fs.writeFileSync(frontendNginxConfPath, conf, 'utf8');
  console.log('Updated siegfriedoutreach.com.conf successfully');
}

try {
  console.log('Reloading Nginx...');
  execSync('/www/server/nginx/sbin/nginx -s reload');
  console.log('Nginx reloaded successfully');
} catch (e) {
  console.warn('Nginx reload warning:', e.message);
}
