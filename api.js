const fetch = require("node-fetch"); //Used for Twitch API
const fileUtils = require('./file.js');
const dateUtils = require('./date.js');
const logUtils = require('./logger.js');
let api_settings = fileUtils.readSync('./apisettings.json');

const body = {
			client_id: api_settings.client_id,
			client_secret: api_settings.client_secret,
			grant_type: 'client_credentials'
};

const apiUtils = {
	refresh_token: () => {
		fetch('https://id.twitch.tv/oauth2/token', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {'Content-Type':'application/json'}
		})
		.then(response => response.json())
		.then(json => {
			//api_settings.twitch_token - json.access_token;
			api_settings.test = json.access_token;
			fileUtils.writeSync("apisettings.json", api_settings);
		}).catch((err) => logUtils.logger.log("[" + dateUtils.cen_time(new Date()).toISOString() + "] " + "Caught " + err.stack));
	},
	twitch_api_status: response => {
		if(response.ok) return response;
		else
		{
			//Generate new token
			apiUtils.refresh_token();

			throw Error(response.status + " " + response.statusText);
		}
	}
}

module.exports = apiUtils