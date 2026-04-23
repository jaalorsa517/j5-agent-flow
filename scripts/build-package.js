import fs from 'fs';
import path from 'path';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const prodPkg = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  main: 'index.js', // Ajustado porque está dentro de la carpeta
  type: pkg.type,
  scripts: {
    start: 'node index.js'
  },
  dependencies: pkg.dependencies,
  engines: pkg.engines,
  author: pkg.author,
  license: pkg.license
};

if (!fs.existsSync('j5-agent-flow')) {
  fs.mkdirSync('j5-agent-flow');
}

fs.writeFileSync(
  path.join('j5-agent-flow', 'package.json'),
  JSON.stringify(prodPkg, null, 2)
);

console.log('package.json para producción generado en j5-agent-flow/');
