//npm packages
const discord = require("discord.js");
const fetch = require("node-fetch"); //Used for Twitch API
const fs = require("fs"); //fs is Node.js's native file system module
const mysql = require("mysql");

const bot = new discord.Client();
bot.commands = new discord.Collection();

//Utilities
const dateUtils = require('./date.js');
const logUtils = require('./logger.js');
const fileUtils = require('./file.js');
const apiUtils = require('./api.js');

//Settings
const bot_settings = require("./botsettings.json");
let api_settings = fileUtils.readSync('./apisettings.json');

//For grabbing Twitch API data
const stream_URL = 'https://api.twitch.tv/helix/streams?user_login=kappylp';
const game_URL = 'https://api.twitch.tv/helix/games?id=';
let api_headers = {
	//'Authorization':'Bearer '+ api_settings.twitch_token,
	'Authorization':'Bearer '+ api_settings.test,
	'Client-ID': api_settings.client_id,
}

//Loading commands
fs.readdir("./commands/", (err, files) => {
	if(err) 
	{
		log_notif_channel.send("Error reading commands.");
		logUtils.logger.log("[" + dateUtils.cen_time(new Date()).toISOString() + "] " + err);
	}

	let js_files = files.filter(file => file.split(".").pop() === "js");
	
	if(js_files.length <= 0)
	{
		console.log("No commands to load!");
		return;
	}
	
	console.log(`Loading ${js_files.length} commands!`);
	
	js_files.forEach((file, i) =>
	{
		let props = require(`./commands/${file}`);
		console.log(`${i + 1}: ${file} loaded!`);
		bot.commands.set(props.help.name, props);
	});
});

/*const connection_pool = mysql.createPool({
	connectionLimit: 100,
	host: bot_settings.db_host,
	port: bot_settings.db_port,
	user: bot_settings.db_user,
	password: bot_settings.db_pw,
	database: bot_settings.db_name
	//socketPath: 
});*/

bot.once("ready", () => {
	console.log(`Bot is ready! ${bot.user.username}`);
	console.log(bot.commands);

	logUtils.logger.log("[" + dateUtils.cen_time(new Date()).toISOString() + "] " + "Another log file test");
});


bot.on("ready", async () => {
	//const notif_channel = bot.channels.cache.get('720036895115051029');
	const notif_channel = bot.channels.cache.get('556936544682901512'); //Test Channel

	//Logging channel for bot on Discord itself
	//const log_notif_channel = bot.channels.cache.get('356828089327550485');
	//const log_notif_channel = bot.channels.cache.get('856929671072841792'); //Test Channel
	const log_notif_channel = bot.channels.cache.get('952358789582057502');

	let already_announced = false;
	let token_changed = false;

	bot.setInterval(() => {
		//console.log(token_changed);
		if(token_changed)
		{
			//refresh token params
			api_settings = fileUtils.readSync('./apisettings.json');

			api_headers = {
				//'Authorization':'Bearer '+ api_settings.twitch_token,
				'Authorization':'Bearer '+ api_settings.test,
				'Client-ID': api_settings.client_id,
			}

			token_changed = false;
		}

		//console.log(api_headers);
		fetch(stream_URL, {
			headers: api_headers,
		})
		.then(res => apiUtils.twitch_api_status(res))
		.then(response => response.json())
		.then(body => {
			let data = body.data;

			if(data[0] !== undefined)
			{
				//console.log("Got Twitch data!");
				if(!already_announced)
				{
					already_announced = true;

					/*let embed = new discord.MessageEmbed()
						//.setAuthor(`${data[0].user_name} is now live!`)
						.setDescription("https://twitch.tv/kappylp")
						.setTitle(data[0].title)
						.addField("Game", data[0].game_name)
						//.setThumbnail(data[0].thumbnail_url)
						.setFooter("Started at " + data[0].started_at);*/

					//notif_channel.send("@here Kappy is LIVE!", {embed: embed});
				}
			}
			else
			{
				//console.log("Not live");
				if(already_announced) already_announced = false;
			}
		}).catch((err) => {
			//log_notif_channel.send("Error accessing Twitch API.");
			logUtils.logger.log("[" + dateUtils.cen_time(new Date()).toISOString() + "] " + "Caught " + err.stack)

			token_changed = true;
		});
	}, 6000);
});

bot.on("message", async message => {
	//Bot/DM Checks
	if (message.author.bot) return;
	if (message.channel.type === "dm") return;

	//Storing message to use
	let message_arr = message.content.split(" ");
	let args = message_arr.slice(1);

	//Reading stored message to see if it starts with the prefix for a command
	let command_message = message_arr[0];
	if (!command_message.startsWith(bot_settings.prefix)) return;

	//Check if the command exists, and run it if it does
	let command_from_list = bot.commands.get(command_message.slice(bot_settings.prefix.length));
	if(command_from_list) command_from_list.run(bot, message, args, connection_pool);
});

bot.login(bot_settings.token);