// scripts/generate-readme-ts.js
const fs = require('fs');
const path = require('path');

const readmePath = path.join(__dirname, '../README.md');
const outPath = path.join(__dirname, '../components/readme-content.ts');

const readme = fs.readFileSync(readmePath, 'utf8');
const out = `// Auto-generated from README.md\nexport default ${JSON.stringify(readme)};\n`;

fs.writeFileSync(outPath, out, 'utf8');
console.log(`Wrote ${outPath}`);
