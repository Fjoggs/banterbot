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
let currentShoppingId: number;

export const checkForShopping = (msg: Discord.Message, channel, debugChannel) => {
  const messageIsEqual = (phrase: string) => msg.content.toLowerCase() === phrase;
  const messageIncludes = (phrase: string) => msg.content.toLowerCase().includes(phrase);
  if (messageIncludes('!init')) {
    if (dbInit) {
      console.log('nop');
    } else {
      initDb();
      dbInit = true;
    }
  } else if (messageIncludes('!shopping')) {
    if (messageIsEqual('!shopping')) {
      getShopping((shoppingLists: Array<Shopping>) => {
        let shoppingId: number;
        let message = '';
        shoppingLists.forEach((shoppingList) => {
          if (!shoppingList.completed) {
            message += `\n liste id: ${shoppingList.shoppingId})\n------\n`;
            shoppingId = shoppingList.shoppingId;
            console.log(shoppingList.items);
            const items = shoppingList.items.split(',');
            items.forEach((item) => {
              message += `${item.trim()}\n`;
            });
          }
        });
        if (message) {
          channel.send(message, { code: true });
        } else {
          channel.send('Ingen lister');
        }
      });
    } else {
      const line = msg.content.replace('!shopping ', '').trim();
      const items = line.split(',');
      addShopping(items, (id: number) => {
        channel.send(`Opprettet liste med id ${id} og stuff ${items.toString()}`);
        currentShoppingId = id;
      });
    }
  } else if (messageIncludes('!liste')) {
    currentShoppingId = Number(msg.content.toLowerCase().replace('!liste ', ''));
    if (currentShoppingId) {
      channel.send(`Aktiv liste er nå ${currentShoppingId}`);
    } else {
      channel.send('kis');
    }
  } else if (messageIncludes('!kjøp')) {
    const line = msg.content.replace('!kjøp', '').trim();
    const items = line.split(',');
    if (currentShoppingId) {
      updateShopping(currentShoppingId, items, (updated: boolean) => {
        if (updated) {
          channel.send(`Oppdaterte liste ${currentShoppingId} med stuff ${items.toString()}`);
        } else {
          channel.send(`Gutta ække på butta lenger kis (liste ${currentShoppingId} er stengt)`);
        }
      });
    } else {
      channel.send('Ingen aktiv liste. Sett med !liste nummer');
    }
  } else if (messageIncludes('!ferdig')) {
    finishShopping(currentShoppingId, true, () => {
      currentShoppingId = undefined;
      channel.send('Ferri med shopping');
    });
  } else if (messageIncludes('!ikkeferdig')) {
    currentShoppingId = Number(msg.content.toLowerCase().replace('!ikkeferdig', ''));
    if (currentShoppingId) {
      reopenShopping(currentShoppingId, () => {
        channel.send(`Lista åpen, aktiv liste satt til  ${currentShoppingId}`);
      });
    } else {
      channel.send('!ikkeferdig nummer-på-liste');
    }
  }
};

export const runAndReport = (func: Function, debugChannel, command: string) => {
  try {
    func();
  } catch (error) {
    debugChannel.send(`Command ${command} failed with error: ${error}`);
  }
};
