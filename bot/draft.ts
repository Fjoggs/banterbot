import * as Discord from 'discord.js';
import { luckernoobOfTheWeek, rittardOfTheWeek, topDickOfTheWeek } from '../api/parser';
import {
  Bootstrap,
  GameweekScore,
  GameweekStats,
  LeagueDetails,
  Player,
  PlayerElement,
  PlayerElements,
} from '../types/Fantasy';
import { runAndReport } from './util';
import fetch from 'node-fetch';

export interface Standing {
  league_entry: number;
  name: string;
  points_for: number;
  total: number;
}

const leagueCode = 22160;
const apiUrl = 'https://draft.premierleague.com/api';

export const checkForDraft = (msg: Discord.Message, channel, debugChannel, client) => {
  const messageIncludes = (phrase: string) => msg.content.toLowerCase().includes(phrase);
  if (messageIncludes('!rittard')) {
    runAndReport(
      async () => {
        const emoji = client.emojis.cache.find((emoji) => emoji.name === 'yepscience');
        channel.send(`Dypdykker i draften for å finne ukas rittard ${emoji.toString()}`);
        let currentRittard = '';
        let currentScore = 0;
        const leagueDetails = await fetchLeagueDetails();
        const gameweek = await getGameweek();
        const response = await fetch(`${apiUrl}/event/${gameweek}/live`);
        const data = (await response.json()) as { elements: PlayerElements };
        for (const entry of leagueDetails.league_entries) {
          let benchScore = 0;
          if (entry.short_name !== 'AV') {
            const stats = await getGWStatsForTeam(entry.entry_id);
            for (const player of stats.picks) {
              if (player.position > 11) {
                const playerScore = data.elements[player.element].stats.total_points;
                benchScore += playerScore;
              }
            }
            if (benchScore > currentScore) {
              currentScore = benchScore;
              currentRittard = entry.entry_name;
            }
          }
        }
        return channel.send(
          `Ukas rittard er "${currentRittard}" med ${currentScore} poeng på benken. NOICE`
        );
      },
      debugChannel,
      '!rittard'
    );
  } else if (messageIncludes('!topdick')) {
    runAndReport(
      async () => {
        const yepscience = client.emojis.cache.find((emoji) => emoji.name === 'yepscience');
        channel.send(`Dypdykker i draften for å finne ukas topdick ${yepscience.toString()}`);
        const emoji = client.emojis.cache.find((emoji) => emoji.name === 'ez');
        let currentTopDick = '';
        let currentScore = 0;
        const leagueDetails = await fetchLeagueDetails();
        for (const entry of leagueDetails.league_entries) {
          if (entry.short_name !== 'AV') {
            const score = await getGameweekScore(entry.entry_id);
            if (score && score > currentScore) {
              currentScore = score;
              currentTopDick = entry.entry_name;
            }
          }
        }
        channel.send(`Ukas topdick er "${currentTopDick}" med ${currentScore} ${emoji.toString()}`);
      },
      debugChannel,
      '!ban'
    );
  } else if (messageIncludes('!luckernoob')) {
    runAndReport(() => channel.send(luckernoobOfTheWeek()), debugChannel, '!luckernoob');
  } else if (messageIncludes('!draft')) {
    runAndReport(
      async () => {
        const leagueDetails = await fetchLeagueDetails();
        const standings: Array<Standing> = [];
        let message = '```\n';
        leagueDetails.standings.forEach((standing) => {
          const name = leagueDetails.league_entries.find(
            (entry) => entry.id === standing.league_entry
          ).entry_name;

          if (name) {
            standings.push({
              league_entry: standing.league_entry,
              name,
              points_for: standing.points_for,
              total: standing.total,
            });
          }
        });
        standings.sort((a, b) => b.points_for - a.points_for);
        standings.forEach((standing, index) => {
          message += `${index + 1}. ${standing.name}: ${standing.points_for}\n`;
        });
        channel.send(message + '```');
      },
      debugChannel,
      '!draft'
    );
  }
};

const fetchLeagueDetails = async () => {
  const response = await fetch(`${apiUrl}/league/${leagueCode}/details`);
  const leagueDetails: LeagueDetails = (await response.json()) as LeagueDetails;
  return leagueDetails;
};

const getGWStatsForTeam = async (id: number) => {
  const gameweek = await getGameweek();
  const response = await fetch(`${apiUrl}/entry/${id}/event/${gameweek}`);
  return (await response.json()) as GameweekStats;
};

const getGameweekScore = async (id: number) => {
  const response = await fetch(`${apiUrl}/entry/${id}/public`);
  const json = (await response.json()) as GameweekScore;
  return json.entry.event_points;
};

export const getGameweek = async () => {
  const response = await fetch(`${apiUrl}/bootstrap-static`);
  const json = (await response.json()) as Bootstrap;
  return json.events.current;
};
