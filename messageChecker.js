const list = require('./non-message-check-servers.json');

function checkMessage(message) {
	const wash = require('washyourmouthoutwithsoap');
	const profanity = wash.supported();
	const { owner_info } = require('./config.json');

	if(message.author.bot || !message.guild) return;

	if(list.swear_servers.includes(message.guild.id)){
		message.channel.messages.fetch({ limit: 2 }).then(messages => { // MOUTH WASH
			const secondMessage = messages.last();

			if(message.content.toLowerCase() == 'holy shit a dragon' && secondMessage.author.bot){
				return message.channel.send('I\'ll let you swear this once cause of that stupid bot');
			}else{
				for (let i = 0; i < profanity.length; i++) {
					if (wash.check('en', message.content.toLowerCase())) {
						console.log(new Date());
						console.log(`${message.author.tag} tried to use profanity at "${message.guild.name}" in #${message.channel.name}: ${message.cleanContent}`);

						return message.channel.send(`**BAD ${message.author.username}! Don't use bad words! Contact @${owner_info.tag} for full message**`).then(function(){
							message.delete().catch(console.error);
						});
					}
				}
			}
		}).catch(console.error);
	}


	if(message.content.toLowerCase().startsWith('you suck')){ // ANTI "YOU SUCK"
		return message.channel.send(`No you don't suck! It's just ${message.author.tag} being mean :(`);
	}if(message.content.toLowerCase().split(' ')[1] == 'suck\'s' || message.content.toLowerCase().split(' ')[1] == 'sucks'){ // ANTI "SUCK'S"
		return message.channel.send(`No! ${message.content.toLowerCase().split(' ')[0]} does **not** suck. ${message.content.toLowerCase().split(' ')[0]} is *amazing*!`);
	}

	if(message.content == '!d bump' && message.guild.name == 'The Chill Zone' && message.channel.name != 'd-bump'){
		return message.channel.reply('Please us `!d bump` in #d-bump');
	}
}

module.exports = { checkMessage };
