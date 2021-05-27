const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');

const shared = path.join(__dirname, '..', 'shared', 'src');
const frontend = path.join(__dirname, '..', 'frontend', 'src', 'shared');
const backend = path.join(__dirname, '..', 'backend', 'src', 'shared');

const log = (message) => {
  console.log(`[${new Date().toLocaleTimeString()}]`, message);
}

/**
 * Stolen from https://stackoverflow.com/a/22185855
 * @param {string} src  The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
const copyRecursiveSync = function(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName),
        path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

const sync = () => {
  log('Change detected');
  fs.rmdirSync(frontend, { recursive: true });
  fs.rmdirSync(backend, { recursive: true });
  copyRecursiveSync(shared, frontend);
  copyRecursiveSync(shared, backend);
}

log('Watching for changes in ' + shared.toString());
chokidar.watch(shared).on('all', () => sync());
