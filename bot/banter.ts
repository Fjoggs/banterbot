import * as Discord from 'discord.js';
import fetch from 'node-fetch';
import {
  getGress,
  getRandom,
  GressEntry,
  increaseGressCounter,
  increaseLukakuCounter,
  RandomEntry,
} from '../api/db/general';
import { runAndReport } from './util';

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

interface PowerPriceResponse {
  price: number;
}

interface RaceTime {
  date: string;
  time: string;
}

let hypeCounter = 0;
let previousDate = new Date();

export const checkForBanter = (msg: Discord.Message, channel, client, debugChannel) => {
  const messageIncludes = (phrase: string) => msg.content.toLowerCase().includes(phrase);
  const messageIsEqual = (phrase: string) => msg.content.toLowerCase() === phrase;
  if (messageIncludes('!ban')) {
    runAndReport(() => channel.send('Banning Molbs'), debugChannel, '!ban');
  } else if (messageIncludes('!pope')) {
    runAndReport(() => channel.send(channel.send('Fuck Pope')), debugChannel, '!pope');
  } else if (messageIncludes('!baitley')) {
    runAndReport(
      () => {
        const emoji = client.emojis.cache.find((emoji) => emoji.name === 'kekw');
        channel.send(emoji.toString());
      },
      debugChannel,
      '!baitley'
    );
  } else if (messageIncludes('!var')) {
    runAndReport(
      () => {
        const response = ['offside', 'onside', 'dive', 'gåll', 'felling', 'fekting'];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(`Soleklar ${response[luckyNumber]}`);
      },
      debugChannel,
      '!var'
    );
  } else if (messageIncludes('!el') || messageIncludes('!canyoubelieveit')) {
    channel.send('https://www.youtube.com/watch?v=ny2aJpD9F4A');
  } else if (messageIncludes('!el') || messageIncludes('!canyoubelieveit')) {
    channel.send('https://www.youtube.com/watch?v=ny2aJpD9F4A');
  } else if (messageIncludes('!toto')) {
    channel.send('https://sleeperop.com/gifs/totorage.gif');
  } else if (messageIncludes('!fia')) {
    runAndReport(
      () => {
        const drivers = [
          'Max',
          'Lawson',
          'Norris',
          'Piastri',
          'Leclerc',
          'Hamilton',
          'Russell',
          'Antonelli',
          'Alonso',
          'Stroll',
          'Tsunoda',
          'Hadjar',
          'Ocon',
          'Bearman',
          'Gasly',
          'Doohan',
          'Albon',
          'Sainz',
          'Hulkenberg',
          'Bortoleto',
        ];
        const randomDriver = Math.floor(Math.random() * drivers.length);
        const response = [
          'Let them race',
          "Don't let them race",
          `5 sek bot til ${drivers[randomDriver]}`,
          'Hamilton pls',
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(`${response[luckyNumber]}`);
      },
      debugChannel,
      '!fia'
    );
  } else if (messageIncludes('!rice')) {
    runAndReport(
      () => {
        const response = ['West Ham', 'Chelsea', 'United', 'City', 'Enga', 'Sleivdal'];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(`Rice til ${response[luckyNumber]}`);
      },
      debugChannel,
      '!rice'
    );
  } else if (messageIncludes('!molbs')) {
    runAndReport(
      () => {
        const essentialArsenalPlayers = [
          'Jesus',
          'Gabriel',
          'Zinchenko',
          'Saka',
          'Mysil Bergsprekken',
          'Martinelli',
          'White',
          'Ødegaard',
          'Gyökeres',
          'Zubimendi',
          'Nørgaard',
        ];
        const randomArsenalPlayer = Math.floor(Math.random() * essentialArsenalPlayers.length);
        const emoji = client.emojis.cache.find((emoji) => emoji.name === 'pepoFinger');
        const response = [
          '**DOMMER**',
          `han kommentatoren er så jævlig rittard ${emoji.toString()}`,
          '*random grove gloser etter en totalt irrelevant hendelse*',
          'ser dere ikke linær?',
          'det går så treigt',
          `er ${essentialArsenalPlayers[randomArsenalPlayer]} essential?`,
          `Orker ikke`,
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
      },
      debugChannel,
      '!molbs'
    );
  } else if (messageIncludes('!garnacho')) {
    runAndReport(
      () => {
        let response = [];
        if (messageIncludes('!garnacho pls')) {
          response = [
            'https://sleeperop.com/garnacho/garnacho2.mp4', // 1 is cached as the debruyne clip
            'https://sleeperop.com/garnacho/garnacho3.mp4',
          ];
        } else {
          response = [
            'https://sleeperop.com/garnacho/2ny1.mp4',
            'https://sleeperop.com/garnacho/bournemouth1.mp4',
            'https://sleeperop.com/garnacho/bournemouth2.mp4',
            'https://sleeperop.com/garnacho/carew1.mp4',
            'https://sleeperop.com/garnacho/debruyne1.mp4',
            'https://sleeperop.com/garnacho/debruyne2.mp4',
            'https://sleeperop.com/garnacho/ebou_adams1.mp4',
            'https://sleeperop.com/garnacho/garnacho2.mp4',
            'https://sleeperop.com/garnacho/garnacho3.mp4',
            'https://sleeperop.com/garnacho/geoff_thomas1.mp4',
            'https://sleeperop.com/garnacho/heskey1.mp4',
            'https://sleeperop.com/garnacho/mls1.mp4',
            'https://sleeperop.com/garnacho/mudryk1.mp4',
            'https://sleeperop.com/garnacho/nunez1.mp4',
            'https://sleeperop.com/garnacho/qatar1.mp4',
            'https://sleeperop.com/garnacho/torres1.mp4',
          ];
        }
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
      },
      debugChannel,
      '!garnacho'
    );
  } else if (messageIncludes('!semb')) {
    runAndReport(
      () => {
        const emoji = client.emojis.cache.find((emoji) => emoji.name === 'yepscience');
        const response = [
          `Skal det bli noen poeng så må de score et mål her ${emoji.toString()}`,
          'Kampen er kjemisk fritt for målsjanser',
          'Pasningsfeilene i denne matchen har vært på et alt for høyt nivå',
          'Ballwatching',
          'Det er et bra løp, men han er i offside',
          'Ryan Sterling',
          'Jayden Pickford',
          'De lukter høler',
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
      },
      debugChannel,
      '!semb'
    );
  } else if (messageIncludes('!langli')) {
    runAndReport(
      () => {
        channel.send(':mega:');
      },
      debugChannel,
      '!langli'
    );
  } else if (messageIncludes('!jose')) {
    runAndReport(
      () => {
        const response = [
          'https://sleeperop.com/gifs/jose/jose-1.gif',
          'https://sleeperop.com/gifs/jose/jose-2.gif',
          'https://sleeperop.com/gifs/jose/jose-3.mp4',
          'https://sleeperop.com/gifs/jose/jose-4.gif',
          'https://sleeperop.com/gifs/jose/jose-5.mp4',
          'https://sleeperop.com/gifs/jose/jose-6.mp4',
          'https://sleeperop.com/gifs/jose/jose-7.gif',
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
      },
      debugChannel,
      '!jose'
    );
  } else if (messageIncludes('!pog')) {
    runAndReport(
      () => {
        const response = [
          'https://sleeperop.com/gifs/pog/pog-1.gif',
          'https://sleeperop.com/gifs/pog/pog-2.gif',
          'https://sleeperop.com/gifs/pog/pog-3.gif',
          'https://sleeperop.com/gifs/pog/pog-4.gif',
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
      },
      debugChannel,
      '!pog'
    );
  } else if (messageIncludes('!ramos')) {
    runAndReport(
      () => {
        const response = [
          'https://sleeperop.com/gifs/ramos/ramos-1.gif',
          'https://sleeperop.com/gifs/ramos/ramos-2.gif',
          'https://sleeperop.com/gifs/ramos/ramos-3.gif',
          'https://sleeperop.com/gifs/ramos/ramos-4.gif',
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
      },
      debugChannel,
      '!ramos'
    );
  } else if (messageIncludes('!watkins')) {
    runAndReport(
      () => {
        const response = ['https://sleeperop.com/gifs/watkins.mp4'];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
      },
      debugChannel,
      '!ramos'
    );
  } else if (messageIncludes('!jebaited')) {
    runAndReport(
      () => {
        const response = [
          'https://sleeperop.com/gifs/jebaited/jebaited1.gif',
          'https://sleeperop.com/gifs/jebaited/jebaited2.gif',
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
      },
      debugChannel,
      '!jebaited'
    );
  } else if (messageIncludes('!throw')) {
    runAndReport(
      () => {
        const response = ['https://sleeperop.com/gifs/throw/throw1.gif'];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
      },
      debugChannel,
      '!jebaited'
    );
  } else if (messageIncludes('!wildride')) {
    runAndReport(
      () => {
        const manager = 'Amorim';
        const response = [
          `Just looking at ${manager}'s wild ride makes me sick`,
          `${manager}'s wild ride looks too intense for me`,
          `${manager}'s wild ride is really good value!`,
          `${manager}'s wild ride was great!`,
          `I'm not getting on ${manager}'s wild ride when it is raining.`,
          `I want to go on something more thrilling than ${manager}'s wild ride`,
          `I'm not paying that much to get on ${manager}'s wild ride`,
          `I want to get off ${manager}'s wild ride`,
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
        // const emoji = client.emojis.cache.find((emoji) => emoji.name === 'feelsbadman');
        // channel.send(`${manager}'s wild ride has crashed ${emoji.toString()}`);
        //
        // const emoji = client.emojis.cache.find((emoji) => emoji.name === 'PauseChamp');
        // channel.send(`I've been queuing for ${manager}'s wild ride for ages ${emoji.toString()}`);
      },
      debugChannel,
      '!wildride'
    );
  } else if (messageIncludes('!wilderit')) {
    runAndReport(
      () => {
        const manager = 'Slot';
        const response = [
          `Ik word al misselijk van ${manager}'s wilde rit.`,
          `${manager}'s wilde rit is te heftig voor mij.`,
          `${manager}'s wilde rit is echt goedkoop!`,
          `${manager}'s wilde rit was top!`,
          `Ik ga niet in ${manager}'s wilde rit als het regent.`,
          `Ik wil in iets spannendere dan ${manager}'s wilde rit.`,
          `${manager}'s wilde rit is te duur!`,
          `Ik wil uit ${manager}'s wilde rit!`,
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
        // const emoji = client.emojis.cache.find((emoji) => emoji.name === 'feelsbadman');
        // channel.send(`${manager}'s wild ride has crashed ${emoji.toString()}`);
        //
        // const emoji = client.emojis.cache.find((emoji) => emoji.name === 'PauseChamp');
        // channel.send(`I've been queuing for ${manager}'s wild ride for ages ${emoji.toString()}`);
      },
      debugChannel,
      '!wildride'
    );
  } else if (messageIncludes('!villtur')) {
    runAndReport(
      () => {
        const manager = 'Bakke';
        const response = [
          `Jeg blir dårlig bare av å se på ${manager}s ville tur`,
          `${manager}s ville tur ser for intens ut for meg`,
          `${manager}s ville tur er virkelig verdt penga!`,
          `${manager}s ville tur var topp!`,
          `Jeg gåkke på ${manager}s ville tur når det regner.`,
          `Jeg vil kjøre noe mer spennende ${manager}s ville tur`,
          `Jeg betaler ikke så mye for å kjøre ${manager}s ville tur`,
          `Slepp meg av ${manager}s ville tur`,
          `Jeg har stått i kø for ${manager}s vill tur i en evighet`,
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
        // const emoji = client.emojis.cache.find((emoji) => emoji.name === 'feelsbadman');
        // channel.send(`Bakkess ville tur har krasja ${emoji.toString()}`);
      },
      debugChannel,
      '!villtur'
    );
  } else if (messageIncludes('!konsept')) {
    runAndReport(
      () => {
        const response = [
          '"Frokost"',
          '"DNB"',
          '"ChatGPT"',
          '"Indeksfond"',
          '"Demokrati"',
          '"Krigen i Ukraina"',
          '"!Ramos"',
          '"SommerLAN"',
          '"Strømprisene"',
          '"BanterBOT"',
          '"Ferrari"',
          '"Motta varer, avgi betaling"',
          '"Konsept"',
          '"Nettbank"',
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(`${response[luckyNumber]}, et konsept fra DNB©`);
      },
      debugChannel,
      '!konsept'
    );
  } else if (messageIncludes('!gress')) {
    runAndReport(
      () => {
        const playerName = msg.content.toLowerCase().split('!gress ')[1];
        const emoji = client.emojis.cache.find((emoji) => emoji.name === 'pepegress');
        increaseGressCounter(playerName, () => {
          getGress(playerName, (gressEntry: GressEntry) => {
            const upperCaseName = playerName.charAt(0).toUpperCase() + playerName.slice(1);
            if (gressEntry.counter === 1) {
              channel.send(
                `${upperCaseName} har spist gress ${gressEntry.counter} gang ${emoji.toString()}`
              );
            } else {
              channel.send(
                `${upperCaseName} har spist gress ${gressEntry.counter} ganger ${emoji.toString()}`
              );
            }
          });
        });
      },
      debugChannel,
      '!gress'
    );
  } else if (messageIncludes('!lukaku')) {
    runAndReport(
      () => {
        increaseLukakuCounter(() => {
          getRandom((randomEntry: RandomEntry) => {
            if (randomEntry.lukakuCounter === 1) {
              channel.send(`Lukaku har stått med henda ut ${randomEntry.lukakuCounter} gang`);
            } else {
              channel.send(`Lukaku har stått med henda ut ${randomEntry.lukakuCounter} ganger`);
            }
          });
        });
      },
      debugChannel,
      '!lukaku'
    );
  } else if (messageIncludes('!sid')) {
    runAndReport(
      () => {
        // const club = getBilic();
        // channel.send(`Just nu er sid fan av ${club}`);
        console.log('hello');
      },
      debugChannel,
      '!sid'
    );
  } else if (messageIncludes('!krysset?')) {
    runAndReport(
      () => {
        const emoji = client.emojis.cache.find((emoji) => emoji.name === 'thumbsup');
        channel.send('Ledig');
      },
      debugChannel,
      '!krysset'
    );
  } else if (messageIncludes('!halamadrid')) {
    runAndReport(
      () => channel.send('https://sleeperop.com/gifs/halamadrid.mp4'),
      debugChannel,
      '!halamadrid'
    );
  } else if (messageIncludes('!mesqueunclub') || messageIncludes('!barca')) {
    runAndReport(
      () => channel.send('https://sleeperop.com/gifs/barca.mp4'),
      debugChannel,
      '!mesqueunclub'
    );
  } else if (messageIncludes('!ktbffh') || messageIncludes('!chelsea')) {
    runAndReport(
      () => channel.send('https://sleeperop.com/gifs/chelsea.mp4'),
      debugChannel,
      '!chelsea'
    );
  } else if (messageIncludes('!morata')) {
    runAndReport(
      () => {
        const response = [
          'brilliant',
          'trash',
          'ustoppelig',
          'stoppelig',
          'onlyOPinteam',
          'DumpyCPK',
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(`Fyren er ${response[luckyNumber]}`);
      },
      debugChannel,
      '!morata'
    );
  } else if (messageIncludes('!offyoupop')) {
    runAndReport(
      () => {
        const response = [
          'https://sleeperop.com/imgs/mike/mike-1.jpg',
          'https://sleeperop.com/imgs/mike/mike-2.jpg',
          'https://sleeperop.com/imgs/mike/mike-3.jpg',
          'https://sleeperop.com/imgs/mike/mike-4.jpg',
          'https://sleeperop.com/imgs/mike/mike-5.jpg',
          'https://sleeperop.com/imgs/mike/mike-6.jpg',
          'https://sleeperop.com/imgs/mike/mike-7.jpg',
          'https://sleeperop.com/imgs/mike/mike-8.jpg',
          'https://sleeperop.com/imgs/mike/mike-9.jpg',
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
      },
      debugChannel,
      '!offyoupop'
    );
  } else if (messageIncludes('!faze')) {
    runAndReport(
      () => {
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
        const playersOut = ['ropz', 'rain', 'karrigan', 'frozen', 'NEO', 'broky'];
        const luckyNumberOut = Math.floor(Math.random() * playersOut.length);
        const luckyNumberIn = Math.floor(Math.random() * playersIn.length);
        const playerOut = playersOut[luckyNumberOut];
        const playerIn = playersIn[luckyNumberIn];
        if (playerIn === 'olof') {
          channel.send(`-olof +${playerIn}`);
        } else {
          channel.send(`-${playerOut} +${playerIn}`);
        }
      },
      debugChannel,
      '!faze'
    );
  } else if (messageIncludes('!valg')) {
    runAndReport(
      () => {
        fetch('https://valgresultat.no/api/2025/st')
          .then((response) =>
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
                let message = 'Foreløpig resultat 2025: ```';
                parties.forEach((party) => {
                  message += `${party.id.navn}: ${party.stemmer.resultat.prosent || 0}%\n`;
                });
                message += '```';
                channel.send(message);
              }
            )
          )
          .catch((error) => debugChannel.send(`!valg blew up: ${error}`));
      },
      debugChannel,
      '!valg'
    );
  } else if (messageIncludes('!sperregrensa')) {
    runAndReport(
      () => {
        fetch('https://valgresultat.no/api/2025/st')
          .then((response) =>
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
          )
          .catch((error) => debugChannel.send(`!sperregrensa blew up: ${error}`));
      },
      debugChannel,
      '!sperregrensa'
    );
  } else if (messageIncludes('!foxymoxy')) {
    runAndReport(() => channel.send('Millionærene.'), debugChannel, '!foxymoxy');
  } else if (messageIncludes('!mornajens')) {
    runAndReport(
      () => {
        const mornaJensYear = new Date('01-01-2013').getFullYear();
        const yearSince = new Date().getFullYear() - mornaJensYear;
        channel.send(`${yearSince} år sia morna jens`);
      },
      debugChannel,
      '!mornajens'
    );
  } else if (messageIncludes('!racetime')) {
    runAndReport(
      () => {
        interface RaceData {
          date: string;
          time: string;
          round: number;
          raceName: string;
          Circuit: Object;
          FirstPractice?: RaceTime;
          SecondPractice?: RaceTime;
          ThirdPractice?: RaceTime;
          Qualifying?: RaceTime;
          Sprint?: RaceTime;
        }
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        let nextRace: RaceData;
        fetch(`https://api.jolpi.ca/ergast/f1/${currentYear}/`)
          .then((response) =>
            response.json().then(
              (data: {
                MRData: {
                  RaceTable: {
                    Races: Array<RaceData>;
                  };
                };
              }) => {
                const races = data.MRData.RaceTable.Races;
                for (let index = 0; index < races.length; index++) {
                  const race = races[index];
                  let raceDate = new Date(race.date);
                  let hasTime = false;
                  if (race.time) {
                    raceDate = new Date(`${race.date} ${race.time}`);
                    hasTime = true;
                  }
                  // const raceDate = new Date(`${race.date} ${race.time}`);
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
                    let message = `**Hva**: ${nextRace.raceName}, **Runde**: ${nextRace.round}, **Når**: ${formattedDate}\n`;
                    if (hasTime) {
                      message = `**Hva**: ${nextRace.raceName}, **Runde**: ${nextRace.round}, **Når**: ${formattedDate}, ${formattedTime}\n`;
                    }
                    let multiLine = false;
                    if (race.Sprint) {
                      const sprintDate = new Date(`${race.Sprint.date} ${race.Sprint.time}`);
                      const formattedSprint = sprintDate.toLocaleDateString('no-NO', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      });
                      const formattedSprintTime = sprintDate.toLocaleTimeString('no-NO', {
                        hour12: false,
                      });
                      message += `**Sprint**: ${formattedSprint}, ${formattedSprintTime}\n`;
                      multiLine = true;
                    }
                    if (race.Qualifying) {
                      const qualifyingDate = new Date(
                        `${race.Qualifying.date} ${race.Qualifying.time}`
                      );
                      const formattedQualifying = qualifyingDate.toLocaleDateString('no-NO', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      });
                      const formattedQualiTime = qualifyingDate.toLocaleTimeString('no-NO', {
                        hour12: false,
                      });
                      message += `**Kvalikk**: ${formattedQualifying}, ${formattedQualiTime}`;
                      multiLine = true;
                    }
                    if (multiLine) {
                      channel.send(`\n${message}`);
                    } else {
                      channel.send(message);
                    }
                    break;
                  }
                }
              }
            )
          )
          .catch((error) => {
            debugChannel.send(`!racetime failed: ${error}`);
          });
      },
      debugChannel,
      '!racetime'
    );
  } else if (messageIncludes('!zaposlo')) {
    runAndReport(
      () => {
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
      },
      debugChannel,
      '!zaposlo'
    );
  } else if (messageIncludes('!zapsvg')) {
    runAndReport(
      () => {
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
      },
      debugChannel,
      '!zapsvg'
    );
  } else if (messageIncludes('!lantime')) {
    runAndReport(
      () => {
        const currentDate = new Date();
        let lanDate = new Date('2026-07-19');
        const endOfLan = new Date('2026-07-26');
        const nextLanDate = new Date('2027-07-23');

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
          emoji = client.emojis.cache.find((emoji) => emoji.name === 'feelsgoodman');
        } else if (daysUntilLan < 60) {
          emoji = client.emojis.cache.find((emoji) => emoji.name === 'pogchamp');
        } else if (daysUntilLan < 90) {
          emoji = client.emojis.cache.find((emoji) => emoji.name === 'pagchomp');
        } else if (daysUntilLan < 120) {
          emoji = client.emojis.cache.find((emoji) => emoji.name === 'yep');
        } else if (daysUntilLan < 180) {
          emoji = client.emojis.cache.find((emoji) => emoji.name === 'pausechamp');
        } else if (daysUntilLan < 250) {
          emoji = client.emojis.cache.find((emoji) => emoji.name === 'sadscience');
        } else if (daysUntilLan > 250) {
          emoji = client.emojis.cache.find((emoji) => emoji.name === 'pepehands');
        } else if (currentDate.getTime() - endOfLan.getTime() > 0) {
          isLan = false;
          lanDate = nextLanDate;
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
                `${Math.ceil(
                  daysUntilLan / 13
                )} sommerlan+prelan+preprelan til lan ${emoji.toString()}`
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
      },
      debugChannel,
      '!lantime'
    );
  } else if (messageIncludes('!kjolensier')) {
    runAndReport(
      () => {
        const response = [`Ja`, 'Nei', 'Kanskje', 'MORRACHKNULL'];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
      },
      debugChannel,
      '!kjolensier'
    );
  } else if (messageIncludes('!pila')) {
    runAndReport(
      () => {
        const min = Math.ceil(0);
        const max = Math.floor(100);
        const chance = Math.floor(Math.random() * (max - min) + min);
        channel.send(`${chance}%`);
      },
      debugChannel,
      '!pila'
    );
  } else if (messageIncludes('!fairway')) {
    runAndReport(
      () => {
        const min = Math.ceil(0);
        const max = Math.floor(400);
        const distance = Math.floor(Math.random() * (max - min) + min);
        channel.send(`${distance} meter unna fairway`);
      },
      debugChannel,
      '!fairway'
    );
  } else if (messageIncludes('!wideramos')) {
    runAndReport(
      () => {
        const response = ['https://sleeperop.com/gifs/ramos/wideramos.gif'];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
      },
      debugChannel,
      '!pila'
    );
  }
};

const getBilic = async () => {
  const response = await fetch('https://www.transfermarkt.com/slaven-bilic/profil/trainer/3598');
  const html = await response.text();
  const dom = await new JSDOM(html);
  // console.log("dom.window['3176']", dom.window.get("3176"));
  // const divs = dom.window.document.getElementsByClassName(
  //   "premium-profil-text"
  // );
  // const divs = dom.window.document.querySelector("#\\3176").textContent;
  const divs = dom.window.document.getElementById('3176').textContent;
  const currentClub = divs[0].innerText.replace('Current club', ' ').trim();
  // console.log("currentClub", currentClub);
};
