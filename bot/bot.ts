import * as Discord from "discord.js";
import {
  fetchData,
  luckernoobOfTheWeek,
  rittardOfTheWeek,
  topDickOfTheWeek,
} from "../api/parser";
import { checkForEvents, getLiveData } from "../api/api";

const client = new Discord.Client();

let liveData = {};
const fetchLiveData = async () => {
  await fetchData();
  liveData = await getLiveData()
};
fetchLiveData();

let channel;
let mute = false;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  channel = client.channels.cache.get("110121552934100992"); //preik
});

let max = 0;
let randomBanter = () => Math.floor(Math.random() * (max - 0 + 1) + 0);
let banterPool = [];

client.on("message", (msg) => {
  if (msg.content.includes("!addbanter")) {
    banterPool.push(msg.content.replace("!addbanter ", ""));
    max = max + 1;
  } else if (msg.content === "!banter") {
    channel.send(banterPool[randomBanter()] || "her vare tomt");
  } else if (msg.content === "!rittard") {
    channel.send(rittardOfTheWeek());
  } else if (msg.content === "!topdick") {
    const emoji = client.emojis.cache.find((emoji) => emoji.name === "ez");
    channel.send(`${topDickOfTheWeek()} ${emoji.toString()}`);
  } else if (msg.content === "!luckernoob") {
    channel.send(luckernoobOfTheWeek());
  } else if (msg.content === "!pope") {
    channel.send("Fuck Pope");
  } else if (msg.content === "!baitley") {
    const emoji = client.emojis.cache.find((emoji) => emoji.name === "kekw");
    channel.send(emoji.toString());
  } else if (msg.content === "!var") {
    const luckyNumber = Math.floor(Math.random() * (4 - 0 + 1) + 0);
    const response = ["offside", "onside", "dive", "gåll", "felling"];
    channel.send(`Soleklar ${response[luckyNumber]}`);
  } else if (msg.content === "!molbs") {
    const luckyNumber = Math.floor(Math.random() * (5 - 0 + 1) + 0);
    const randomArsenalPlayer = Math.floor(Math.random() * (4 - 0 + 1) + 0);
    const essentialArsenalPlayers = ["Laca", "Tierney", "Ødegaard", "Saka", "Xhaka"]
    const response = [
      "DOMMER",
      "han kommentatoren er så jævlig rittard",
      "*random grove gloser etter en totalt irrelevant hendelse*",
      "ser dere ikke linær?",
      "det går så treigt",
      `er ${essentialArsenalPlayers[randomArsenalPlayer]} essential?`
    ];
    channel.send(response[luckyNumber]);
  } else if (msg.content === "!mute") {
    mute = true;
    channel.send("Kein liveoppdateringer");
  } else if (msg.content === "!unmute") {
    const emoji = client.emojis.cache.find(
      (emoji) => emoji.name === "pagchomp"
    );
    mute = false;
    channel.send(`Spam back on the menu ${emoji.toString()}`);
  } else if (msg.content === "!semb") {
    const luckyNumber = Math.floor(Math.random() * (4 - 0 + 1) + 0);
    const response = [
      "Skal det bli noen poeng så må de score et mål her",
      "Kampen er kjemisk fritt for målsjanser",
      "Pasningsfeilene i denne matchen har vært på et alt for høyt nivå",
      "Ballwatching",
      "Det er et bra løp, men han er i offside"
    ];
    channel.send(response[luckyNumber]);
  } else if (msg.content === "!jose") {
    const luckyNumber = Math.floor(Math.random() * (5 - 0 + 1) + 0);
    const response = [
      "https://i.redd.it/ktbd2jkzxh761.gif",
      "https://i.imgur.com/Ci4WQ0Q.gif",
      "https://cdn-cf-east.streamable.com/video/mp4/aih0w.mp4?Expires=1612218120&Signature=Byl9~~UIcav7fMvBYPN-LlieDrySrLqylAuMd1pKJHmh6suIOpnmssuOEPD6n5Kcfg0v-IZiz6pzqc5ucDHJJ7EpbqK1-t~S~AibY3ev04XgdfOXX~TUZ87Dr3fn79YwlQUkn5o~prRrBIEkV3Kjm164ynRyjpEtZu3a1BrXCiqfZLq8jxKbzEhNevI3cHTRpT~luwmYArrFoNPtuMsMM9FiXz8-06fECh9PCuT~zZIcry30LvsVVVRzNxxJZT7Glr-wnljXR7HAv9uwAw-XP~LfB4gYhF8zv~GYFWjOuRBASA2GODPzZzNhte5WLHumRK~MGhPuVGFEJ4TCYGbtVw__&Key-Pair-Id=APKAIEYUVEN4EVB2OKEQ",
      "https://zippy.gfycat.com/BruisedFlawlessAngwantibo.webm",
      "https://zippy.gfycat.com/MasculineAgedBlowfish.webm",
      "https://i.imgur.com/Lb9KSKa.mp4"
    ];
    channel.send(response[luckyNumber]);
  }
});

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
