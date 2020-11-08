import * as Discord from 'discord.js';
import { fetchData, luckernoobOfTheWeek, rittardOfTheWeek, topDickOfTheWeek } from '../api/parser';


const client = new Discord.Client();

fetchData();


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === '!banter') {
        msg.reply(rittardOfTheWeek());
    } else if (msg.content === '!topdick') {
        const emoji = client.emojis.cache.find(emoji => emoji.name === 'ez')
        msg.reply(`${topDickOfTheWeek()} ${emoji.toString()}`)
    } else if (msg.content === "!luckernoob") {
        msg.reply(luckernoobOfTheWeek())
    } else if (msg.content === "!pope") {
        msg.reply("Fuck Pope");
    } else if (msg.content === "!baitley") {
        const emoji = client.emojis.cache.find(emoji => emoji.name === 'kekw')
        msg.reply(emoji.toString())
    }
});

client.login(process.env.TOKEN);