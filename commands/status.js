module.exports = {
	name: 'status',
	description: 'Will return your status. List of possibile statuses are `online`, `idle`, `offline, and dnd` or **Do not disturb**',
	category: 'Info',
	execute(message, args){
		switch(message.author.presence.status){
		case 'online':
			return message.channel.send('Your Status: :green_circle: online');
		case 'idle':
			return message.channel.send('Your Status: :orange_circle: idle');
		case 'offline':
			return message.channel.send('Your Status: :black_circle: offline/invisible');
		case 'dnd':
			return message.channel.send('Your Status: :red_circle: dnd(Do not disturb)');
		}
	},
};
