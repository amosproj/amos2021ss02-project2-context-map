const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');

const source = path.join(__dirname, '..', 'shared', 'src');
const destinations = [
  path.join(__dirname, '..', 'frontend', 'src', 'shared'),
  path.join(__dirname, '..', 'backend', 'src', 'shared')
]

const log = (message) => {
  console.log(`[${new Date().toLocaleTimeString()}]`, message);
}

/**
 * @param {string} src  The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
const copyRecursiveSync = function(src, dest) {
  // stop if source does not exists
  if (!fs.existsSync(src)) return;

  if (fs.statSync(src).isDirectory()) {
    // if folder => copy folder
    fs.mkdirSync(dest);
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    // if file => copy it
    fs.copyFileSync(src, dest);
  }
};

// creates an exact copy of the source dir
const sync = () => {
  log('Change detected');
  for (const dest of destinations) {
    fs.rmdirSync(dest, { recursive: true });
    copyRecursiveSync(source, dest);
  }
}

log('Watching for changes in ' + source.toString());
// calls sync on all changes in the source dir (e.g. create file, edit file, delete file, ...)
chokidar.watch(source).on('all', () => sync());
