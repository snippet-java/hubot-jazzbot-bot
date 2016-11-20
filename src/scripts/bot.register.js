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

const REGEX = /bot\s+register\s+(\S+)\s+(\S+)/i;
module.exports = (robot) => {

	// RegEx match
	robot.respond(REGEX, (res) => {
		robot.logger.debug(`${TAG}: bot.register - RegEx match - res.message.text=${res.message.text}.`);
		const name		= res.match[1];
		const url		= res.match[2];
		const userId	= res.message.user.id;
		
		if (url.match(/^http(s|):\/\//i)) {
			var pref	= robot.brain.get(userId) || {};
			var bot		= pref.bot || {};
			bot[name]	= {config:{url:url}};
			pref.bot	= bot;
			robot.brain.set(userId, pref);
			res.reply('bot ' + name + ' registered with ' + url + ' for ' + userId);
		} else {
			res.reply("url " + value + " is invalid. Please use a valid url");
		}
	});
	
};