const fs = require('fs');

function logMessage(message){
	if(!message.guild) return;

	let msg = message.cleanContent;
	if(message.embeds.length){
		msg = '[Discord Embed]';
	}

	if (!fs.existsSync(`../messageLogs/${message.guild.name}`)){
		fs.mkdirSync(`../messageLogs/${message.guild.name}`);
	}


	const date = new Date();

	fs.appendFileSync(`../messageLogs/${message.guild.name}/${message.channel.name}.log`, `\n\n${date} by ${message.author.tag}: ${msg}`);
}

module.exports = { logMessage };
