import * as Discord from 'discord.js';
import fetch from 'node-fetch';
import {
    getRandom,
    increaseJamesCounter,
    increaseLukakuCounter,
    RandomEntry,
} from '../api/db/general';
import { rittardOfTheWeek, topDickOfTheWeek, luckernoobOfTheWeek } from '../api/parser';

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

let jamesCounter = 0;

export const checkForBanter = (msg: Discord.Message, channel, client) => {
    const messageIncludes = (phrase: string) => msg.content.toLowerCase().includes(phrase);
    if (messageIncludes('!rittard')) {
        channel.send(rittardOfTheWeek());
    } else if (messageIncludes('!topdick')) {
        const emoji = client.emojis.cache.find((emoji) => emoji.name === 'ez');
        channel.send(`${topDickOfTheWeek()} ${emoji.toString()}`);
    } else if (messageIncludes('!luckernoob')) {
        channel.send(luckernoobOfTheWeek());
    } else if (messageIncludes('!pope')) {
        channel.send('Fuck Pope');
    } else if (messageIncludes('!baitley')) {
        const emoji = client.emojis.cache.find((emoji) => emoji.name === 'kekw');
        channel.send(emoji.toString());
    } else if (messageIncludes('!var')) {
        const response = ['offside', 'onside', 'dive', 'gåll', 'felling'];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(`Soleklar ${response[luckyNumber]}`);
    } else if (messageIncludes('!rice')) {
        const response = ['West Ham', 'Chelsea', 'United', 'City', 'Enga', 'Sleivdal'];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(`Rice til ${response[luckyNumber]}`);
    } else if (messageIncludes('!nuppe')) {
        const response = [`DREP 'N. DREP MÆLBS!`];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
    } else if (messageIncludes('!molbs')) {
        const essentialArsenalPlayers = [
            'Laca',
            'Tierney',
            'Pepe',
            'Saka',
            'Xhaka',
            'White',
            'Ødegaard',
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
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
    } else if (messageIncludes('!semb')) {
        const emoji = client.emojis.cache.find((emoji) => emoji.name === 'yepScience');
        const response = [
            `Skal det bli noen poeng så må de score et mål her ${emoji.toString()}`,
            'Kampen er kjemisk fritt for målsjanser',
            'Pasningsfeilene i denne matchen har vært på et alt for høyt nivå',
            'Ballwatching',
            'Det er et bra løp, men han er i offside',
            'Ryan Sterling',
            'De lukter høler',
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
    } else if (messageIncludes('!jose')) {
        const response = [
            'https://i.redd.it/ktbd2jkzxh761.gif',
            'https://i.imgur.com/Ci4WQ0Q.gif',
            'https://zippy.gfycat.com/BruisedFlawlessAngwantibo.webm',
            'https://zippy.gfycat.com/MasculineAgedBlowfish.webm',
            'https://i.imgur.com/Lb9KSKa.mp4',
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
    } else if (messageIncludes('!pog')) {
        const response = [
            'https://gfycat.com/wigglyneatgrackle',
            'https://cdn.discordapp.com/attachments/110121552934100992/863911058699714560/pogmobile.gif',
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
    } else if (messageIncludes('!ramos')) {
        const response = [
            'https://i.pinimg.com/originals/e9/f7/25/e9f72559d7ffa79df54f0273977221aa.gif',
            'https://gifs.gifburger.com/157-sergio-ramos-penalty-miss-vs-bayern-munich-2012-hd.gif',
            'https://i0.wp.com/www.abrelaboca.com/wp-content/uploads/2012/10/penalty-ramos.gif?fit=319%2C214&ssl=1',
            'https://www.whoateallthepies.tv/wp-content/uploads/2012/04/Ramos.gif',
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
        const response = [
            "Just looking at Ole's wild ride makes me sick",
            "Ole's wild ride looks too intense for me",
            "Ole's wild ride is really good value!",
            "Ole's wild ride was great!",
            "I'm not getting on Ole's wild ride when it is raining.",
            "I want to go on something more thrilling than Ole's wild ride",
            "I'm not paying that much to get on Ole's wild ride",
            "I want to get off Ole's wild ride",
            "I've been queuing for Ole's wild ride for ages",
        ];
        const luckyNumber = Math.floor(Math.random() * response.length);
        channel.send(response[luckyNumber]);
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
                        `James har spist gress ${
                            randomEntry.jamesCounter
                        } ganger ${emoji.toString()}`
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
                    channel.send(
                        `Lukaku har stått med henda ut ${randomEntry.lukakuCounter} ganger`
                    );
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
    } else if (messageIncludes('!morata')) {
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
    } else if (messageIncludes('!sperregrensa')) {
        fetch('https://valgresultat.no/api/2021/st').then((response) =>
            response.json().then((data) => {
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
            })
        );
    } else if (messageIncludes('!foxymoxy')) {
        channel.send('Millionærene.');
    } else if (messageIncludes('!mornajens')) {
        const mornaJensYear = new Date('01-01-2013').getFullYear();
        const yearSince = new Date().getFullYear() - mornaJensYear;
        channel.send(`${yearSince} år sia morna jens`);
    } else if (messageIncludes('!racetime')) {
        const currentDate = new Date();
        let nextRace;
        fetch('https://ergast.com/api/f1/current.json').then((response) =>
            response.json().then((data) => {
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
            })
        );
    } else if (messageIncludes('!zaposlo')) {
        fetch('https://www.ge.no/api/price/area/NO1').then((response) =>
            response.json().then((data) => {
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
            response.json().then((data) => {
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
