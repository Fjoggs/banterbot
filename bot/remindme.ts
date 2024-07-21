import * as Discord from 'discord.js';
import {
  addShopping,
  finishShopping,
  getShopping,
  initDb,
  Shopping,
  undoneShopping as reopenShopping,
  updateShopping,
} from '../api/db/shopping';

export interface Emoji {
  name: string;
  roles: Array<string>;
  id: string;
  require_colons: boolean;
  managed: boolean;
  animated: boolean;
  available: boolean;
}

let dbInit = false;

export const checkForShopping = (msg: Discord.Message, channel) => {
  const messageIsEqual = (phrase: string) => msg.content.toLowerCase() === phrase;
  const messageIncludes = (phrase: string) => msg.content.toLowerCase().includes(phrase);
  if (messageIncludes('!initremindme')) {
    if (dbInit) {
      console.log('nop');
    } else {
      initDb();
      dbInit = true;
    }
  } else if (messageIncludes('!remindme')) {
    if (messageIsEqual('!remindme')) {
      // show lists of remindme
    } else if (messageIsEqual('!remindme help')) {
      channel.send(
        'Syntax: 1m = 1. minutt, 1h = 1 time, 1d = 1 dag, 1w = 1 uke, 1M = 1 måned, 1y = 1. år'
      );
    } else {
      const split = msg.content.replace('!remindme ', '').split(' ');
      if (split.length > 1) {
        const when = split[0];
        const what = split[1];
        const today = new Date();
        const remindMe = addDays(today, 2);
        channel.send(`Today ${today.toLocaleString()}, new date ${remindMe}`);
        channel.send('!remindme når hva');
      } else {
        channel.send('!remindme når hva');
      }
    }
  }
};

const addDays = (date: Date, days: number) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
