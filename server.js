require('dotenv').config();

const tmi = require('tmi.js');

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const commands = {
    hello:{
        response: "GivePLZ Hello~! TakeNRG"
    },
    upvote: {
        response: (argument) => `User ${argument} was just upvoted`
    },
    echo: {
        response: (command, argument) => `Command "${command}" found with argument "${argument}"`
    }
}

const client = new tmi.Client({
	channels: [ 'bongokaibot', 'kaikendoh' ],
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    }
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    const isNotBot = tags.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME;

    if (!isNotBot) return;

    const [raw, command, argument] = message.match(regexpCommand);

    console.log(raw);
    console.log(command);
    console.log(argument);

    const {response} = commands[command] || {};
    
    console.log(response);

    if (typeof response === 'function') {
        client.say(channel, response(argument))
    } else if (typeof response === 'string'){
        client.say(channel, response);
    }

	// "Alca: Hello, World!"
	console.log(`${tags['display-name']}: ${message}`);
});