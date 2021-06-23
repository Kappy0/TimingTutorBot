const fs = require("fs");
const fileUtils = require('../file.js');

const mockJSON = {some_id: "abcdef", another_id: "ghijkl"};

describe('testing reading files', () => {
	test('reads file data asynchronously', async () => {
		let mockData = await fileUtils.readAsync('./tests/mock.json');

		expect(mockData).toStrictEqual(mockJSON);
	});

	test('reads file data synchronously', () => {
		let mockData = fileUtils.readSync('./tests/mock.json');

		expect(mockData).toStrictEqual(mockJSON);
	});
});

describe('testing writing to files', () => {
	test('writes to files asynchronously', async () => {

	});

	test('writes to files synchronously', () => {

	});
});