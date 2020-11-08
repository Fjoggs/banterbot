import * as Discord from "discord.js";
import {
  fetchData,
  luckernoobOfTheWeek,
  rittardOfTheWeek,
  topDickOfTheWeek,
} from "../api/parser";
import { checkForEvents, getLiveData } from "../api/api";

const client = new Discord.Client();

fetchData();
let liveData = {};
const fetchLiveData = async () => (liveData = await getLiveData());
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
    const luckyNumber = Math.floor(Math.random() * (4 - 0 + 1) + 0);
    const response = [
      "(hore)DOMMER",
      "(fitte/hore/)KOMMENTATOR",
      "*random grove gloser etter en totalt irrelevant hendelse*",
      "ser dere ikke linær?",
      "det går så treigt",
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
