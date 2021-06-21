const debug = false;

function camelize(str) {
  return str
  .split('-')
  .map(
    (item, index) => index > 0 ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item.toLowerCase()
  ).join("");
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

          if (debug) {
            console.log("Found flag '" + flag.name + "'. Writing property '" + camelizedName + "' with value of true to args object.");
          }

          result[camelizedName] = true;
          argProcessed = true;
        }
      }
    }
    
    if(!argProcessed && args) {
      for (const arg of args) {
        if ('--' + arg.name === key) {
          i++;

          if(i >= input.length) {
            throw new Error('No value present for command-line argument:' + key);
          }

          const value = input[i];
          const camelizedName = camelize(arg.name);

          if (debug) {
            console.log("Found argument '" + arg.name + "'. Writing property '" + camelizedName + "' with value '" + value +"' to args object.");
          }

          result[camelizedName] = value;
          argProcessed = true;
        }
      }
    }

    if(!argProcessed) {
      throw new Error('Unknown command-line argument: ' + key);
    }
  }

  return result;
}

exports.parseArgs = parseArgs;