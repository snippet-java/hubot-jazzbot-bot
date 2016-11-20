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

const REGEX = /bot\s+config\s+(\S+)\s+(\S+)\s+(\S+)/i;
module.exports = (robot) => {

	// RegEx match
	robot.respond(REGEX, (res) => {
		robot.logger.debug(`${TAG}: bot.config - RegEx match - res.message.text=${res.message.text}.`);
		const userId	= res.message.user.id;
		const name		= res.match[1].trim();
		const key		= res.match[2].trim();
		const value		= res.match[3].trim();
		
		var pref		= robot.brain.get(userId) || {};
		var bot			= pref.bot || {};
		if (bot[name]) {
			if (!(bot[name].config)) {
				bot[name].config = {};
			}
			bot[name].config[key] = value;
			pref.bot	= bot;
			robot.brain.set(userId, pref);
			
			res.reply(name + " config " + key + " saved.");
		} else {
			res.reply("Bot " + name + " has not been registered.");
		}
	});
	
};