const {questions, answers} = require('../jokes.json');

module.exports = {
	name: 'joke',
	description: 'Will return a random joke from a list of jokes, and after 10 seconds will reveal the answer/pun to the joke',
	cooldown: 5,
	category: 'Fun',
	execute(message, args) {
		const index = Math.floor(Math.random() * (Math.floor(questions.length - 1) - Math.ceil(0) + 1)) + Math.ceil(0);

		if(args[0] == 'index') {
			message.channel.send(`Joke Index: ${index}\n${questions[index]}`);
		}else if(args[0] == 'list') {
			return message.channel.send(questions);
		}else{
			message.channel.send(`${questions[index]}`);
		}
		setTimeout(function() {
			if(args[0] == 'index') {
				message.channel.send(`Joke Index: ${index}\n${answers[index]}`);
			}else{
				message.channel.send(`${answers[index]}`);
			}
		}, this.cooldown * 1000);
	},
};
