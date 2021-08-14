import * as Discord from 'discord.js';
import { fetchData } from '../api/parser';
import { checkForEvents, getLiveData, getMessages, resetMessages } from '../api/api';

import { checkForBanter } from './banter';
import { checkForProfeten } from './profeten';

const client = new Discord.Client();

let liveData = {};
const fetchLiveData = async () => {
    await fetchData();
    liveData = await getLiveData();
};
fetchLiveData();

let channel;
let testChannel;
let mute = false;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    channel = client.channels.cache.get('110121552934100992'); //preik
    testChannel = client.channels.cache.get('774731038391140375'); // fjoggs' general
});

client.on('message', (msg) => {
    const messageIncludes = (phrase: string) => msg.content.toLowerCase().includes(phrase);

    if (messageIncludes('!mute')) {
        mute = true;
        channel.send('Kein liveoppdateringer');
    } else if (messageIncludes('!unmute')) {
        const emoji = client.emojis.cache.find((emoji) => emoji.name === 'pagchomp');
        mute = false;
        channel.send(`Spam back on the menu ${emoji.toString()}`);
    }

    checkForBanter(msg, channel, client);
    checkForProfeten(msg, channel);
});

client.login(process.env.TOKEN);

setInterval(() => {
    console.log('polling for messages');
    const events = checkForEvents(liveData);
    console.log('events', events)
    const messages = getMessages(events);
    console.log('messages', messages)
    messages.forEach((message) => {
        if (!mute) {
            channel.send(message);
        }
    });
    resetMessages();
}, 10 * 1000); // Every minute
