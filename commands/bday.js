const dateUtils = require('../date.js');

module.exports.run = async (bot, message, args, connection_pool, logger) => {
	//console.log(args[0]);
	//console.log(args[1]);

	//First command will insert users and their choice of pass/fail into database
	//This command will also be able to update someone's guess
	if(args[0].toLowerCase() === "guess")
	{
		connection_pool.query(`SELECT * FROM bday WHERE name = '${message.author.username}'`, (err, rows) => {
			if(err) 
			{
				logger.log("[" + dateUtils.cen_time(new Date()).toISOString() + "] " + err);
				message.channel.send("Couldn't connect to database.");
				return;
			}

			let sql;
		
			if(rows.length < 1)
			{
				if(args[1].charAt(0).toLowerCase() === "p")
				{
					sql = `INSERT INTO bday (name, guess) VALUES('${message.author.username}', 'Pass')`;
				}
				else if(args[1].charAt(0).toLowerCase() === "f")
				{
					sql = `INSERT INTO bday (name, guess) VALUES('${message.author.username}', 'Fail')`;
				}
				else message.channel.send("Invalid command arguments. Enter 'pass' for Pass and 'fail' for Fail");
			}
			else
			{
				if(args[1].charAt(0).toLowerCase() === "p")
				{
					sql = `UPDATE bday SET guess = 'Pass' WHERE name = '${message.author.username}'`;
				}
				else if(args[1].charAt(0).toLowerCase() === "f")
				{
					sql = `UPDATE bday SET guess = 'Fail' WHERE name = '${message.author.username}'`;
				}
				else message.channel.send("Invalid command arguments. Enter 'pass' for Pass and 'fail' for Fail");
			}

			connection_pool.query(sql);
		});	
	}

	//Second command will allow me to grab all winners and list them
	if(args[0].toLowerCase() === "winners")
	{
		if(args[1].charAt(0).toLowerCase() === "p")
		{
			connection_pool.query(`SELECT * FROM bday WHERE guess = 'Pass'`, (err, rows) => {
				if(err) 
				{
					logger.log("[" + dateUtils.cen_time(new Date()).toISOString() + "] " + err);
					message.channel.send("Couldn't connect to database.");
					return;
				}

				let msg = "__**WINNERS**__\n";

				rows.forEach(row => {
					msg += row.name + "\n";
				})

				if(msg === "__**WINNERS**__\n") msg += "None";

				message.channel.send(msg);
			});
		}
		else if(args[1].charAt(0).toLowerCase() === "f")
		{
			connection_pool.query(`SELECT * FROM bday WHERE guess = 'Fail'`, (err, rows) => {
				if(err) 
				{
					logger.log("[" + dateUtils.cen_time(new Date()).toISOString() + "] " + err);
					message.channel.send("Couldn't connect to database.");
					return;
				}

				let msg = "__**WINNERS**__\n";

				rows.forEach(row => {
					msg += row.name + "\n";
				})

				if(msg === "__**WINNERS**__\n") msg += "None";

				message.channel.send(msg);
			});
		}
	}

	//3rd command lists all users who guessed and sorts them
	if(args[0].toLowerCase() === "list")
	{
		connection_pool.query(`SELECT * FROM bday ORDER BY guess`, (err, rows) => {
			if(err) 
			{
				logger.log("[" + dateUtils.cen_time(new Date()).toISOString() + "] " + err);
				message.channel.send("Couldn't connect to database.");
				return;
			}

			let msg = "**USER** | **GUESS**\n";

			rows.forEach(row => {
				msg += row.name + " | " + row.guess + "\n";
			})

			message.channel.send(msg);
		});
	}	
}

module.exports.help = {
	name: "bday"
}