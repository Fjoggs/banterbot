import * as Discord from 'discord.js';
import fetch from 'node-fetch';
import { env } from '../app-env';

const DISCORD_API_URL = 'https://discord.com/api/v9';

export interface Emoji {
    name: string;
    roles: Array<string>;
    id: string;
    require_colons: boolean;
    managed: boolean;
    animated: boolean;
    available: boolean;
}

export const checkForUtil = (msg: Discord.Message, channel, debugChannel) => {
    const messageIncludes = (phrase: string) => msg.content.toLowerCase().includes(phrase);
    if (messageIncludes('!xmas')) {
        fetch(DISCORD_API_URL + '/guilds/774731038391140372/emojis', {
            headers: {
                Authorization: `Bot ${env.TOKEN}`,
            },
        })
            .then((response) => {
                console.log('headers', response.headers);
                response
                    .json()
                    .then((emojies: Array<Emoji>) => {
                        emojies.forEach((emoji) => {
                            console.log('emoji', emoji);
                        });
                    })
                    .catch((error) => {
                        console.log('second level error', error);
                    });
            })
            .catch((error) => {
                console.log('first level error', error);
            });
    } else if (messageIncludes('!swap')) {
        fetch(DISCORD_API_URL + '/guilds/774731038391140372/emojis/858406897413259293', {
            method: 'PATCH',
            body: JSON.stringify({ name: 'test', roles: [] }),
            headers: {
                Authorization: `Bot ${env.TOKEN}`,
            },
        })
            .then((response) => {
                console.log('response.headers', response.headers);
                response
                    .json()
                    .then((emoji: Emoji) => {
                        console.log('emoji', emoji);
                    })
                    .catch((error) => {
                        console.log('second level error', error);
                    });
            })
            .catch((error) => {
                console.log('first level error', error);
            });
    }
};

export const runAndReport = (func: Function, debugChannel, command: string) => {
    try {
        func();
    } catch (error) {
        debugChannel.send(`Command ${command} failed with error: ${error}`);
    }
};
