import * as Discord from 'discord.js';
import { fetchData, rittardOfTheWeek } from '../api/parser';


const client = new Discord.Client();

fetchData();


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === '!banter') {
        msg.reply(rittardOfTheWeek());
    }
});

client.login(process.env.TOKEN);