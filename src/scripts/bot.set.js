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

const REGEX = /(\S+)\s+set\s+(\S+)\s+(.*)/i;
module.exports = (robot) => {

	// RegEx match
	robot.respond(REGEX, (res) => {
		robot.logger.debug(`${TAG}: bot.path - RegEx match - res.message.text=${res.message.text}.`);
		const userId	= res.message.user.id;
		const name		= res.match[1];
		const path		= "set";
		const key		= res.match[2];
		const value		= res.match[3].trim();
		
		var pref		= robot.brain.get(userId) || {};
		var bot			= pref.bot || {};
		if (bot[name]) {
			if (bot[name].config) {
				const config = bot[name].config;
				var method = "GET";
				if (config.method) {
					method = config.method;
				}
				var url = config.url.replace(/\/$/, "") + "/" + path;
				
				if (method.toLowerCase() === "get") {
					if (path.indexOf("?") > -1)	url += "&";
					else						url += "?";
					url += "sessionId=" + userId + "&" + key + "=" + encodeURIComponent(value);
										
					res.http(url).get()( (err, httpres, body) => {
						if (err) {
							robot.logger.error(`${TAG}: ${name}.${path} - error: ${err}`);
							res.reply(`[http SET error on ${url}]: ${err}`);
							return;
						}
	
						res.reply(body);
					});
				} else if (method.toLowerCase() === "post") {
					const data = JSON.stringify({ sessionId : userId, [key] : value });	      
					res.http(url).header('Content-Type', 'application/json').post(data)( (err, httpres, body) => {
						if (err) {
							robot.logger.error(`${TAG}: ${name}.${path} - error: ${err}`);
							res.reply(`[http SET error on ${url}]: ${err}`);
							return;
						}

						res.reply(body);
					});
				}
			} else {
				robot.logger.error(`${TAG}: ${name}.${path} - error: config not found.`);
				res.reply(`[${name}] error: config not found.`);
			}			
		} else {
			robot.logger.info(`${TAG}: ${name}.${path} - info: ${name} not registered.`);
		}
	});
	
};