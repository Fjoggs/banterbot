import * as Discord from 'discord.js';
import { fetchData } from '../api/parser';
import { getCurrentGameweek, getLiveData, updateGameweek } from '../api/api';

import { checkForBanter } from './banter';
import { getStatsAll, getStatsTop5, insertOrUpdateUsage, Stats } from '../api/db/general';
import { Intents } from 'discord.js';
import { env } from '../app-env';
import { checkForProfeten } from './profeten';
import { checkForUtil, runAndReport } from './util';

const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    ],
});

let channel: Discord.Channel | undefined;

let testChannel: Discord.Channel | undefined;
let debugChannel: Discord.Channel | undefined;
let mute = true;
let currentYear = 2024;

const preikGuildId = '110121552934100992';
const fjoggsGeneralGuildId = '774731038391140375';
const debugGuildId = '1004475950349693039';
let liveData = {};

client.once('ready', () => {
    console.log(`Logged in as ${client?.user?.tag}!`);
    channel = client.channels.cache.get(preikGuildId); //preik
    testChannel = client.channels.cache.get(fjoggsGeneralGuildId); // fjoggs' general
    debugChannel = client.channels.cache.get(debugGuildId); // botjævlan

    runAndReport(
        async () => {
            console.log('inside 1');
            await fetchData(debugChannel);
            console.log('inside 2');
            liveData = await getLiveData(debugChannel);
            console.log('liveData', liveData);
        },
        debugChannel,
        'Fetch draft data on startup'
    );
    console.log('liveData', liveData);
});

client.login(env.TOKEN);

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
});

client.on('messageReactionAdd', async (reaction) => {
    const unicodeEmojiRegex = /\p{Extended_Pictographic}/gmu;
    if (unicodeEmojiRegex.test(reaction.emoji.name)) {
        console.log('Adding reaction unicode emoji', reaction.emoji.name);
        insertOrUpdateUsage(reaction.emoji.name);
    } else {
        console.log('Adding reaction non unicode emoji', reaction.emoji.name);
        const emojiName = `:${reaction.emoji.name}:`;
        insertOrUpdateUsage(emojiName);
    }
});

client.on('messageCreate', async (message) => {
    const messageIsEqual = (phrase: string) => message.content.toLowerCase() === phrase;
    const messageIncludes = (phrase: string) => message.content.toLowerCase().includes(phrase);

    const isBot = message.author.username === 'BanterBOT';
    const emojiRegex = new RegExp('(:\\w*:)', 'gm');
    const emojiMatches = message.content.match(emojiRegex);
    const unicodeEmojiRegex = /\p{Extended_Pictographic}/gmu;
    const unicodeEmojiMatches = message.content.match(unicodeEmojiRegex);
    if (emojiMatches && !isBot) {
        emojiMatches.forEach((emoji: string) => {
            console.log('Adding emoji: ', emoji);
            insertOrUpdateUsage(emoji);
        });
    }
    if (unicodeEmojiMatches && !isBot) {
        unicodeEmojiMatches.forEach((unicodeEmoji: string) => {
            console.log('Adding unicode emoji: ', unicodeEmoji);
            insertOrUpdateUsage(unicodeEmoji);
        });
    }
    if (messageIsEqual('!stats')) {
        getStatsTop5((emojies: Array<Stats>) => {
            try {
                printStats(emojies);
            } catch (error) {
                //@ts-expect-error
                debugChannel.send(`Command !stats failed with error: ${error}`);
            }
        });
    } else if (messageIsEqual('!statsall')) {
        getStatsAll((emojies: Array<Stats>) => {
            try {
                printStats(emojies);
            } catch (error) {
                //@ts-expect-error
                debugChannel.send(`Command !statsall failed with error: ${error}`);
            }
        });
    } else if (messageIncludes('!mute')) {
        mute = true;
        //@ts-ignore
        channel.send('Kein liveoppdateringer');
    } else if (messageIncludes('!unmute')) {
        const emoji = client.emojis.cache.find((emoji) => emoji.name === 'pagchomp');
        mute = false;
        //@ts-ignore
        channel.send(`Spam back on the menu ${emoji.toString()}`);
    } else if (messageIncludes('!current')) {
        console.log('current', getCurrentGameweek());
        //@ts-ignore
        debugChannel.send(`FPL-gw: ${getCurrentGameweek()}`);
    }
    checkForBanter(message, channel, client, debugChannel);
    checkForProfeten(message, channel, debugChannel);
    checkForUtil(message, testChannel, debugChannel);
});

setInterval(() => {
    console.log('polling for messages');
    updateGameweek(debugChannel);
    // const events = checkForEvents(liveData);
    // const messages = getMessages(events);
    if (isNewYear()) {
        //@ts-ignore
        channel.send('https://www.youtube.com/watch?v=on1Arneo-jc');
    }

    // messages.forEach((message) => {
    //     if (!mute) {
    //         //@ts-ignore
    //         channel.send(message);
    //     }
    // });
    // resetMessages();
}, 60 * 1000); // Every minute

const isNewYear = () => {
    const newYear = new Date().getFullYear();
    if (newYear !== currentYear) {
        currentYear = newYear;
        return true;
    } else {
        return false;
    }
};

const printStats = (emojies: Stats[]) => {
    let message = 'Usage:\n';
    let previousEmoji: Stats = undefined;
    let firstRow = true;
    emojies.forEach((emoji) => {
        if (emoji.usage > 0) {
            const getEmoji = client.emojis.cache.find(
                (emojiCache) => emojiCache.name === emoji.name.replace(/:/g, '')
            );
            let emojiAsMessage = '';
            if (getEmoji) {
                emojiAsMessage = getEmoji.toString();
            } else {
                emojiAsMessage = emoji.name;
            }
            if (!previousEmoji) {
                message += `${emojiAsMessage} ${emoji.usage} \n`;
            } else if (emoji.usage === previousEmoji.usage) {
                message += ` ${emojiAsMessage}`;
            } else if (emoji.usage !== previousEmoji.usage) {
                if (firstRow) {
                    firstRow = false;
                } else {
                    message += ` ${previousEmoji.usage} \n`;
                }
                message += `${emojiAsMessage}`;
            }
            previousEmoji = emoji;
        }
    });
    message += ` ${previousEmoji.usage}`;
    //@ts-ignore
    channel.send(message);
};
