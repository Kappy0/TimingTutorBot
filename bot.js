const bot_settings = require("./botsettings.json");
const discord = require("discord.js");

const bot = new discord.Client();

bot.on("ready", async() => {
	console.log(`Bot is ready! ${bot.user.tag}`);
});

bot.login(bot_settings.token);