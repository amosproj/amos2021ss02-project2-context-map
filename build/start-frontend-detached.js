// If an error occurs, a value != 0 is returned -> No extra error handling
const { exec } = require("child_process");
const { join } = require("path");

process.chdir(join(__dirname, "..", "frontend"));

exec("yarn run start:forTests")
