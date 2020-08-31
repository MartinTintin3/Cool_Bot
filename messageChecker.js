const list = require('./customizations.json');

const { shops } = require('./customizations.json');

const roles = {
	admin: '747571342823653441',
	moderator: '730055227818115193',
	bot: '730224273662410772',
};

function checkMessage(message, args) {
	if(message.guild){
		if(message.guild.id == '730054736530636841'){
			const closed = {};
			const music_channel = '749610920916811877';
			if(message.content.startsWith(';;') && message.channel.id != music_channel){
				message.channel.send(`Please use music commands in the <#${music_channel}> channel.`)
			}

			if(shops.find(shop => shop.channel_id == message.channel.id) && !(message.author.id == message.client.id && message.content.includes(' is now ')) && !(shops.find(shop => shop.owner_id == message.author.id) && message.content.toLowerCase() == '.open') && message.channel.permissionOverwrites.find(overwrite => overwrite.id == roles.moderator).deny.any('SEND_MESSAGES')){
				message.delete().catch(console.error);
				closed[shops.find(shop => shop.channel_id == message.channel.id).name] = true;
			}else if(message.content == '.menu'){
				const shop = shops.find(s => s.channel_id == message.channel.id);
				if(shop) return message.channel.send({ embed: shop.menu });
			}else if(message.content.toLowerCase() == '.close'){
				const shop = shops.find(s => s.channel_id == message.channel.id && s.owner_id == message.author.id);
				if(shop){
					closed[shop.name] = true;
					message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false })
						.then(() => {
							message.channel.updateOverwrite(message.member, {
								SEND_MESSAGES: true,
							});

							message.channel.updateOverwrite(message.guild.roles.cache.get(roles.moderator), {
								SEND_MESSAGES: false,
								MANAGE_PERMISSIONS: false,
							});
							message.channel.updateOverwrite(message.guild.roles.cache.get(roles.admin), {
								SEND_MESSAGES: false,
								MANAGE_PERMISSIONS: false,
							});

							message.channel.updateOverwrite(message.guild.roles.cache.get(roles.bot), { SEND_MESSAGES: true });

							if(shop.closed){
								message.channel.send(`${shop.name} is now CLOSED`, { files: [shop.closed] });
							}else{
								message.channel.send(`${shop.name} is now CLOSED`);
							}
						});
				}
			}else if(message.content.toLowerCase() == '.open'){
				closed[shop.name] = false;
				const shop = shops.find(s => s.channel_id == message.channel.id && s.owner_id == message.author.id);

				if(shop){
					message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true })
						.then(() => {
							message.channel.updateOverwrite(message.member, {
								SEND_MESSAGES: null,
							});

							if(shop.open){
								message.channel.send(`${shop.name} is now OPEN`, { files: [shop.open] });
							}else{
								message.channel.send(`${shop.name} is now OPEN`);
							}

							message.channel.updateOverwrite(message.guild.roles.cache.get(roles.moderator), {
								SEND_MESSAGES: true,
							});
							message.channel.updateOverwrite(message.guild.roles.cache.get(roles.admin), {
								SEND_MESSAGES: true,
							});
							message.channel.updateOverwrite(message.guild.roles.cache.get(roles.bot), { SEND_MESSAGES: null });
						});
				}
			}else if(message.content.toLowerCase() == '.lockdown'){
				const shop = shops.find(s => s.channel_id == message.channel.id);
				if(message.member.roles.cache.find(role => role.id == roles.admin || role.id == roles.moderator) && shop){
					message.channel.updateOverwrite(message.guild.members.cache.get(shop.owner_id), {
						SEND_MESSAGES: false,
					});
					message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
					message.channel.updateOverwrite(message.channel.guild.roles.cache.get(roles.bot), { SEND_MESSAGES: true });
				}
			}else if(message.content.toLowerCase() == '.unlockdown'){
				const shop = shops.find(s => s.channel_id == message.channel.id);
				if(message.member.roles.cache.find(role => role.id == roles.admin || role.id == roles.moderator) && shop){
					message.channel.updateOverwrite(message.guild.members.cache.get(shop.owner_id), {
						SEND_MESSAGES: true,
					});
					if(closed[shop.name]){
						message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
						message.channel.updateOverwrite(message.channel.guild.roles.cache.get(roles.bot), { SEND_MESSAGES: true });
					}else{
						message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
						message.channel.updateOverwrite(message.channel.guild.roles.cache.get(roles.bot), { SEND_MESSAGES: null });
					}
				}
			}else if(message.content.toLowerCase().startsWith('.tax')){
				if(!args.length){
					message.channel.send('Please provide the amount of coins that need to be given');
				}else if(isNaN(args[0])){
					message.channel.send('Please provide a number');
				}else{
					const amount = Math.abs(parseInt(args[0]));
					if(amount <= 10000){
						message.channel.send(`The tax amount for this value will be 0%, so the total should be ${amount}`);
					}else if(amount <= 48958){
						message.channel.send(`The tax amount for this value will be 1%, so the total should be ${amount + amount * (1 / 100)}`);
					}else if(amount <= 470759){
						message.channel.send(`The tax amount for this value will be 3%, so the total should be ${amount + amount * (3 / 100)}`);
					}else if(amount <= 934639){
						message.channel.send(`The tax amount for this value will be 8%, so the total should be ${amount + amount * (2 / 25)}`);
					}else{
						message.channel.send(`The tax amount for this value will be 10%, so the total should be ${amount + amount * (1 / 10)}`);
					}
				}
			}else if(message.content.startsWith('.buy')){
				const shop = shops.find(s => s.channel_id == message.channel.id);
				if(shop){
					if(!args.length){
						message.channel.send('What do you want to buy?');
					}else{
						message.client.users.cache.get(shop.owner_id).send(`${message.member.username} wants to buy \`${args.join(' ')}\``);
						message.channel.send('You request has been sent!');
					}
				}
			}
		}
	}
	const wash = require('washyourmouthoutwithsoap');
	const profanity = wash.supported();
	const { owner_info } = require('./config.json');

	if(message.author.bot || !message.guild) return;


	if(!list.swear_servers.includes(message.guild.id) && message.guild.me.hasPermission('MANAGE_MESSAGES')){
		message.channel.messages.fetch({ limit: 2 }).then(messages => { // MOUTH WASH
			const secondMessage = messages.last();

			if(message.content.toLowerCase() == 'holy shit a dragon' && secondMessage.author.bot){
				return message.channel.send('I\'ll let you swear this once cause of that stupid bot');
			}else{
				for (let i = 0; i < profanity.length; i++) {
					if (wash.check('en', message.content.toLowerCase())) {
						console.log(new Date());
						console.log(`${message.author.tag} tried to use profanity at "${message.guild.name}" in #${message.channel.name}: ${message.cleanContent}`);

						return message.channel.send(`**BAD ${message.author.username}! Don't use bad words! Contact @${owner_info.tag} for full message**`).then(() => {
							message.delete();
						});
					}/* else{
						data.en.forEach(word => {
							if(message.cleanContent.toLowerCase().includes(word)){
								console.log(message.cleanContent.toLowerCase());
								console.log(new Date());
								console.log(`${message.author.tag} tried to use profanity at "${message.guild.name}" in #${message.channel.name}: ${message.cleanContent}`);

								return message.channel.send(`**BAD ${message.author.username}! Don't use bad words! Contact @${owner_info.tag} for full message**`).then(function(){
									message.delete();
								});
							}
						});
					} */
				}
			}
		}).catch(console.error);
	}


	if(message.content.toLowerCase().startsWith('you suck')){ // ANTI "YOU SUCK"
		return message.channel.send(`No you don't suck! It's just ${message.author.tag} being mean :(`);
	}if(message.content.toLowerCase().split(' ')[1] == 'suck\'s' || message.content.toLowerCase().split(' ')[1] == 'sucks'){ // ANTI "SUCK'S"
		return message.channel.send(`No! ${message.content.toLowerCase().split(' ')[0]} does **not** suck. ${message.content.toLowerCase().split(' ')[0]} is *amazing*!`);
	}
}

module.exports = { checkMessage };
