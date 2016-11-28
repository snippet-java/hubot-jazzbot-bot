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

const REGEX = /(\S+)\s+(\S+)\s+(.*)/i;
module.exports = (robot) => {

	// RegEx match
	robot.respond(REGEX, (res) => {
		robot.logger.debug(`${TAG}: bot.path - RegEx match - res.message.text=${res.message.text}.`);
		const userId	= res.message.user.id;
		const name		= res.match[1];
		const path		= res.match[2].replace(/^\//, "");
		const text		= res.match[3].trim();
		
		if (path === "help" || path === "set" || path === "get") return;
		
		var pref		= robot.brain.get(userId) || {};
		var bot			= pref.bot || {};
		if (bot[name]) {
			execute(bot[name], userId, name, path, text, res, (result) => {
				if (result.err) {
					robot.logger.error(result.err);
					res.reply(result.err);
					return;
				}

				res.reply(result.out);
			});	
		} else if (bot.exec) {
			execute(bot.exec, userId, "exec", "cmd", res.match[1] + " " + res.match[2] + " " + res.match[3], res, (result) => {
				if (result.err) {
					robot.logger.error(result.err);
					res.reply(result.err);
					return;
				}

				res.reply(result.out);
			});
		} else {
			robot.logger.info(`${TAG}: ${name}.${path} - info: ${name} not registered.`);
		}
	});
	
};


function execute(bot, userId, name, path, text, res, cb) {
	if (!(bot.config)) {
		cb({err:`${TAG}: ${name}.${path} - error: config not found.`});
		return;
	}
	
	const config = bot.config;
	var method = "GET";
	if (config.method)
		method = config.method;
	var url = config.url.replace(/\/$/, "") + "/" + path;
	
	if (method.toLowerCase() === "get") {
		if (path.indexOf("?") > -1)	url += "&";
		else						url += "?";
		url += "sessionId=" + userId + "&text=" + encodeURIComponent(text);
							
		res.http(url).get()( (err, httpres, body) => {
			if (err)	cb({err:`${TAG}: ${name}.${path} - error: ${err}`});
			else		cb({out:body});
		});
	} else if (method.toLowerCase() === "post") {
		const data = JSON.stringify({ sessionId : userId, text : text });	      
		res.http(url).header('Content-Type', 'application/json').post(data)( (err, httpres, body) => {
			if (err)	cb({err:`${TAG}: ${name}.${path} - error: ${err}`});
			else		cb({out:body});
		});
	}
}