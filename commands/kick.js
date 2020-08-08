module.exports = {
	name: 'kick',
	description: 'Kick the user by the mention. **Make sure you don\'t mention anyone else in the message or the person who also got mentioned might get kicked!**',
	usage: '<@user> <reason for kicking(Optional)>',
	category: 'Moderation',
	args: true,
	guildOnly: true,
	execute(message, args){
		if(!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send('You need the Ban Members permission');
		if(!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send(`I need the Ban Members permission. Please contact "${message.guild.owner.user.tag}" and tell them to give me the Ban Members permission`);

		if (!message.mentions && args[0].length == 18) return message.channel.send('Please mention the user you want to kick');

		const member = message.mentions.members.first();
		if(!member)
		{return message.reply('Please mention a valid member of this server');}
		if(!member.kickable)
		{return message.reply('I cannot kick this user! Do they have a higher role?');}

		let reason = args.slice(1).join(' ');
		if(!reason) reason = 'No reason provided';

		member.kick().then(m => {
			console.log(JSON.stringify(member));
			m.guild.owner.send(`\`${member.displayName}\` has been kicked from \`${message.guild.name}\` by \`${message.author.tag}\` for \`${reason}\``);
			return message.channel.send(`Successfuly kicked ${member.displayName} by ${message.author.tag} for \`${reason}\``);
		});
	},
};
