// Description:
//	Listens for commands to register a bot
//
// Commands:
//   hubot bot help - Displays all bot commands.
//
// Author:
//	syahrul.aiman@my.ibm.com
//
/*
  * Licensed Materials - Property of IBM
  * (C) Copyright IBM Corp. 2016. All Rights Reserved.
  * US Government Users Restricted Rights - Use, duplication or
  * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
  */
'use strict';

const path = require('path');
const TAG = path.basename(__filename);

const REGEX = /bot\s+help/i;
module.exports = (robot) => {

	// RegEx match
	robot.respond(REGEX, (res) => {
		robot.logger.debug(`${TAG}: bot.help - RegEx match - res.message.text=${res.message.text}.`);
		robot.logger.info(`${TAG}: Listing bot help...`);
		
		let help = `${robot.name} bot register <BOTNAME> <URL> - Register a bot and the endpoint\n`;
		help += `${robot.name} bot list - Lists bots registered to user\n`;
		help += `${robot.name} bot config <BOTNAME> <KEY> <VALUE> - Assign a config value to the bot\n`;
		help += `${robot.name} bot delete <BOTNAME> - Delete a bot\n`;
		help += `${robot.name} <BOTNAME>.set <PARAM> <VALUE> - Sets a value to the parameter, executed by the bot / app\n`;
		help += `${robot.name} <BOTNAME>.get <PARAM> - Gets / returns the parameter value, executed by the bot / app\n`;
		help += `${robot.name} <BOTNAME>.<path> <TEXT> - Sends the text to the bot path / endpoint\n`;
		help += `${robot.name} <BOTNAME>.help - Show available commands by the bot / app\n`;
		help += `${robot.name} <BOTNAME> help - Show this help\n`;
		
		res.reply(help);
	});
	
};