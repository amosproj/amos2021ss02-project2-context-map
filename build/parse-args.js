const debug = false;

function camelize(str) {
  return str
  .split('-')
  .map(
    (item, index) => index > 0 ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item.toLowerCase()
  ).join("");
}

function logFound(arg, key, value) {
  if (debug) {
    console.log("Found argument '" + arg + "'. Writing property '" + key + "' with value '" + value + "' to args object.");
  }
}

const parseArgs = function(input, flags, args) {
  const result = {};

  for (let i = 0; i < input.length; i++) {
    const key = input[i];
    let argProcessed = false;

    if (flags) {
      for (const flag of flags) {
        if ('--' + flag.name === key || (typeof flag.abbr === 'string' && '-' + flag.abbr === key)) {

          const camelizedName = camelize(flag.name);

          logFound(flag.name, camelizedName, 'true');

          result[camelizedName] = true;
          argProcessed = true;
        }
      }
    }
    
    if (!argProcessed && args) {
      for (const arg of args) {
        if ('--' + arg.name === key) {
          i++;

          if (i >= input.length) {
            throw new Error('No value present for command-line argument:' + key);
          }

          const value = input[i];
          const camelizedName = camelize(arg.name);

          logFound(arg.name, camelizedName, value);

          result[camelizedName] = value;
          argProcessed = true;
        }
      }
    }

    if (!argProcessed) {
      throw new Error('Unknown command-line argument: ' + key);
    }
  }

  return result;
}

exports.parseArgs = parseArgs;