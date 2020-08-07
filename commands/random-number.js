const { prefix } = require('../config.json');

module.exports = {
	name: 'random-number',
	aliases: ['rand-num', 'rand-number', 'random-num'],
	cooldown: 3,
	description: `Return a random number in the specified range. Example: \`${prefix}${this.name} 1 5\` Will return a random number from 1 to 5. **Do not seperate the minimum and maximum with commas. Seperate them with spaces!**`,
	usage: '<minimum> <maximum>',
	category: 'Fun',
	args: true,
	args_num: 2,
	execute(message, args) {
		if(isNaN(Math.floor(Math.random() * (Math.floor(parseInt(args[1])) - Math.ceil(parseInt(args[0])) + 1)) + Math.ceil(parseInt(args[0])))){
			throw new Error('Min and Max are seperated by comma');
		}else{
			message.channel.send(`${Math.floor(Math.random() * (Math.floor(parseInt(args[1])) - Math.ceil(parseInt(args[0])) + 1)) + Math.ceil(parseInt(args[0]))}`);
		}
	},
};
