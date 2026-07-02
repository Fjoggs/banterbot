import * as readline from 'readline';
import { checkForBanter } from './banter';
import { checkForProfeten } from './profeten';
import { checkForUtil } from './util';
import { checkForShopping } from './shopping';
import { checkForRemindMe } from './remindme';
import { checkForDraft } from './draft';
import { getStatsAll, getStatsTop5, Stats } from '../api/db/general';
import { getCurrentGameweek } from '../api/api';

const send = (label: string) => (message: unknown) => {
  const text = typeof message === 'string' ? message : JSON.stringify(message);
  console.log(`\n[${label}] ${text}`);
};

const channel = { send: send('channel') } as any;
const testChannel = { send: send('testChannel') } as any;
const debugChannel = { send: send('debugChannel') } as any;

const mockEmoji = {
  id: '0',
  name: 'mock',
  animated: false,
  toString: () => '<:mock:0>',
};

const client = {
  channels: { cache: { get: () => channel } },
  emojis: { cache: { find: () => mockEmoji } },
} as any;

const makeMessage = (content: string) =>
  ({
    content,
    channelId: 'debug-channel',
    author: { id: 'debug-user', username: 'DebugUser', bot: false },
  } as any);

// Reproduces bot/bot.ts's printStats verbatim (including its crash-on-empty-usage bug)
// so commands fail here the same way they'd fail for real. Uses emoji.name directly
// instead of client.emojis.cache.find, since the mock client has no real emoji cache.
const sendChunked = (targetChannel, text: string, limit = 1900) => {
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= limit) {
      targetChannel.send(remaining);
      break;
    }
    let splitAt = remaining.lastIndexOf('\n', limit);
    if (splitAt <= 0) splitAt = remaining.lastIndexOf(' ', limit);
    if (splitAt <= 0) splitAt = limit;
    targetChannel.send(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).replace(/^\s+/, '');
  }
};

const printStats = (emojies: Stats[]) => {
  let message = 'Usage:\n';
  let previousEmoji: Stats = undefined;
  let firstRow = true;
  emojies.forEach((emoji) => {
    if (emoji.usage > 0) {
      const emojiAsMessage = emoji.name;
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
  sendChunked(channel, message);
};

// Mirrors the dispatch block in bot/bot.ts's messageCreate handler.
// Keep in sync if commands are added/changed there.
const dispatch = (content: string) => {
  const message = makeMessage(content);
  const messageIncludes = (phrase: string) => message.content.toLowerCase().includes(phrase);
  const isBot = message.author.username === 'BanterBOT';

  if (messageIncludes('!statsall')) {
    getStatsAll((emojies: Stats[]) => {
      try {
        printStats(emojies);
      } catch (error) {
        debugChannel.send(`Command !statsall failed with error: ${error}`);
      }
    });
  } else if (messageIncludes('!stats')) {
    getStatsTop5((emojies: Stats[]) => {
      try {
        printStats(emojies);
      } catch (error) {
        debugChannel.send(`Command !stats failed with error: ${error}`);
      }
    });
  } else if (messageIncludes('!mute')) {
    channel.send('Kein liveoppdateringer');
  } else if (messageIncludes('!unmute')) {
    channel.send(`Spam back on the menu ${mockEmoji.toString()}`);
  } else if (messageIncludes('!current')) {
    debugChannel.send(`FPL-gw: ${getCurrentGameweek()}`);
  }

  if (!isBot) {
    checkForBanter(message, channel, client, debugChannel);
    checkForProfeten(message, channel, channel);
    checkForUtil(message, testChannel, debugChannel);
    checkForShopping(message, channel, debugChannel);
    checkForRemindMe(message, channel, debugChannel, client);
    checkForDraft(message, channel, debugChannel, client);
  }
};

console.log('BanterBOT debug console.');
console.log('Type a message as if sending it in Discord (e.g. "!stats"). Ctrl+C to quit.\n');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: '> ' });
rl.prompt();
rl.on('line', (line) => {
  const trimmed = line.trim();
  if (trimmed) {
    dispatch(trimmed);
  }
  rl.prompt();
});
rl.on('close', () => process.exit(0));
