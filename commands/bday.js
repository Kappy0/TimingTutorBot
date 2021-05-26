module.exports.run = async (bot, message, args, connection, logger) => {
	//First command will insert users and their choice of pass/fail into database
	//This command will also be able to update someone's guess
	console.log(args[0]);
	console.log(args[1]);
	//console.log(connection);

	if(args[0] === "guess")
	{
		connection.query(`SELECT * FROM bday WHERE name = '${message.author.username}'`, (err, rows) => {
			if(err) logger.log("[" + date(new Date()).toISOString() + "] " + err);

			let sql;
		
			if(rows.length < 1)
			{
				if(args[1] === "p")
				{
					sql = `INSERT INTO bday (name, guess) VALUES('${message.author.username}', 'Pass')`;
				}
				else if(args[1] === "f")
				{
					sql = `INSERT INTO bday (name, guess) VALUES('${message.author.username}', 'Fail')`;
				}
				else message.channel.send("Invalid command arguments. Enter 'p' for Pass and 'f' for Fail");
			}
			else
			{
				if(args[1] === "p")
				{
					sql = `UPDATE bday SET guess = 'Pass' WHERE name = '${message.author.username}'`;
				}
				else if(args[1] === "f")
				{
					sql = `UPDATE bday SET guess = 'Fail' WHERE name = '${message.author.username}'`;
				}
				else message.channel.send("Invalid command arguments. Enter 'p' for Pass and 'f' for Fail");
			}

			connection.query(sql);
		});	
	}

	//Second command will allow me to grab all winners and list them
	if(args[0] === "winners")
	{
		if(args[1] === "pass")
		{
			let numWinners;

			connection.query(`SELECT COUNT(*) as count FROM bday WHERE guess = 'Pass'`, (err, rows) => {
				if(err) logger.log("[" + date(new Date()).toISOString() + "] " + err);

				numWinners = rows[0].count;
				console.log(numWinners);
			
				connection.query(`SELECT * FROM bday WHERE guess = 'Pass'`, (err, rows) => {
					if(err) logger.log("[" + date(new Date()).toISOString() + "] " + err);

					let msg = "__**WINNERS**__\n";

					let i = 0;
					while(i < numWinners)
					{
						msg += rows[i].name + "\n";
						i++;
					}

					if(msg === "__**WINNERS**__\n") msg += "None";

					message.channel.send(msg);
				});
			});
		}
		else if(args[1] === "fail")
		{
			let numWinners;

			connection.query(`SELECT COUNT(*) as count FROM bday WHERE guess = 'Fail'`, (err, rows) => {
				if(err) logger.log("[" + date(new Date()).toISOString() + "] " + err);

				numWinners = rows[0].count;
				console.log(numWinners);
			
				connection.query(`SELECT * FROM bday WHERE guess = 'Fail'`, (err, rows) => {
					if(err) logger.log("[" + date(new Date()).toISOString() + "] " + err);

					let msg = "__**WINNERS**__\n";

					let i = 0;
					while(i < numWinners)
					{
						msg += rows[i].name + "\n";
						i++;
					}

					if(msg === "__**WINNERS**__\n") msg += "None";

					message.channel.send(msg);
				});
			});
		}
	}

	//3rd command lists all users who guessed pass or fail
	
}

module.exports.help = {
	name: "bday"
}