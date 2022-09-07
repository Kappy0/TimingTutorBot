module.exports.run = async (bot, message, args, logger) => {
	message.channel.send("command works");
}

module.exports.help = {
	name: "update"
}