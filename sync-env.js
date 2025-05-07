const fs = require('fs');
const rootEnv = fs.readFileSync('../../.env', 'utf8');

const prefixedEnv = rootEnv.split('\n')
    .map(line => line.trim().startsWith('#') || !line.includes('=') ?
        line 
        : `VITE_${line}`)
        .join('\n')

fs.writeFileSync('.env', prefixedEnv);