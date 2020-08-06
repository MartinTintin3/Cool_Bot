module.exports = {
	name: 'dice',
	aliases: ['roll'],
	cooldown: 3,
	description: 'Will roll a dice and in 2 seconds will display the result',
	category: 'Fun',
	execute(message, args) {
		message.channel.send('Rolling dice...').then((sentMessage) => {
			setTimeout(function(){
				return sentMessage.edit(`Rolled a ${Math.floor(Math.random() * 6 + 1)}`);
			}, 2000);
		});
	},
};
