import { Channel } from 'discord.js';
import { rittardOfTheWeek, topDickOfTheWeek, luckernoobOfTheWeek } from '../../api/parser';

interface Command {
  name: string;
  action: Function | string;
  emojiName?: string;
}

export const banterCommands: Command[] = [
  {
    name: 'rittard',
    action: rittardOfTheWeek,
  },
  {
    name: 'ban',
    action: 'Banning Molbs',
  },
  {
    name: 'topdick',
    action: topDickOfTheWeek,
    emojiName: 'ez',
  },
  {
    name: 'luckernoob',
    action: luckernoobOfTheWeek,
  },
  {
    name: 'pope',
    action: 'Fuck Pope',
  },
  {
    name: 'baitley',
    action: '',
    emojiName: 'kekw',
  },
  {
    name: 'var',
    action: () => {
      const response = ['offside', 'onside', 'dive', 'gåll', 'felling'];
      const luckyNumber = Math.floor(Math.random() * response.length);
      return `Soleklar ${response[luckyNumber]}`;
    },
  },
  {
    name: 'toto',
    action:
      'https://cdn.discordapp.com/attachments/110121552934100992/917145089862676520/totorage.gif',
  },
  {
    name: 'fia',
    action: () => {
      const drivers = [
        'Max',
        'Hamilton',
        'Bottas',
        'Perez',
        'Norris',
        'Leclerc',
        'Sainz',
        'Ricciardo',
        'Gasly',
        'Alonso',
        'Ocon',
        'Vettel',
        'Stroll',
        'Tsunoda',
        'Russell',
        'Albon',
        'Latifi',
        'Zhou',
        'Schumacher',
        'Magnussen',
      ];
      const randomDriver = Math.floor(Math.random() * drivers.length);
      const response = [
        'Let them race',
        "Don't let them race",
        `5 sek bot til ${drivers[randomDriver]}`,
        'Hamilton pls',
      ];
      const luckyNumber = Math.floor(Math.random() * response.length);
      return `${response[luckyNumber]}`;
    },
  },
  {
    name: 'rice',
    action: () => {
      const response = ['West Ham', 'Chelsea', 'United', 'City', 'Enga', 'Sleivdal'];
      const luckyNumber = Math.floor(Math.random() * response.length);
      return `Rice til ${response[luckyNumber]}`;
    },
  },
  {
    name: 'nuppe',
    action: () => {
      const response = [`DREP 'N. DREP MÆLBS!`];
      const luckyNumber = Math.floor(Math.random() * response.length);
      return response[luckyNumber];
    },
  },
  {
    name: 'molbs',
    action: () => {
      const essentialArsenalPlayers = [
        'Jesus',
        'Tierney',
        'Zinchenko',
        'Saka',
        'Xhaka',
        'Martinelli',
        'White',
        'Ødegaard',
      ];
      const randomArsenalPlayer = Math.floor(Math.random() * essentialArsenalPlayers.length);
      const response = [
        '**DOMMER**',
        `han kommentatoren er så jævlig rittard`,
        '*random grove gloser etter en totalt irrelevant hendelse*',
        'ser dere ikke linær?',
        'det går så treigt',
        `er ${essentialArsenalPlayers[randomArsenalPlayer]} essential?`,
        `Orker ikke`,
      ];
      const luckyNumber = Math.floor(Math.random() * response.length);
      return response[luckyNumber];
    },
  },
  {
    name: 'semb',
    action: () => {
      const response = [
        'Skal det bli noen poeng så må de score et mål her',
        'Kampen er kjemisk fritt for målsjanser',
        'Pasningsfeilene i denne matchen har vært på et alt for høyt nivå',
        'Ballwatching',
        'Det er et bra løp, men han er i offside',
        'Ryan Sterling',
        'De lukter høler',
      ];
      const luckyNumber = Math.floor(Math.random() * response.length);
      return response[luckyNumber];
    },
  },
  {
    name: 'jose',
    action: () => {
      const response = [
        'https://i.redd.it/ktbd2jkzxh761.gif',
        'https://i.imgur.com/Ci4WQ0Q.gif',
        'https://zippy.gfycat.com/BruisedFlawlessAngwantibo.webm',
        'https://zippy.gfycat.com/MasculineAgedBlowfish.webm',
        'https://i.imgur.com/Lb9KSKa.mp4',
      ];
      const luckyNumber = Math.floor(Math.random() * response.length);
      return response[luckyNumber];
    },
  },
  {
    name: 'pog',
    action: () => {
      const response = [
        'https://gfycat.com/wigglyneatgrackle',
        'https://cdn.discordapp.com/attachments/110121552934100992/863911058699714560/pogmobile.gif',
      ];
      const luckyNumber = Math.floor(Math.random() * response.length);
      return response[luckyNumber];
    },
  },
];

export const checkForBanter = (msg: Discord.Message, channel, client, debugChannel) => {
  const messageIncludes = (phrase: string) => msg.content.toLowerCase().includes(phrase);
  if (messageIncludes('lol')) {
  } else if (messageIncludes('!luckernoob')) {
  } else if (messageIncludes('!pope')) {
  } else if (messageIncludes('!baitley')) {
  } else if (messageIncludes('!var')) {
  } else if (messageIncludes('!toto')) {
  } else if (messageIncludes('!fia')) {
  } else if (messageIncludes('!rice')) {
  } else if (messageIncludes('!nuppe')) {
  } else if (messageIncludes('!molbs')) {
  } else if (messageIncludes('!semb')) {
  } else if (messageIncludes('!jose')) {
  } else if (messageIncludes('!pog')) {
  } else if (messageIncludes('!ramos')) {
    const response = [
      'https://i.pinimg.com/originals/e9/f7/25/e9f72559d7ffa79df54f0273977221aa.gif',
      'https://gifs.gifburger.com/157-sergio-ramos-penalty-miss-vs-bayern-munich-2012-hd.gif',
      'https://www.whoateallthepies.tv/wp-content/uploads/2012/04/Ramos.gif',
      'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2F25.media.tumblr.com%2Ftumblr_mc9u38nMBm1qdlh1io1_r1_400.gif&f=1&nofb=1',
    ];
    const luckyNumber = Math.floor(Math.random() * response.length);
    channel.send(response[luckyNumber]);
  } else if (messageIncludes('!jebaited')) {
    const response = [
      'https://tenor.com/view/immobile-football-euro2020-edmw-hao-le-hao-le-gif-22197371',
    ];
    const luckyNumber = Math.floor(Math.random() * response.length);
    channel.send(response[luckyNumber]);
  } else if (messageIncludes('!wildride')) {
    const manager = 'Ten Hag';
    const response = [
      `Just looking at ${manager}'s wild ride makes me sick`,
      `${manager}'s wild ride looks too intense for me`,
      `${manager}'s wild ride is really good value!`,
      `${manager}'s wild ride was great!`,
      `I'm not getting on ${manager}'s wild ride when it is raining.`,
      `I want to go on something more thrilling than ${manager}'s wild ride`,
      `I'm not paying that much to get on ${manager}'s wild ride`,
      `I want to get off ${manager}'s wild ride`,
      `I've been queuing for ${manager}'s wild ride for ages`,
    ];
    const luckyNumber = Math.floor(Math.random() * response.length);
    channel.send(response[luckyNumber]);
    // const emoji = client.emojis.cache.find((emoji) => emoji.name === 'feelsbadman');
    // channel.send(`Ole's wild ride has crashed ${emoji.toString()}`);
  } else if (messageIncludes('!james')) {
    const emoji = client.emojis.cache.find((emoji) => emoji.name === 'pepegress');
    increaseJamesCounter(() => {
      getRandom((randomEntry: RandomEntry) => {
        if (randomEntry.jamesCounter === 1) {
          channel.send(
            `James har spist gress ${randomEntry.jamesCounter} gang ${emoji.toString()}`
          );
        } else {
          channel.send(
            `James har spist gress ${randomEntry.jamesCounter} ganger ${emoji.toString()}`
          );
        }
      });
    });
  } else if (messageIncludes('!lukaku')) {
    increaseLukakuCounter(() => {
      getRandom((randomEntry: RandomEntry) => {
        if (randomEntry.lukakuCounter === 1) {
          channel.send(`Lukaku har stått med henda ut ${randomEntry.lukakuCounter} gang`);
        } else {
          channel.send(`Lukaku har stått med henda ut ${randomEntry.lukakuCounter} ganger`);
        }
      });
    });
  } else if (messageIncludes('!sid')) {
    const club = getBilic();
    // channel.send(`Just nu er sid fan av ${club}`);
  } else if (messageIncludes('!krysset?')) {
    const emoji = client.emojis.cache.find((emoji) => emoji.name === 'thumbsup');
    channel.send('Ledig');
  } else if (messageIncludes('!halamadrid')) {
    channel.send('https://streamable.com/ppeht');
  } else if (messageIncludes('!mesqueunclub') || messageIncludes('!barca')) {
    channel.send('https://streamable.com/6cebwi');
  } else if (messageIncludes('!morata')) {
    const response = ['brilliant', 'trash', 'ustoppelig', 'stoppelig', 'onlyOPinteam', 'DumpyCPK'];
    const luckyNumber = Math.floor(Math.random() * response.length);
    channel.send(`Fyren er ${response[luckyNumber]}`);
  } else if (messageIncludes('!offyoupop')) {
    const response = [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi2-prod.mirror.co.uk%2Fincoming%2Farticle6480677.ece%2FALTERNATES%2Fs615%2FRed-card-is-shown-by-referee-Mike-Dean.jpg&f=1&nofb=1',
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F8a%2F80%2Fc0%2F8a80c0ef0081b2c75d2af1de3ad93f72.jpg&f=1&nofb=1',
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fim.indiatimes.in%2Ffacebook%2F2019%2FFeb%2Fmike_dean_is_on_99_red_cards_1549428752.jpg&f=1&nofb=1',
      'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fe1.365dm.com%2F13%2F01%2F660x350%2FMike-Dean_2885945.jpg%3F20130114140727&f=1&nofb=1',
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbetszone.co.uk%2Fwp-content%2Fuploads%2F2019%2F02%2FJS51908241.jpg&f=1&nofb=1',
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP._U3ay5TUhOLZOa1mUG1LLgHaD4%26pid%3DApi&f=1',
    ];
    const luckyNumber = Math.floor(Math.random() * response.length);
    channel.send(response[luckyNumber]);
  } else if (messageIncludes('!faze')) {
    const emoji = client.emojis.cache.find((emoji) => emoji.name === 'dansterling');
    const playersIn = [
      'olof',
      'refrezh',
      's1mple',
      'niko',
      'boombl4',
      'Shroud',
      'ropz',
      'KennyS',
      'cromen',
      'pashaBiceps',
      'REZ',
      'allu',
      'Jame',
      'ZywOo',
      `sterling ${emoji.toString()}`,
    ];
    const playersOut = ['ropz', 'rain', 'karrigan', 'Twistzz', 'RobbaN', 'broky'];
    const luckyNumberOut = Math.floor(Math.random() * playersOut.length);
    const luckyNumberIn = Math.floor(Math.random() * playersIn.length);
    const playerOut = playersOut[luckyNumberOut];
    const playerIn = playersIn[luckyNumberIn];
    if (playerIn === 'olof') {
      channel.send(`-olof +${playerIn}`);
    } else {
      channel.send(`-${playerOut} +${playerIn}`);
    }
  } else if (messageIncludes('!sperregrensa')) {
    fetch('https://valgresultat.no/api/2025/st').then((response) =>
      response.json().then(
        (data: {
          partier: Array<{
            id: {
              navn: string;
            };
            stemmer: {
              resultat: {
                prosent: number;
              };
            };
          }>;
        }) => {
          const parties = data.partier;
          const ripParties = [];
          const happyParties = [];
          let message = 'F i chat til ';
          parties.forEach((party) => {
            if (party.stemmer.resultat.prosent >= 4) {
              happyParties.push(party.id.navn);
            } else if (party.stemmer.resultat.prosent > 2) {
              message += `${party.id.navn}, `;
            }
          });
          channel.send(`${message}og my annet ræl.`);
        }
      )
    );
  } else if (messageIncludes('!foxymoxy')) {
    channel.send('Millionærene.');
  } else if (messageIncludes('!mornajens')) {
    const mornaJensYear = new Date('01-01-2013').getFullYear();
    const yearSince = new Date().getFullYear() - mornaJensYear;
    channel.send(`${yearSince} år sia morna jens`);
  } else if (messageIncludes('!racetime')) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let nextRace;
    fetch(`https://ergast.com/api/f1/${currentYear}.json`).then((response) =>
      response.json().then(
        (data: {
          MRData: {
            RaceTable: {
              Races: Array<{
                date: string;
                time: string;
              }>;
            };
          };
        }) => {
          const races = data.MRData.RaceTable.Races;
          for (let index = 0; index < races.length; index++) {
            const race = races[index];
            const raceDate = new Date(`${race.date} ${race.time}`);
            nextRace = race;
            if (raceDate > currentDate) {
              const formattedDate = raceDate.toLocaleDateString('no-NO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              });
              const formattedTime = raceDate.toLocaleTimeString('no-NO', {
                hour12: false,
              });
              channel.send(
                `**Hva**: ${nextRace.raceName}, **Hvor**: ${nextRace.Circuit.circuitName}, **Når**: ${formattedDate}, ${formattedTime}`
              );
              break;
            }
          }
        }
      )
    );
  } else if (messageIncludes('!zaposlo')) {
    fetch('https://www.ge.no/api/price/area/NO1').then((response) =>
      response.json().then((data: Array<PowerPriceResponse>) => {
        let totalPrice = 0;
        let supplierCount = 0;
        data.forEach((supplier) => {
          totalPrice += supplier.price;
          supplierCount++;
        });
        const avgPrice = (totalPrice / supplierCount).toFixed(2);
        channel.send(`Snittpris strøm Oslo: ${avgPrice}`);
      })
    );
  } else if (messageIncludes('!zapsvg')) {
    fetch('https://www.ge.no/api/price/area/NO2').then((response) =>
      response.json().then((data: Array<PowerPriceResponse>) => {
        let totalPrice = 0;
        let supplierCount = 0;
        data.forEach((supplier) => {
          totalPrice += supplier.price;
          supplierCount++;
        });
        const avgPrice = (totalPrice / supplierCount).toFixed(2);
        channel.send(`Snittpris strøm Stavanger: ${avgPrice}`);
      })
    );
  } else if (messageIncludes('!lantime')) {
    const currentDate = new Date();
    const lanDate = new Date('2022-07-22');
    const endOfLan = new Date('2022-08-01');
    const nextLanDate = new Date('2033-07-21');

    const daysUntilLan = Math.ceil(
      (lanDate.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24
    );
    let emoji;
    let isLan = false;

    if (daysUntilLan < 1) {
      emoji = client.emojis.cache.find((emoji) => emoji.name === 'realshit');
      isLan = true;
    } else if (daysUntilLan < 30) {
      emoji = client.emojis.cache.find((emoji) => emoji.name === 'poggers');
    } else if (daysUntilLan < 40) {
      emoji = client.emojis.cache.find((emoji) => emoji.name === 'pagchomp');
    } else if (daysUntilLan < 60) {
      emoji = client.emojis.cache.find((emoji) => emoji.name === 'feelsgoodman');
    } else if (daysUntilLan < 90) {
      emoji = client.emojis.cache.find((emoji) => emoji.name === 'feelsbadman');
    } else if (daysUntilLan < 120) {
      emoji = client.emojis.cache.find((emoji) => emoji.name === 'sadge');
    } else if (daysUntilLan > 120) {
      emoji = client.emojis.cache.find((emoji) => emoji.name === 'pepehands');
    }
    if (
      previousDate &&
      currentDate.getSeconds() - previousDate.getSeconds() < 10 &&
      currentDate.getMinutes() === previousDate.getMinutes()
    ) {
      if (isLan) {
        channel.send(`RIGHT NOW ${emoji.toString()}`);
      } else {
        if (hypeCounter === 0) {
          channel.send(`${daysUntilLan} dager til lan ${emoji.toString()}`);
          hypeCounter++;
        } else if (hypeCounter === 1) {
          channel.send(`${daysUntilLan * 24} timer til lan ${emoji.toString()}`);
          hypeCounter++;
        } else if (hypeCounter === 2) {
          channel.send(`${daysUntilLan * 24 * 60} minutter til lan ${emoji.toString()}`);
          hypeCounter++;
        } else if (hypeCounter === 3) {
          channel.send(`${daysUntilLan * 24 * 60 * 60} sekunder til lan ${emoji.toString()}`);
          hypeCounter++;
        } else if (hypeCounter === 4) {
          channel.send(
            `${daysUntilLan * 24 * 60 * 60 * 1000} millisekunder til lan ${emoji.toString()}`
          );
          hypeCounter++;
        } else if (hypeCounter === 5) {
          channel.send(`${Math.ceil(daysUntilLan / 7)} sommerlan til lan ${emoji.toString()}`);
          hypeCounter++;
        } else if (hypeCounter === 6) {
          channel.send(
            `${Math.ceil(daysUntilLan / 10)} sommerlan+prelan til lan ${emoji.toString()}`
          );
          hypeCounter++;
        } else if (hypeCounter === 7) {
          channel.send(
            `${Math.ceil(daysUntilLan / 13)} sommerlan+prelan+preprelan til lan ${emoji.toString()}`
          );
          hypeCounter++;
        } else if (hypeCounter === 8) {
          channel.send(`RO NED HYPEN`);
          hypeCounter = 0;
        }
      }
    } else {
      channel.send(`${daysUntilLan} dager til lan ${emoji.toString()}`);
    }
    previousDate = currentDate;
    console.log('previousDate', previousDate.toLocaleDateString());
  }
};

const getBilic = async () => {
  const response = await fetch('https://www.transfermarkt.com/slaven-bilic/profil/trainer/3598');
  const html = await response.text();
  const dom = await new JSDOM(html);
  console.log('dom', dom.window);
  // console.log("dom.window['3176']", dom.window.get("3176"));
  // const divs = dom.window.document.getElementsByClassName(
  //   "premium-profil-text"
  // );
  // const divs = dom.window.document.querySelector("#\\3176").textContent;
  const divs = dom.window.document.getElementById('3176').textContent;
  console.log('divs', divs);
  const currentClub = divs[0].innerText.replace('Current club', ' ').trim();
  // console.log("currentClub", currentClub);
};
