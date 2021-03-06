const bot_settings = require("./botsettings.json");
const discord = require("discord.js");
const fetch = require("node-fetch"); //Used for Twitch API
const fs = require("fs"); //fs is Node.js's native file system module

//For grabbing Twitch API data
const stream_URL = 'https://api.twitch.tv/helix/streams?user_login=kappylp';
const game_URL = 'https://api.twitch.tv/helix/games?id=';
const api_headers = {
	'Authorization':'Bearer '+ bot_settings.twitch_token,
	'Client-ID':bot_settings.client_id,
}

const bot = new discord.Client();
bot.commands = new discord.Collection();

fs.readdir("./commands/", (err, files) => {
	if(err) console.error(err);
	
	//"test.hello.js" = [test.hello.js]. Pop takes last element (js)
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

bot.once("ready", () => {
	console.log(`Bot is ready! ${bot.user.username}`);
	console.log(bot.commands);	
});


bot.on("ready", async() => {
	let already_announced = false;

	bot.setInterval(() => {
		fetch(stream_URL, {
			headers: api_headers,
		}).then(response => response.json())
		.then(body => {

			let data = body.data;

			if(data[0])
			{
				console.log("Got Twitch data!");
				if(!already_announced)
				{
					already_announced = true;

					let embed = new discord.MessageEmbed()
						//.setAuthor(`${data[0].user_name} is now live!`)
						.setDescription("https://twitch.tv/kappylp")
						.addField("Title", data[0].title)
						.addField("Game", data[0].game_name)
						//.setThumbnail(data[0].thumbnail_url)
						.setFooter("Started at " + data[0].started_at);

					let notif_channel = bot.channels.cache.get('556936544682901512');
					notif_channel.send("@here Kappy is LIVE!", {embed: embed});
				}
				else console.log("Stream has already been announced!");
			}
			else
			{
				if(already_announced) already_announced = false;
				console.log("Checking status...");
				console.log(body);
			}
		}).catch((err) => console.log("Caught " + err.stack));
	}, 60000);
});

bot.on("message", async message => {
	//Bot/DM Checks
	if (message.author.bot) return;
	if (message.channel.type === "dm") return;

	//Storing message to use
	let messageArr = message.content.split(" ");
	let args = messageArr.slice(1);

	//Reading stored message to see if it starts with the prefix for a command
	let command_message = messageArr[0];
	if (!command_message.startsWith(bot_settings.prefix)) return;

	//Check if the command exists, and run it if it does
	let command_from_list = bot.commands.get(command_message.slice(bot_settings.prefix.length));
	if(command_from_list) command_from_list.run(bot, message, args);
});

bot.login(bot_settings.token);