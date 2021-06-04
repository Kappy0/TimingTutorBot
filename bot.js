//npm packages
const discord = require("discord.js");
const fetch = require("node-fetch"); //Used for Twitch API
const fs = require("fs"); //fs is Node.js's native file system module
const mysql = require("mysql");

//Utilities
const bot_settings = require("./botsettings.json");
const dateUtils = require('./date.js');

//For grabbing Twitch API data
const stream_URL = 'https://api.twitch.tv/helix/streams?user_login=kappylp';
const game_URL = 'https://api.twitch.tv/helix/games?id=';
const api_headers = {
	'Authorization':'Bearer '+ bot_settings.twitch_token,
	'Client-ID':bot_settings.client_id,
}

//Quick function to produce a date in my local CST timezone
//let date = date => new Date(date.getTime() - date.getTimezoneOffset()*60000); 

//Quick function to produce a date in the format "mmddyyyy"
//let log_date = date => "" + (date.getMonth() + 1) + date.getDate() + date.getFullYear();

//Logging output
const log_output = fs.createWriteStream('./logs/tt-log' + dateUtils.log_date(new Date()) + '.txt',{flags: 'a'});
const logger = new console.Console(log_output);

const bot = new discord.Client();
bot.commands = new discord.Collection();

fs.readdir("./commands/", (err, files) => {
	if(err) logger.log("[" + dateUtils.cen_time(new Date()).toISOString() + "] " + err);

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

const connection_pool = mysql.createPool({
	connectionLimit: 100,
	host: bot_settings.db_host,
	port: bot_settings.db_port,
	user: bot_settings.db_user,
	password: bot_settings.db_pw,
	database: bot_settings.db_name
	//socketPath: 
});

/*const connection = mysql.createConnection({
	host: bot_settings.db_host,
	port: bot_settings.db_port,
	user: bot_settings.db_user,
	password: bot_settings.db_pw,
	database: bot_settings.db_name
	//socketPath: 
});*/

/*connection.connect(err => {
	if(err) logger.log("[" + date(new Date()).toISOString() + "] " + err);
	else console.log("Connected to database!");
});*/

bot.once("ready", () => {
	console.log(`Bot is ready! ${bot.user.username}`);
	console.log(bot.commands);

	let already_announced = false;
	logger.log("[" + dateUtils.cen_time(new Date()).toISOString() + "] " + "Another log file test");
});


bot.on("ready", async() => {
	//let notif_channel = bot.channels.cache.get('720036895115051029');
	let notif_channel = bot.channels.cache.get('556936544682901512'); //Test Channel

	bot.setInterval(() => {
		fetch(stream_URL, {
			headers: api_headers,
		}).then(response => response.json())
		.then(body => {

			let data = body.data;

			if(data[0] !== undefined)
			{
				console.log("Got Twitch data!");
				if(!already_announced)
				{
					already_announced = true;

					let embed = new discord.MessageEmbed()
						//.setAuthor(`${data[0].user_name} is now live!`)
						.setDescription("https://twitch.tv/kappylp")
						.setTitle(data[0].title)
						.addField("Game", data[0].game_name)
						//.setThumbnail(data[0].thumbnail_url)
						.setFooter("Started at " + data[0].started_at);

					notif_channel.send("@here Kappy is LIVE!", {embed: embed});
				}
			}
			else
			{
				if(already_announced) already_announced = false;
			}
		}).catch((err) => logger.log("[" + dateUtils.cen_time(new Date()).toISOString() + "] " + "Caught " + err.stack));
	}, 60000);
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
	if(command_from_list) command_from_list.run(bot, message, args, connection_pool, logger);
});

bot.login(bot_settings.token);