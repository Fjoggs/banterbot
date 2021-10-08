import * as Discord from 'discord.js';
import fetch from 'node-fetch';
import { rittardOfTheWeek, topDickOfTheWeek, luckernoobOfTheWeek } from '../api/parser';

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

let jamesCounter = 0;

export const generateDb = (msg: Discord.Message, channel, client) => {
    const messageIncludes = (phrase: string) => msg.content.toLowerCase().includes(phrase);
    if (messageIncludes('!akkuratnå')) {
        const politics = [
            'AP',
            'Venstre',
            'FRP',
            'Høyre',
            'MDG',
            'Miljøpartiet de Brune',
            'Rødt',
            'Hvit valgallianse',
        ];

        const response = [
            '**DOMMER**',
            'han kommentatoren er så jævlig rittard',
            '*random grove gloser etter en totalt irrelevant hendelse*',
            'ser dere ikke linær?',
            'det går så treigt',
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send();
    }
};
