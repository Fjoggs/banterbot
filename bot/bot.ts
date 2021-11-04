import * as Discord from 'discord.js';
import { fetchData } from '../api/parser';
import { checkForEvents, getLiveData, getMessages, resetMessages } from '../api/api';

import { checkForBanter } from './banter';
import { checkForProfeten } from './profeten';
import { getStats, insertOrUpdateUsage, Stats } from '../api/db/general';
import { Intents } from 'discord.js';

const client = new Discord.Client();

let liveData = {};
const fetchLiveData = async () => {
    await fetchData();
    liveData = await getLiveData();
};
fetchLiveData();

let channel;
let testChannel;
let mute = true;
let currentYear = 2021;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    channel = client.channels.cache.get('110121552934100992'); //preik
    testChannel = client.channels.cache.get('774731038391140375'); // fjoggs' general
});

client.on('message', (msg) => {
    const messageIncludes = (phrase: string) => msg.content.toLowerCase().includes(phrase);
    const isBot = msg.author.username === 'BanterBOT';

    const emojiRegex = new RegExp('(:\\w*:)', 'gm');
    const emojiMatches = msg.content.match(emojiRegex);
    if (emojiMatches && !isBot) {
        emojiMatches.forEach((emoji: string) => {
            insertOrUpdateUsage(emoji, (row) => {
                console.log(`Updated row for ${emoji}`, row);
            });
        });
    } else if (messageIncludes('!stats')) {
        getStats((emojies: Array<Stats>) => {
            let message = 'Usage:\n';
            emojies.forEach((emoji) => {
                if (emoji.usage > 0) {
                    const getEmoji = client.emojis.cache.find(
                        (emojiCache) => emojiCache.name === emoji.name.replace(/:/g, '')
                    );
                    if (getEmoji) {
                        message += `${getEmoji.toString()}  ${emoji.usage}\n`;
                    } else {
                        message += `${emoji.name} ${emoji.usage}\n`;
                    }
                }
            });
            channel.send(message);
        });
    } else if (messageIncludes('!mute')) {
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
    console.log('events', events);
    const messages = getMessages(events);
    if (isNewYear(new Date())) {
        channel.send('https://www.youtube.com/watch?v=on1Arneo-jc');
    }
    messages.forEach((message) => {
        if (!mute) {
            channel.send(message);
        }
    });
    resetMessages();
}, 60 * 1000); // Every minute

const isNewYear = (date: Date) => {
    const newYear = date.getFullYear();
    if (newYear !== currentYear) {
        currentYear = newYear;
        return true;
    } else {
        return false;
    }
};
