const fs = require("fs"); //fs is Node.js's native file system module
const logUtils = require('./logger.js');

module.exports = {
	readAsync: async file => {
		try
		{
			const data = await fs.promises.readFile(file);
			return JSON.parse(data);
		}
		catch(err) {throw err;}
	},
	readSync: file => {
		try
		{
			const data = fs.readFileSync(file);
			return JSON.parse(data);
		}
		catch(err) {throw err;}
	}
};