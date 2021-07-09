import * as Discord from "discord.js";
import {
  fetchData,
  luckernoobOfTheWeek,
  rittardOfTheWeek,
  topDickOfTheWeek,
} from "../api/parser";
import { checkForEvents, getLiveData } from "../api/api";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

import fetch from "node-fetch";
import BanterBotDB from "../api/db";

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
    db.getScores();
    const scores = db.getScoreList();
    const embed = new Discord.MessageEmbed().setTitle("Challenges").addFields(
      scores.map((score) => {
        return {
          name: score.name,
          value: score.score,
        };
      })
    );
    testChannel.send(
      `Challenges:\n${scores.map(
        (score) => `Player: ${score.name}, Score: ${score.score}\n`
      )}`,
      { code: true }
    );
  } else if (msg.content == "!challenges refresh") {
    db.getChallenges();
    testChannel.send("Updating table");
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

const poll = setInterval(() => {
  const events = checkForEvents(liveData);
  console.log("events", events);
  events.forEach((event) => {
    if (!mute) {
      channel.send(event);
    }
  });
}, 60 * 1000); // Every minute
