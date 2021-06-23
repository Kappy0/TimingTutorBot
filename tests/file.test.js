const fs = require("fs");
const fileUtils = require('../file.js');

const mockReadJSON = {some_id: "abcdef", another_id: "ghijkl"};

describe('testing reading files', () => {
	test('reads file data asynchronously', async () => {
		const mockData = await fileUtils.readAsync('./tests/mockRead.json');

		expect(mockData).toStrictEqual(mockReadJSON);
	});

	test('reads file data synchronously', () => {
		const mockData = fileUtils.readSync('./tests/mockRead.json');

		expect(mockData).toStrictEqual(mockReadJSON);
	});
});

describe('testing writing to files', () => {
	test('writes to files asynchronously', async () => {
		const number = Math.random();
		const mockWriteJSON = {some_id: number};

		await fileUtils.writeAsync('./tests/mockWrite.json', mockWriteJSON);

		let mockData = fileUtils.readSync('./tests/mockWrite.json');

		expect(mockData.some_id).toBe(number);
	});

	test('writes to files synchronously', () => {
		const number = Math.random();
		const mockWriteJSON = {another_id: number};

		fileUtils.writeSync('./tests/mockWrite.json', mockWriteJSON);

		let mockData = fileUtils.readSync('./tests/mockWrite.json');

		expect(mockData.another_id).toBe(number);
	});
});