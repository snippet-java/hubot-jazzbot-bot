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

const REGEX = /bot\s+list/i;
module.exports = (robot) => {

	// RegEx match
	robot.respond(REGEX, (res) => {
		robot.logger.debug(`${TAG}: bot.list - RegEx match - res.message.text=${res.message.text}.`);
		const userId	= res.message.user.id;
		
		const pref	= robot.brain.get(userId) || {};
		const bot	= pref.bot || {};
		const names	= Object.keys(bot);
		if (names && names.length > 0) {
			res.reply(names);
		} else {
			res.reply("No bots has been registered.");
		}
	});
	
};