import * as Discord from 'discord.js';
import {
  addShopping,
  finishShopping,
  getShopping,
  getShoppingById,
  ShoppingItemInput,
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

let currentShoppingId: number;

// "øl:6, chips" -> [{name: 'øl', quantity: 6}, {name: 'chips', quantity: 1}]
const parseItems = (line: string): ShoppingItemInput[] =>
  line
    .split(',')
    .map((raw) => raw.trim())
    .filter((raw) => raw.length > 0)
    .map((raw) => {
      const [name, qty] = raw.split(':').map((part) => part.trim());
      const quantity = qty ? parseInt(qty, 10) : 1;
      return { name, quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1 };
    });

const formatItems = (items: ShoppingItemInput[]) =>
  items.map((item) => (item.quantity > 1 ? `${item.name} (${item.quantity})` : item.name)).join(', ');

export const checkForShopping = (msg: Discord.Message, channel, debugChannel) => {
  const messageIsEqual = (phrase: string) => msg.content.toLowerCase() === phrase;
  const messageIncludes = (phrase: string) => msg.content.toLowerCase().includes(phrase);
  const discordId = msg.author.id;

  if (messageIncludes('!shopping')) {
    if (messageIsEqual('!shopping')) {
      getShopping((lists) => {
        const active = lists.filter((list) => list.status === 'active');
        if (active.length === 0) {
          channel.send('Ingen lister');
          return;
        }
        Promise.all(
          active.map(
            (list) =>
              new Promise<string>((resolve) => {
                getShoppingById(list.id, (detail) => {
                  const itemLines = formatItems(detail?.items ?? []);
                  resolve(`\nliste id: ${list.id} (${list.name})\n------\n${itemLines}\n`);
                });
              })
          )
        ).then((blocks) => channel.send(blocks.join(''), { code: true }));
      });
    } else {
      const line = msg.content.replace('!shopping ', '').trim();
      const items = parseItems(line);
      if (items.length === 0) {
        channel.send('!shopping vare1, vare2:antall, ...');
        return;
      }
      const name = `Liste ${new Date().toLocaleDateString('no-NO')}`;
      addShopping(name, items, discordId, (id) => {
        if (!id) {
          channel.send('Klarte ikke å opprette liste');
          return;
        }
        currentShoppingId = id;
        channel.send(`Opprettet liste med id ${id} og stuff ${formatItems(items)}`);
      });
    }
  } else if (messageIncludes('!liste')) {
    const shoppingId = Number(msg.content.toLowerCase().replace('!liste ', ''));
    if (shoppingId) {
      getShoppingById(shoppingId, (list) => {
        if (list) {
          currentShoppingId = shoppingId;
          channel.send(`Aktiv liste er nå ${currentShoppingId}`);
        } else {
          channel.send(`Fant ingen liste med id ${shoppingId}`);
        }
      });
    } else {
      channel.send('kis');
    }
  } else if (messageIncludes('!kjøp')) {
    const line = msg.content.replace('!kjøp', '').trim();
    const items = parseItems(line);
    if (!currentShoppingId) {
      channel.send('Ingen aktiv liste. Sett med !liste nummer');
      return;
    }
    if (items.length === 0) {
      channel.send('!kjøp vare1, vare2:antall, ...');
      return;
    }
    updateShopping(currentShoppingId, items, discordId, (updated) => {
      if (updated) {
        channel.send(`Oppdaterte liste ${currentShoppingId} med stuff ${formatItems(items)}`);
      } else {
        channel.send(`Gutta ække på butta lenger kis (liste ${currentShoppingId} er stengt)`);
      }
    });
  } else if (messageIncludes('!ferdig')) {
    if (!currentShoppingId) {
      channel.send('Ingen aktiv liste å fullføre');
      return;
    }
    finishShopping(currentShoppingId, true, () => {
      channel.send('Ferri med shopping');
      currentShoppingId = undefined;
    });
  } else if (messageIncludes('!ikkeferdig')) {
    const shoppingId = Number(msg.content.toLowerCase().replace('!ikkeferdig', '').trim());
    if (shoppingId) {
      currentShoppingId = shoppingId;
      reopenShopping(shoppingId, () => {
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
