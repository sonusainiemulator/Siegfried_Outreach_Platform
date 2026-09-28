const fs = require('fs');
const file = '/www/wwwroot/api.siegfriedoutreach.com/routes/oauth.routes.js';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("const mongoose = require('mongoose');")) {
  content = "const mongoose = require('mongoose');\n" + content;
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully prepended mongoose require to oauth.routes.js');
} else {
  console.log('mongoose already included');
}
