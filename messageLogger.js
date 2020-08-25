const fs = require('fs');

function logMessage(message){
	const date = new Date();
	let msg = message.cleanContent;

	if(message.channel.type == 'dm'){
		if (!fs.existsSync('../messageLogs/dms')){
			fs.mkdirSync('../messageLogs/dms');
		}
		if(message.author.id == '731206123327193170') return;
		return fs.appendFileSync(`../messageLogs/dms/${message.author.tag}.log`, `\n\n${date}: ${msg}`);
	}

	if(!message.guild) return;

	if(message.embeds.length){
		msg = '[Discord Embed]';
	}

	if (!fs.existsSync(`../messageLogs/guilds/${message.guild.name}`)){
		fs.mkdirSync(`../messageLogs/guilds/${message.guild.name}`);
	}

	fs.appendFileSync(`../messageLogs/guilds/${message.guild.name}/${message.channel.name}.log`, `\n\n${date} by ${message.author.tag}: ${msg}`);
}

module.exports = { logMessage };
