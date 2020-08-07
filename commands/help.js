const { prefix, bot_info, owner_info } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'List all of the available commands or get information and usage about a particular command',
	aliases: ['help', 'helpme', 'commands', 'command', 'cmd', 'cmds'],
	usage: '<optional command name or category>',
	cooldown: 2,
	category: 'Info',
	execute(message, args) {
		const { commands } = message.client;

		if (!args.length) {
			return message.channel.send({	embed: {
				color: '#' + Math.floor(Math.random() * 16777215).toString(16),
				title: `${bot_info.name} Categories List`,
				author: {
					name: 'Martin Maroyan',
					icon_url: owner_info.avatar_url,
					url: 'https://www.thehowtobrainiac.com',
				},
				fields: [
					{
						name: ':bar_chart: Info',
						value: `\`${prefix}help info\``,
						inline: true,
					},
					{
						name: ':soccer: Fun',
						value: `\`${prefix}help fun\``,
						inline: true,
					},
					{
						name: ':grey_question: Random',
						value: `\`${prefix}help random\``,
						inline: true,
					},
					{
						name: ':tools: Utility',
						value: `\`${prefix}help utility\``,
						inline: true,
					},
					{
						name: ':game_die: Games',
						value: `\`${prefix}help games\``,
						inline: true,
					},
					{
						name: ':loudspeaker: Moderation',
						value: `\`${prefix}help moderation\``,
						inline: true,
					},
				],
			}});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
		let category;

		const categories = ['info', 'fun', 'random', 'games', 'utility', 'moderation'];
		const isCategory = categories.includes(name);
		if (!isCategory) {
			if(!command){
				return message.reply('that\'s not a valid category or command!');
			}
		}

		// Name, Aliases, Description, Usage

		if(isCategory){
			category = args[0].toLowerCase();
			const data = [];
			commands.forEach((value, key, map) => {
				if(value.category.toLowerCase() == category && (!value.private || (value.private && message.channel.type == 'dm' && message.author.id == owner_info.id))){
					data.push(`\`${value.name}\``);
				}
			});
			let newData;
			if(!data.length){
				newData = 'We are are still working on this category :hammer:';
			}else{
				newData = data.join(', ');
			}
			return message.channel.send({embed: {
				color: '#' + Math.floor(Math.random() * 16777215).toString(16),
				title: `Commands in the \`${category.charAt(0).toUpperCase() + category.slice(1)}\` category:`,
				fields: [
					{
						name: '-----',
						value: `${newData}`,
					},
				],
				footer: {
					text: `Use "${prefix}help" and then the command you want to get more info on`,
				},
			}});
		}

		const embed = new Discord.MessageEmbed()
			.setColor('#FF0000')
			.setTitle(`Information obout the \`${command.name}\` command`)
			.addFields(
				{name: '**Name**', value: `${command.name}`},
			);

		if (command.description) embed.addFields({name: '**Description:**', value: `${command.description}`});
		if (command.usage) embed.addFields({name: '**Usage:**', value: `\`${prefix}${command.name} ${command.usage}\``});
		if (!command.usage) embed.addFields({name: '**Usage:**', value: `\`${prefix}${command.name}\``});
		if (command.aliases) embed.addFields({name: '**Aliases:**', value: `${command.aliases.join(', ')}`});

		embed.addFields({name: '**Cooldown:**', value: `${command.cooldown || 3} second(s)`});
		embed.addFields({name: '**Category:**', value: `${command.category}`});

		message.channel.send(embed);
	},
};
