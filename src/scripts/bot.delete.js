// Description:
//	Listens for commands to register a bot
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

const REGEX = /bot\s+(delete|remove)\s+(\S+)/i;
module.exports = (robot) => {

	// RegEx match
	robot.respond(REGEX, (res) => {
		robot.logger.debug(`${TAG}: bot.delete - RegEx match - res.message.text=${res.message.text}.`);
		const name		= res.match[2].trim();
		const userId	= res.message.user.id;
		
		var pref	= robot.brain.get(userId) || {};
		var bot		= pref.bot || {};
		if (bot[name]) {
			delete(bot[name]);
			pref.bot	= bot;
			robot.brain.set(userId, pref);
			res.reply('bot ' + name + ' was deleted.');
		} else {
			res.reply("Bot " + name + " has not been registered.");
		}
	});
	
};