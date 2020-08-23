const { prefix } = require('../config.json');

module.exports = {
	name: 'guessing-game',
	aliases: ['guess-the-number', 'guess-game'],
	description: `Try to guess the number I am thinking of! Choose the range you want to play in(Recomended range: 0 100. So for example: \`${prefix}${this.name} 0 100\`)`,
	usage: '<minimum> <maximum>',
	category: 'Games',
	execute(message, args){
		if(isNaN(args[0]) || isNaN(args[1])) return message.channel.send('Please provide valid numbers');
		const number = Math.floor(Math.random() * parseInt(args[1])) + parseInt(args[0]);
		let guess;
		let guesses = 0;
		let result;

		message.channel.send(`Try to guess the number! Minimum: ${args[0]}, Maximum: ${args[1]}`);

		while(guess != number){
			message.channel.send(`You have ${5 - guesses} guesses! Type in your guess right now:`).then(() => {
				const filter = m => message.author.id == m.author.id;

				message.channel.awaitMessages(filter, { time: 10000, max: 1, errors: ['time'] })
					.then(messages => {
						if(isNaN(messages.first().content)){ 
							guesses--;
						}
						guess = parseInt(messages.first().content);
						guesses++;
					})
					.catch(() => {
						message.channel.send('You did not enter any input!');
						guess = number;
						result = 'timeout';
					});
			});
		}

		if(result == 'timeout'){
			return message.channel.send('You did not type any input in time! Game over :(');
		}
	},
};