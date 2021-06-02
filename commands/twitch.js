const bot_settings = require("../botsettings.json");
const discord = require("discord.js");
const fetch = require("node-fetch");

//For grabbing Twitch API data
const userURL = 'https://api.twitch.tv/helix/users?login=kappylp';
const headers = {
	'Authorization':'Bearer '+ bot_settings.twitch_token,
	'Client-ID':'hvkh2ps0jcndeha05urm1uy4j0nu5k',
}

//JUST ME [KAPPY]
module.exports.run = async (bot, message, args, connection, logger, date) => {
	//Testing with user api call
	fetch(userURL, {
			headers: headers,
		}).then(r => r.json())
		.then(body => {

		let data = body.data;
		let notifChannel = message.guild.channels.cache.get('556936544682901512');
		
		let embed = new discord.MessageEmbed()
			.setAuthor(data[0].display_name)
			.setDescription(data[0].broadcaster_type)
			.addField("User ID", data[0].id, true)
			.addField("View Count", data[0].view_count, true)
			.setThumbnail(data[0].profile_image_url)
			.setFooter("Type: " + data[0].type);
		
		if(!notifChannel) message.channel.send("@here HELLO", {embed: embed});
		else notifChannel.send ("@here HELLO " + data[0].description, {embed: embed});
			
		//console.log(body.data[0].id);
	}).catch((err) => console.log("Caught " + err.stack));
}

module.exports.help = {
	name: "twitch"
}