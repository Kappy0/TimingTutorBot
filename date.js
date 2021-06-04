module.exports = {
	cen_time: date => {return new Date(date.getTime() - date.getTimezoneOffset()*60000);}, 
	log_date: date => {return "" + (date.getMonth() + 1) + date.getDate() + date.getFullYear();}
};