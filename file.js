const fs = require("fs"); //fs is Node.js's native file system module

module.exports = {
	read: {},
	write: {}
};

fs.readFile('/Users/joe/test.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(data)
})

//Read JSON files

//Write JSON files