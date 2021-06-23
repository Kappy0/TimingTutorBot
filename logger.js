const fs = require("fs"); //fs is Node.js's native file system module
const dateUtils = require('./date.js');

const log_output = fs.createWriteStream('./logs/tt-log' + dateUtils.log_date(new Date()) + '.txt', {flags: 'a'});

exports.logger = new console.Console(log_output);