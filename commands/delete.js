module.exports = {
	name: 'delete',
	description: 'Will delete it\'s own message in the number of seconds specified',
	args: true,
	usage: '<number of seconds to wait>',
	category: 'Random',
	args_num: 1,
	execute(message, args) {
		if(args[0] != 1) {
			message.channel.send(`This message will be deleted in ${args[0]} seconds`);
		}else{
			message.channel.send('This message will be deleted in 1 second');
		}

		setTimeout(function() {
			message.channel.bulkDelete(1, true);
		}, args[0] * 1000);
	},
};
