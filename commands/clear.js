module.exports = {
	name: 'clear',
	description: 'Delete the last _n_ messages where _n_ is the first argument',
	usage: '<number of messages to delete>',
	args: true,
	args_num: 1,
	category: 'Moderation',
	guildOnly: true,
	execute(message, args){
		if(message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('You don\'t have the "Manage Messages" permission');
		if(!parseInt(args[0])) return message.reply('Please provide the number of messages to delete');
		message.channel.bulkDelete(parseInt(args[0]))
			.then(messages => console.log(`Bulk deleted ${messages.size} messages`))
			.catch(console.error);
	},
};
