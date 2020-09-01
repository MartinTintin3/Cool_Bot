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

			if(shops.find(shop => shop.channel_id == message.channel.id) && message.channel.permissionOverwrites.find(overwrite => overwrite.id == roles.moderator).deny.any('SEND_MESSAGES') && message.author.id != message.client.id && !(message.author.id == shops.find(shop => shop.channel_id == message.channel.id).owner_id && message.content.toLowerCase() == '.open')){
				message.delete().catch(console.error);
				closed[shops.find(shop => shop.channel_id == message.channel.id).name] = true;
			}else if(message.content == '.menu'){
				const shop = shops.find(s => s.channel_id == message.channel.id);
				const menu = shop.menu;
				menu.author.name = message.guild.members.cache.get(shop.owner_id).displayName;
				menu.author.icon_url = message.client.users.cache.get(shop.owner_id).avatarURL();
				menu.timestamp = new Date();
				if(shop) return message.channel.send({ embed: menu });
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
				const shop = shops.find(s => s.channel_id == message.channel.id && s.owner_id == message.author.id);

				if(shop){
					closed[shop.name] = false;
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
				(() => {
					const shop = shops.find(s => s.channel_id == message.channel.id);
					if(shop){
						if(shop.channel_id == '749018252931366933'){
							const cars = require('./car-list.json');
							const pages = [];
							let page = 1;
							const max = 5;

							let brands = {
								color: shop.menu.color,
								title: `Choose a brand(Page ${page} of ${Math.floor(cars.length / max)})`,
								author: {},
								fields: [],
								timestamp: new Date(),
								footer: {
									text: 'React with the coresponding number to select a brand! Use the ⬅️ and ➡️ arrows to change pages',
								},
							};
							brands.author.name = message.guild.members.cache.get(shop.owner_id).displayName;
							brands.author.icon_url = message.client.users.cache.get(shop.owner_id).avatarURL();
							const emojis = [
								{
									name: ':one:',
									unicode: '1️⃣',
								},
								{
									name: ':two:',
									unicode: '2️⃣',
								},
								{
									name: ':three:',
									unicode: '3️⃣',
								},
								{
									name: ':four:',
									unicode: '4️⃣',
								},
								{
									name: ':five:',
									unicode: '5️⃣',
								},
								{
									name: ':six:',
									unicode: '6️⃣',
								},
								{
									name: ':seven:',
									unicode: '7️⃣',
								},
								{
									name: ':eight:',
									unicode: '8️⃣',
								},
								{
									name: ':nine:',
									unicode: '9️⃣',
								},
								{
									name: ':keycap_ten:',
									unicode: '🔟',
								},
							];

							cars.forEach((car, index) => {
								if(brands.fields.length >= max){
									pages.push(brands);
									brands = {
										color: shop.menu.color,
										title: `Choose a brand(Page ${index / max} of ${Math.floor(cars.length / max)})`,
										author: {},
										fields: [],
										timestamp: new Date(),
										footer: {
											text: 'React with the coresponding number to select a brand! Use the ⬅️ and ➡️ arrows to change pages',
										},
									};
									brands.author.name = message.guild.members.cache.get(shop.owner_id).displayName;
									brands.author.icon_url = message.client.users.cache.get(shop.owner_id).avatarURL();
								}
								brands.fields.push({
									name: car.brand,
									value: `React with a ${emojis[brands.fields.length].name} to select this brand`,
								});
							});

							message.channel.send({ embed: pages[page - 1] }).then(msg => {
								const filters = {};
								const collectors = [];
								msg.react('⬅️');
								for(let i = 0; i < pages[page - 1].fields.length; i++){
									msg.react(emojis[i].unicode);
									const name = i + 1;
									filters[`${name}`] = (reaction, user) => reaction.emoji.name == emojis[i].unicode && user.id == message.author.id;
									collectors.push(msg.createReactionCollector(filters[`${name}`], { time: 360000 }));
								}
								msg.react('➡️');

								collectors.forEach(collector => {
									collector.on('collect', c => {
										const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
										for(const reaction of userReactions.values()) {
											reaction.users.remove(message.author.id);
										}
										getModel(pages[page - 1].fields[emojis.findIndex(emoji => emoji.unicode == c.emoji.name)].name, msg);
									});
								});

								const leftFilter = (reaction, user) => reaction.emoji.name == '⬅️' && user.id == message.author.id;
								const rightFilter = (reaction, user) => reaction.emoji.name == '➡️' && user.id == message.author.id;

								const left = msg.createReactionCollector(leftFilter, { time: 360000 });
								const right = msg.createReactionCollector(rightFilter, { time: 360000 });

								left.on('collect', c => {
									const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
									for(const reaction of userReactions.values()) {
										reaction.users.remove(message.author.id);
									}
									if(page > 1){
										page--;
										pages[page - 1].title = `Choose a brand(Page ${page} of ${Math.floor(cars.length / max)})`;
										msg.edit({ embed: pages[page - 1] });
									}
								});

								right.on('collect', c => {
									const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
									for(const reaction of userReactions.values()) {
										reaction.users.remove(message.author.id);
									}
									if(page < pages.length){
										page++;
										pages[page - 1].title = `Choose a brand(Page ${page} of ${Math.floor(cars.length / max)})`;
										msg.edit({ embed: pages[page - 1] });
									}
								});
							});

							const getModel = (brand, m) => {
								const models = cars.find(c => c.brand == brand).models;
								const model_pages = [];
								let model_page = 1;

								let model_embed= {
									color: shop.menu.color,
									title: `Choose a model(Page ${model_page} of ${Math.floor(models.length / max)})`,
									author: {},
									fields: [],
									timestamp: new Date(),
									footer: {
										text: 'React with the coresponding number to select a model! Use the ⬅️ and ➡️ arrows to change pages',
									},
								};
								model_embed.author.name = message.guild.members.cache.get(shop.owner_id).displayName;
								model_embed.author.icon_url = message.client.users.cache.get(shop.owner_id).avatarURL();

								models.forEach((model, index) => {
									if(model_embed.fields.length >= max){
										model_pages.push(model_embed);
										model_embed = {
											color: shop.menu.color,
											title: `Choose a brand(Page ${index / max} of ${Math.floor(models.length / max)})`,
											author: {},
											fields: [],
											timestamp: new Date(),
											footer: {
												text: 'React with the coresponding number to select a model! Use the ⬅️ and ➡️ arrows to change pages',
											},
										};
										model_embed.author.name = message.guild.members.cache.get(shop.owner_id).displayName;
										model_embed.author.icon_url = message.client.users.cache.get(shop.owner_id).avatarURL();
									}
									model_embed.fields.push({
										name: model,
										value: `React with a ${emojis[model_embed.fields.length].name} to select this brand`,
									});
								});

								m.edit({ embed: model_pages[model_page - 1] }).then(msg => {
									const filters = {};
									const collectors = [];
									msg.react('⬅️');
									for(let i = 0; i < model_pages[model_page - 1].fields.length; i++){
										msg.react(emojis[i].unicode);
										const name = i + 1;
										filters[`${name}`] = (reaction, user) => reaction.emoji.name == emojis[i].unicode && user.id == message.author.id;
										collectors.push(msg.createReactionCollector(filters[`${name}`], { time: 360000 }));
									}
									msg.react('➡️');

									collectors.forEach(collector => {
										collector.on('collect', c => {
											msg.delete();
											message.channel.send(`**Just making sure, is this what you wanted to order? React with a :white_check_mark: to agree:**\n**Brand**: ${brand}\n**Model**: ${model_pages[model_page - 1].fields[emojis.findIndex(emoji => emoji.unicode == c.emoji.name)].name}`).then(l => {
												l.react('✅');
												const filter = (reaction, user) => reaction.emoji.name == '✅' && user.id == message.author.id;
												const collect = l.createReactionCollector(filter, { time: 30000 });
												let collected = false;
												collect.on('collect', () => {
													message.client.users.cache.get(shop.owner_id).send(`${message.member.displayName} has orderd a car recently with these specifications:\n**Brand**: ${brand}\n**Model**:${model_pages[model_page - 1].fields[emojis.findIndex(emoji => emoji.unicode == c.emoji.name)].name}`).then(() => {
														message.channel.send(`Your order request has been sent! The shop owner will be here shortly to collect your payment. Thank you for ordering at **${shop.name}**!`);
														collected = true;
													}).catch(err => {
														console.err(err);
														message.channel.send(`There was a problem while ordering your vehicle. It may be likely that ${message.guild.members.cache.get(shop.owner_id).displayName} has DMs disabled!`);
													});
												});
												collect.on('end', () => {
													if(!collected) message.channel.send('We are sorry but your order wasn\'t placed because you did not react in time :(, run `.buy` to try again');
												});
											});
										});
									});

									const leftFilter = (reaction, user) => reaction.emoji.name == '⬅️' && user.id == message.author.id;
									const rightFilter = (reaction, user) => reaction.emoji.name == '➡️' && user.id == message.author.id;

									const left = msg.createReactionCollector(leftFilter, { time: 360000 });
									const right = msg.createReactionCollector(rightFilter, { time: 360000 });

									left.on('collect', () => {
										const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
										for(const reaction of userReactions.values()) {
											reaction.users.remove(message.author.id);
										}
										if(model_page > 1){
											model_page--;
											model_pages[model_page - 1].title = `Choose a Model(Page ${model_page} of ${Math.floor(models.length / max)})`;
											msg.edit({ embed: model_pages[model_page - 1] });
										}
									});

									right.on('collect', () => {
										const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
										for(const reaction of userReactions.values()) {
											reaction.users.remove(message.author.id);
										}
										if(model_page < model_pages.length){
											model_page++;
											model_pages[model_page - 1].title = `Choose a model(Page ${model_page} of ${Math.floor(models.length / max)})`;
											msg.edit({ embed: model_pages[model_page - 1] });
										}
									});
								});
							};

						}else if(!args.length){
							message.channel.send('Please provide what you want to buy');
						}else{
							message.client.users.cache.get(shop.owner_id).send(`${message.member.username} wants to buy \`${args.join(' ')}\``);
							message.channel.send('You request has been sent!');
						}
					}
				})();
			}else if(message.content.toLowerCase().startsWith('.deliver')){
				const shop = shops.find(s => s.channel == message.channel.id && s.owner_id == message.author.id);

				if(shop.channel_id == shops[2].channel_id){
					const GoogleImages = require('google-images');
					const { google_api_key, cse_key } = require('./config.json');
					const client = new GoogleImages(cse_key, google_api_key);

					client.search(args.slice(0, -1).join(' '), {dominantColor: args[args.length - 1].toLowerCase(), type: 'ANIMATED'}).then(images => {
						console.log()
					});
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