const fs = require("fs"); //fs is Node.js's native file system module

module.exports = {
	readAsync: async file => {
		const data = await fs.promises.readFile(file);
		return JSON.parse(data);
	},
	readSync: file => {
		const data = fs.readFileSync(file);
		return JSON.parse(data);
	}
};