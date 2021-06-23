const date = require('../date');

test('converts current time to Central time for logs', () => {
	const this_date = new Date();
	const this_cen_time = new Date(this_date.getTime() - this_date.getTimezoneOffset()*60000);

	expect(date.cen_time(this_date)).toStrictEqual(this_cen_time);
});

test('converts current date to mmddyyyy for log file names', () => {
	const this_date = new Date();
	const this_mmddyyy_format = "" + (this_date.getMonth() + 1) + this_date.getDate() + this_date.getFullYear();

	expect(date.log_date(this_date)).toBe(this_mmddyyy_format);
});