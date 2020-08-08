module.exports = {
	name: 'kick',
	description: 'Kick the user by the mention or by their id. **Make sure you don\'t mention anyone else in the message or the person who also got mentioned might get banned**',
	usage: '<@user or user id> <reason for kicking(Optional)>',
	category: 'Moderation',
	args: true,
	guildOnly: true,
	execute(message, args){
		if(!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('You need the Ban Members permission');
		if(!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send(`I need the Ban Members permission. Please contact "${message.guild.owner.user.tag}" and tell them to give me the Ban Members permission`);

		if (!message.mentions && args[0].length == 18) return message.channel.send('Please mention the user you want to kick or provide the id of the user');

		if(args[0].length == 18){
			if(args[1]){
				const id = args.shift();
				message.guild.members.cache.get(args[0]).kick(args.join(' ')).then(member => {
					message.guild.owner.send(`${member.tag} Has been kicked from ${message.guild.name} by ${message.author.tag} for \`${args.join(' ')}\``);
					return message.channel.send(`Successfuly kicked ${member.tag} by ${message.author.tag} for \`${args.join(' ')}\``);
				});
			}
			message.guild.members.cache.get(args[0]).kick().then(member => {
				message.guild.owner.send(`${member.tag} Has been kicked from ${message.guild.name} by ${message.author.tag} No reason spcefified`);
				return message.channel.send(`Successfuly kicked ${member.tag} by ${message.author.tag} for \`${args.join(' ')}\``);
			});
		}

		if (args[0].startsWith('<@') && args[0].endsWith('>')) {
			let mention = args[0].slice(2, -1);

			if (mention.startsWith('!')) {
				mention = mention.slice(1);
			}

			message.guild.members.cache.get(mention);
		}
	},
};
