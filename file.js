const fs = require("fs"); //fs is Node.js's native file system module
const logUtils = require('./logger.js');
const dateUtils = require('./date.js');

module.exports = {
	readAsync: async file => {
		try
		{
			const data = await fs.promises.readFile(file);
			return JSON.parse(data);
		}
		catch(err) {logUtils.logger.log("[" + dateUtils.cen_time(new Date()).toISOString() + "] " + err);}
	},
	readSync: file => {
		try
		{
			const data = fs.readFileSync(file);
			return JSON.parse(data);
		}
		catch(err) {logUtils.logger.log("[" + dateUtils.cen_time(new Date()).toISOString() + "] " + err);}
	},
	writeAsync: async (file, data) => {
		try
		{
			await fs.promises.writeFile(file, JSON.stringify(data, null, 4));
		}
		catch(err) {logUtils.logger.log("[" + dateUtils.cen_time(new Date()).toISOString() + "] " + err);}
	},
	writeSync: (file, data) => {
		try
		{
			fs.writeFileSync(file, JSON.stringify(data, null, 4));
		}
		catch(err) {logUtils.logger.log("[" + dateUtils.cen_time(new Date()).toISOString() + "] " + err);}
	}
};