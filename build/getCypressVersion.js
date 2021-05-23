// If an error occurs, a value != 0 is returned -> No extra error handling
const { execSync } = require("child_process");
const { join } = require("path");

// Use this folder as cwd
process.chdir(join(__dirname, "..", "frontend"));

// List all dependencies containing 'cypress'-string
const list = execSync("yarn list --pattern cypress").toString();

// Regex to find out version
const version = list.match(/\scypress@(?<version>\d*\.\d*\.\d*)/).groups[
  "version"
];

if (!version) {
  throw "No cypress version found.";
}

// Print out version
console.log(version);
