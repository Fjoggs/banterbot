import * as Discord from 'discord.js';
import {
  addReminder,
  completeReminder,
  getFutureReminders,
  getReminders,
  initDb,
  Reminder,
} from '../api/db/remindme';
import { runAndReport } from './util';

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

let upcomingReminders: Reminder[] = [];

export const checkForReminders = (client: Discord.Client) => {
  setInterval(() => {
    console.log('checking reminders');
    getFutureReminders((reminders: Reminder[]) => {
      upcomingReminders = reminders;
      reminders.forEach((reminder) => {
        console.log(reminder);
        const now = Date.now();
        const thirtySeconds = 30 * 1000;
        if (reminder.time - thirtySeconds < now) {
          console.log('reminder within 30 seconds');
          reminder.inProgress = false;
          if (upcomingReminders.find((element) => element.id === reminder.id)) {
            console.log('Already added');
          } else {
            upcomingReminders.push(reminder);
          }
        }
      });
    });
  }, 30 * 1000); // Every 30 seconds

  setInterval(() => {
    console.log('checking upcoming reminders', upcomingReminders);
    upcomingReminders.forEach((reminder, index) => {
      const now = Date.now();
      const errorMargin = 2 * 1000; // 2 seconds
      const maxMargin = now + errorMargin;
      const minMargin = now - errorMargin;
      if (maxMargin > reminder.time && reminder.time > minMargin) {
        if (!reminder.inProgress) {
          reminder.inProgress = true;
          client.users.send(reminder.who, reminder.message);
          completeReminder(reminder.id, () => {
            upcomingReminders.splice(index, 1);
            console.log('List', upcomingReminders);
          });
        }
      }
    });
  }, 1000); // Every second
};

export const checkForRemindMe = (msg: Discord.Message, channel, debugChannel, client) => {
  client = client;
  const messageIsEqual = (phrase: string) => msg.content.toLowerCase() === phrase;
  const messageIncludes = (phrase: string) => msg.content.toLowerCase().includes(phrase);
  if (messageIncludes('!initremindme')) {
    runAndReport(
      () => {
        if (dbInit) {
          console.log('nop');
        } else {
          initDb();
          dbInit = true;
        }
      },
      debugChannel,
      '!initremindme'
    );
  } else if (messageIncludes('!remindme')) {
    runAndReport(
      () => {
        if (messageIsEqual('!remindme')) {
          getFutureReminders((reminders: Reminder[]) => {
            let message = '```Hvem | hva | når\n-----------------------------------\n';
            reminders.forEach((reminder) => {
              console.log(reminder.time);
              const when = new Date(Number(reminder.time));
              message += `${reminder.who} | ${reminder.message} | ${when.toLocaleString(
                'nb-NO'
              )}\n`;
            });
            channel.send(message + '```');
          });
        } else if (messageIsEqual('!remindme help')) {
          channel.send(
            'Syntax: 1m = 1. minutt, 1h = 1 time, 1d = 1 dag, 1w = 1 uke, 1M = 1 måned, 1y = 1. år'
          );
        } else {
          const split = msg.content.replace('!remindme ', '').split(' ');
          if (split.length > 1) {
            const today = new Date();
            let remindMe = today;
            const userId = msg.author.id;
            const who = msg.author.username;
            const when = split.shift();
            console.log('when', when);
            when.replace(/(\d+)(\w)/, (_, digit, type) => {
              let match = true;
              if (type.search(/[M]/) !== -1) {
                remindMe.setMonth(today.getMonth() + Number(digit));
                console.log('hello month');
              } else if (type.search(/[m]/) !== -1) {
                console.log('minutes', digit);
                remindMe.setMinutes(today.getMinutes() + Number(digit));
              } else if (type.includes('h')) {
                remindMe.setHours(today.getHours() + Number(digit));
              } else if (type.includes('d')) {
                remindMe.setDate(today.getDate() + Number(digit));
              } else if (type.includes('w')) {
                remindMe.setDate(today.getDate() + Number(digit) * 7);
              } else if (type.includes('y')) {
                remindMe.setFullYear(today.getFullYear() + Number(digit));
              } else {
                match = false;
                channel.send(
                  'Syntax: 1m = 1. minutt, 1h = 1 time, 1d = 1 dag, 1w = 1 uke, 1M = 1 måned, 1y = 1. år'
                );
              }
              if (match) {
                const what = split.join(' ');
                addReminder(what, userId, remindMe, () => {
                  channel.send(
                    `Sender påminnelse **${remindMe.toLocaleString(
                      'nb-NO'
                    )}** til **${who}** pga **${what}**`
                  );
                });
              }
              return '';
            });
          } else {
            channel.send('!remindme når hva');
          }
        }
      },
      debugChannel,
      '!remindme'
    );
  }
};

const sendMessage = (msg, what) => {
  msg.author.send(what);
};
