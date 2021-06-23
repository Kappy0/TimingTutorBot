const fetch = require("node-fetch"); //Used for Twitch API
const fileUtils = require('./file.js');
//const api_settings = fileUtils.readFile('./apisettings.json', logger);

let body = {
			client_id: api_settings.client_id,
			client_secret: api_settings.client_secret,
			grant_type: 'client_credentials'
};

module.exports = {
	refresh_token: {},
	twitch_api_status: {}
};

fetch('https://id.twitch.tv/oauth2/token', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {'Content-Type':'application/json'}
	}).then(response => response.json())
	.then(json => {
		api_settings.test = json.access_token;
		//fileUtils.write("apisettings.json", logger);
		/*fs.writeFile("apisettings.json", JSON.stringify(bot_settings, null, 4), err => {
			if(err) logger.log("[" + date(new Date()).toISOString() + "] " + err);
							});*/
}).catch((err) => logger.log("[" + dateUtils.cen_time(new Date()).toISOString() + "] " + "Caught " + err.stack));

//Helper function to check for response code status from Twitch API
let res_status = response => {
	//Logging channel for bot on Discord itself
	//let log_notif_channel = bot.channels.cache.get('356828089327550485');
	let log_notif_channel = bot.channels.cache.get('856929671072841792'); //Test Channel

	if(response.ok) return response;
	else
	{
		//logger.log("[" + dateUtils.cen_time(new Date()).toISOString() + "] " + reponse.status + " " + response.statusText);
		//Generate new token
		apiUtils.refresh_token();

		log_notif_channel.send("Error accessing Twitch API.");
		throw Error(response.status + " " + response.statusText);
	}
};