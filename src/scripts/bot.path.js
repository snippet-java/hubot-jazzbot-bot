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

const REGEX = /(\S+)\s+(\S+)(.*)/i;
module.exports = (robot) => {

	// RegEx match
	robot.respond(REGEX, (res) => {
		robot.logger.debug(`${TAG}: bot.path - RegEx match - res.message.text=${res.message.text}.`);
		const userId	= res.message.user.id;
		var name		= res.match[1];
		var path		= res.match[2].replace(/^\//, "");
		var text		= res.match[3].trim();
		
		if (path === "help" || path === "set" || path === "get") return;
		
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
					url += "sessionId=" + userId + "&text=" + encodeURIComponent(text);
										
					res.http(url).get()( (err, httpres, body) => {
						if (err) {
							robot.logger.error(`${TAG}: ${name}.${path} - error: ${err}`);
							res.reply(`[http GET error on ${url}]: ${err}`);
							return;
						}
	
						res.reply(body);
					});
				} else if (method.toLowerCase() === "post") {
					const data = JSON.stringify({ sessionId : userId, text : text });	      
					res.http(url).header('Content-Type', 'application/json').post(data)( (err, httpres, body) => {
						if (err) {
							robot.logger.error(`${TAG}: ${name}.${path} - error: ${err}`);
							res.reply(`[http GET error on ${url}]: ${err}`);
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
			if (bot.exec) {
				name = "exec";
				path = "cmd";
				text = res.match[0];
				
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
						url += "sessionId=" + userId + "&text=" + encodeURIComponent(text);
											
						res.http(url).get()( (err, httpres, body) => {
							if (err) {
								robot.logger.error(`${TAG}: ${name}.${path} - error: ${err}`);
								res.reply(`[http GET error on ${url}]: ${err}`);
								return;
							}
		
							res.reply(body);
						});
					} else if (method.toLowerCase() === "post") {
						const data = JSON.stringify({ sessionId : userId, text : text });	      
						res.http(url).header('Content-Type', 'application/json').post(data)( (err, httpres, body) => {
							if (err) {
								robot.logger.error(`${TAG}: ${name}.${path} - error: ${err}`);
								res.reply(`[http GET error on ${url}]: ${err}`);
								return;
							}

							res.reply(body);
						});
					}
				} else {
					robot.logger.error(`${TAG}: ${name}.${path} - error: config not found.`);
					res.reply(`[${name}] error: config not found.`);
				}
				
			} else
				robot.logger.info(`${TAG}: ${name}.${path} - info: ${name} not registered.`);
		}
	});
	
};