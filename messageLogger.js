const fs = require('fs');

function logMessage(message){
	if(!message.guild) return;

	let msg = message.cleanContent;
	if(message.embeds.length){
		msg = '[Discord Embed]';
	}

	const letters = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '𝓔'];


	const guildName = message.guild.name.split('');
	const channelName = message.channel.name.split('');

	while(letters.includes(channelName[0].toLowerCase()) == false || letters.includes(channelName[0].toLowerCase()) == null){
		channelName.shift();
	}
	while(letters.includes(guildName[0].toLowerCase()) == false || letters.includes(guildName[0].toLowerCase()) == null){
		guildName.shift();
	}


	if (!fs.existsSync(`../messageLogs/${guildName.join('')}`)){
		fs.mkdirSync(`../messageLogs/${guildName.join('')}`);
	}


	const date = new Date();

	fs.appendFileSync(`../messageLogs/${guildName.join('')}/${channelName.join('')}.log`, `\n\n${date} by ${message.author.tag}: ${msg}`);
}

module.exports = { logMessage };
