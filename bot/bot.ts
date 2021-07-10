import * as Discord from "discord.js";
import {
  fetchData,
  luckernoobOfTheWeek,
  rittardOfTheWeek,
  topDickOfTheWeek,
} from "../api/parser";
import {
  checkForEvents,
  getLiveData,
  getMessages,
  resetMessages,
} from "../api/api";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

import fetch from "node-fetch";
import BanterBotDB from "../api/db";
import {
  addBet,
  addChallenge,
  deleteChallenge,
  finishChallenge,
  getBets,
  getChallenges,
  getWinners,
} from "../api/db/challenges";

const client = new Discord.Client();

let liveData = {};
const fetchLiveData = async () => {
  await fetchData();
  liveData = await getLiveData();
};
fetchLiveData();

let channel;
let testChannel;
let mute = true;

const nameToPlayerIds = {
  Fjoggs: 1,
  nwbi: 2,
  FN: 3,
  Vimbs: 4,
  Ulfos: 5,
  dun: 6,
  Torp: 7,
  "ILLeGaL BaNnan": 8,
  Nuppe: 9,
  biten: 10,
  gody: 11,
  Molbs: 12,
  Juell: 13,
};

const playersIdsToName = {
  1: "Fjoggs",
  2: "nwbi",
  3: "FN",
  4: "Vimbs",
  5: "Ulfos",
  6: "dun",
  7: "Torp",
  8: "ILLeGaL BaNnan",
  9: "Nuppe",
  10: "biten",
  11: "gody",
  12: "Molbs",
  13: "Juell",
};

const db = new BanterBotDB();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  channel = client.channels.cache.get("110121552934100992"); //preik
  testChannel = client.channels.cache.get("774731038391140375"); // fjoggs' general
});

let max = 0;
let randomBanter = () => Math.floor(Math.random() * (max + 1));
let banterPool = [];

let jamesCounter = 0;

client.on("message", (msg) => {
  if (msg.content.toLowerCase().includes("!addbanter")) {
    banterPool.push(msg.content.replace("!addbanter ", ""));
    max = max + 1;
  } else if (msg.content.toLowerCase().includes("!banter")) {
    channel.send(banterPool[randomBanter()] || "her vare tomt");
  } else if (msg.content.toLowerCase().includes("!rittard")) {
    channel.send(rittardOfTheWeek());
  } else if (msg.content.toLowerCase().includes("!topdick")) {
    const emoji = client.emojis.cache.find((emoji) => emoji.name === "ez");
    channel.send(`${topDickOfTheWeek()} ${emoji.toString()}`);
  } else if (msg.content.toLowerCase().includes("!luckernoob")) {
    channel.send(luckernoobOfTheWeek());
  } else if (msg.content.toLowerCase().includes("!pope")) {
    channel.send("Fuck Pope");
  } else if (msg.content.toLowerCase().includes("!baitley")) {
    const emoji = client.emojis.cache.find((emoji) => emoji.name === "kekw");
    channel.send(emoji.toString());
  } else if (msg.content.toLowerCase().includes("!var")) {
    const response = ["offside", "onside", "dive", "gåll", "felling"];
    const luckyNumber = Math.floor(Math.random() * response.length);
    channel.send(`Soleklar ${response[luckyNumber]}`);
  } else if (msg.content.toLowerCase().includes("!molbs")) {
    const essentialArsenalPlayers = [
      "Laca",
      "Tierney",
      "Pepe",
      "Saka",
      "Xhaka",
    ];
    const randomArsenalPlayer = Math.floor(
      Math.random() * essentialArsenalPlayers.length
    );
    const response = [
      "**DOMMER**",
      "han kommentatoren er så jævlig rittard",
      "*random grove gloser etter en totalt irrelevant hendelse*",
      "ser dere ikke linær?",
      "det går så treigt",
      `er ${essentialArsenalPlayers[randomArsenalPlayer]} essential?`,
    ];
    const luckyNumber = Math.floor(Math.random() * response.length);
    channel.send(response[luckyNumber]);
  } else if (msg.content.toLowerCase().includes("!mute")) {
    mute = true;
    channel.send("Kein liveoppdateringer");
  } else if (msg.content.toLowerCase().includes("!unmute")) {
    const emoji = client.emojis.cache.find(
      (emoji) => emoji.name === "pagchomp"
    );
    mute = false;
    channel.send(`Spam back on the menu ${emoji.toString()}`);
  } else if (msg.content.toLowerCase().includes("!semb")) {
    const response = [
      "Skal det bli noen poeng så må de score et mål her",
      "Kampen er kjemisk fritt for målsjanser",
      "Pasningsfeilene i denne matchen har vært på et alt for høyt nivå",
      "Ballwatching",
      "Det er et bra løp, men han er i offside",
      "Ryan Sterling",
      "De lukter høler",
    ];
    const luckyNumber = Math.floor(Math.random() * response.length);
    channel.send(response[luckyNumber]);
  } else if (msg.content.toLowerCase().includes("!jose")) {
    const response = [
      "https://i.redd.it/ktbd2jkzxh761.gif",
      "https://i.imgur.com/Ci4WQ0Q.gif",
      "https://zippy.gfycat.com/BruisedFlawlessAngwantibo.webm",
      "https://zippy.gfycat.com/MasculineAgedBlowfish.webm",
      "https://i.imgur.com/Lb9KSKa.mp4",
    ];
    const luckyNumber = Math.floor(Math.random() * response.length);
    channel.send(response[luckyNumber]);
  } else if (msg.content.toLowerCase().includes("!pog")) {
    const response = ["https://gfycat.com/wigglyneatgrackle"];
    const luckyNumber = Math.floor(Math.random() * response.length);
    channel.send(response[luckyNumber]);
  } else if (msg.content.toLowerCase().includes("!ramos")) {
    const response = [
      "https://i.pinimg.com/originals/e9/f7/25/e9f72559d7ffa79df54f0273977221aa.gif",
      "https://gifs.gifburger.com/157-sergio-ramos-penalty-miss-vs-bayern-munich-2012-hd.gif",
      "https://i0.wp.com/www.abrelaboca.com/wp-content/uploads/2012/10/penalty-ramos.gif?fit=319%2C214&ssl=1",
      "https://www.whoateallthepies.tv/wp-content/uploads/2012/04/Ramos.gif",
    ];
    const luckyNumber = Math.floor(Math.random() * response.length);
    channel.send(response[luckyNumber]);
  } else if (msg.content.toLowerCase().includes("!jebaited")) {
    const response = [
      "https://tenor.com/view/immobile-football-euro2020-edmw-hao-le-hao-le-gif-22197371",
    ];
    const luckyNumber = Math.floor(Math.random() * response.length);
    channel.send(response[luckyNumber]);
  } else if (msg.content.toLowerCase().includes("!james")) {
    if (jamesCounter === 1) {
      channel.send(`James i gresset: ${jamesCounter} gang`);
    } else {
      channel.send(`James i gresset: ${jamesCounter} ganger`);
    }
  } else if (msg.content.toLowerCase().includes("!+james")) {
    jamesCounter++;
  } else if (msg.content.toLowerCase().includes("!sid")) {
    const club = getBilic();
    // channel.send(`Just nu er sid fan av ${club}`);
  } else if (msg.content.toLowerCase().includes("!krysset?")) {
    const emoji = client.emojis.cache.find(
      (emoji) => emoji.name === "thumbsup"
    );
    channel.send(`Ledig ${emoji}`);
  } else if (msg.content.toLowerCase().includes("!morata")) {
    const response = [
      "brilliant",
      "trash",
      "ustoppelig",
      "stoppelig",
      "onlyOPinteam",
      "DumpyCPK",
    ];
    const luckyNumber = Math.floor(Math.random() * response.length);
    channel.send(`Fyren er ${response[luckyNumber]}`);
  } else if (msg.content.toLowerCase().includes("!racetime")) {
    const currentDate = new Date();
    let nextRace;
    fetch("https://ergast.com/api/f1/current.json").then((response) =>
      response.json().then((data) => {
        const races = data.MRData.RaceTable.Races;
        for (let index = 0; index < races.length; index++) {
          const race = races[index];
          const raceDate = new Date(`${race.date} ${race.time}`);
          nextRace = race;
          if (raceDate > currentDate) {
            const formattedDate = raceDate.toLocaleDateString("no-NO", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
            const formattedTime = raceDate.toLocaleTimeString("no-NO", {
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
  } else if (msg.content == "!challenges") {
    getChallenges((challenges) => {
      channel.send(
        `\n${challenges.map(
          (challenge) =>
            `Navn: ${challenge.name}, Id: ${challenge.challengeId} \n`
        )}`,
        { code: true }
      );
    });
  } else if (msg.content.toLowerCase().startsWith("!+challenge")) {
    if (msg.content.toLowerCase() === "!+challenge") {
      channel.send(
        'Syntax: !+challenge "navn på challenge" "valg-alternativer (premade varianter: ja/nei, alle)"'
      );
    } else {
      console.log("msg.content", msg.content);
      const split = msg.content
        .split('"')
        .filter((content) => content.trim().length > 0);
      const name = split[1];
      const type = split[2];
      console.log("split", split);
      if (type === "ja/nei") {
        addChallenge(name, type, (challengeId) => {
          channel.send(
            `La til "${type}" challenge med navn "${name}" og id **${challengeId}**`
          );
        });
      } else {
        channel.send(`La til challenge med navn ${name}`);
      }
    }
  } else if (msg.content.toLowerCase().startsWith("!-challenge")) {
    if (msg.content.toLowerCase() === "!-challenge") {
      channel.send(
        'Syntax: !-challenge "challengeId" (funker kun forn onkel fjoggs)'
      );
    } else {
      if (msg.author.username === "Fjoggs") {
        const split = msg.content.split('"');
        const challengeId = Number(split[1]);
        deleteChallenge(challengeId, (message) => {
          channel.send(message);
        });
      }
    }
  } else if (msg.content.toLowerCase().startsWith("!bet")) {
    if (msg.content.toLowerCase() === "!bet") {
      channel.send('Syntax: !bet "betId" "din bet her"');
    } else if (msg.content.toLowerCase() === "!bets") {
      getBets((bets) => {
        channel.send(
          `\n${bets.map(
            (bet) =>
              `ChallengeId: ${bet.challengeId}, Kis: ${
                playersIdsToName[bet.playerId]
              }, Bet: ${bet.bet} \n`
          )}`,
          { code: true }
        );
      });
    } else {
      const split = msg.content
        .split('"')
        .filter((content) => content.trim().length > 0);
      console.log("split", split);
      console.log("split.comnibed");
      const challengeId = Number(split[1]);
      const bet = split[2];
      addBet(challengeId, nameToPlayerIds[msg.author.username], bet);
      msg.author.send(
        `${msg.author.username} betta **${bet}** på challenge nummer ${challengeId}`
      );
    }
    0;
  } else if (msg.content.toLowerCase().startsWith("!donechallenge")) {
    if (msg.content.toLowerCase() === "!donechallenge") {
      channel.send('Syntax: !donechallenge "challengeId" "resultat"');
    } else {
      const split = msg.content
        .split('"')
        .filter((content) => content.trim().length > 0);
      console.log("split", split);
      console.log("split.comnibed");
      const challengeId = Number(split[1]);
      const result = split[2];
      finishChallenge(challengeId, result, () => {
        let losers = [];
        let winners = [];
        getWinners(1, (rows) => {
          rows.forEach((row) => {
            if (row.bet === row.result) {
              winners.push(playersIdsToName[row.playerId]);
            } else {
              losers.push(playersIdsToName[row.playerId]);
            }
          });

          channel.send(
            `+rep: ${
              winners.length > 0 ? `**${winners}**` : "Assa hallo"
            }. -rep: ${
              losers.length > 0 ? `**${losers}**` : "Ingen losers pog"
            }`
          );
        });
      });
    }
    0;
  }
});

const getBilic = async () => {
  const response = await fetch(
    "https://www.transfermarkt.com/slaven-bilic/profil/trainer/3598"
  );
  const html = await response.text();
  const dom = await new JSDOM(html);
  console.log("dom", dom.window);
  // console.log("dom.window['3176']", dom.window.get("3176"));
  // const divs = dom.window.document.getElementsByClassName(
  //   "premium-profil-text"
  // );
  // const divs = dom.window.document.querySelector("#\\3176").textContent;
  const divs = dom.window.document.getElementById("3176").textContent;
  console.log("divs", divs);
  const currentClub = divs[0].innerText.replace("Current club", " ").trim();
  // console.log("currentClub", currentClub);
};

client.login(process.env.TOKEN);

setInterval(() => {
  console.log("polling for messages");
  const events = checkForEvents(liveData);
  const messages = getMessages(events);
  messages.forEach((message) => {
    if (!mute) {
      channel.send(message);
    }
  });
  resetMessages();
}, 60 * 1000); // Every minute
