import fetch from 'node-fetch';
import { forEachChild } from 'typescript';
import {
  GameState,
  Bootstrap,
  FantasyTeam,
  LeagueDetails,
  GameweekStats,
  PlayerDetails,
  GameweekScore,
  Player,
} from '../types/Fantasy';

let state: GameState = {
  playerData: [],
  currentGameweek: 0,
  fantasyTeams: [],
  activePlayers: {},
  messages: [],
};

const leagueCode = 22160;
const apiUrl = 'https://draft.premierleague.com/api';

export const updateGameweek = async (debugChannel) => {
  try {
    const response = await fetch(`${apiUrl}/bootstrap-static`);
    const json: Bootstrap = (await response.json()) as Bootstrap;
    state.currentGameweek = json.events.current;
  } catch (error) {
    debugChannel.send(`updateGameweek failed with error: ${error}`);
  }
};

export const getCurrentGameweek = () => state.currentGameweek;

export const getGraphData = async (): Promise<string[]> => {
  let stats = [];
  try {
    const teams = await getLeagueInfo({});
    stats = await Promise.all(
      teams.map(async (fantasyTeam) => {
        const team = {
          name: fantasyTeam.name,
          id: fantasyTeam.id,
          scores: [],
        };
        const response = await fetch(`${apiUrl}/entry/${fantasyTeam.id}/history`);
        const historyJson = await response.json();
        historyJson.history.forEach(
          (history: { event: number; points: number; total_points: number }) => {
            team.scores.push({
              week: history.event,
              points: history.points,
              totalPoints: history.total_points,
            });
          }
        );
        return team;
      })
    );
  } catch (error) {
    console.log('blew up');
  }
  return stats;
};

export const getAsyncData = async (debugChannel): Promise<GameState> => {
  try {
    const response = await fetch(`${apiUrl}/bootstrap-static`);
    const json: Bootstrap = (await response.json()) as Bootstrap;
    state.playerData = json.elements;
    state.currentGameweek = json.events.current || 1;
    state.fantasyTeams = await getLeagueInfo(debugChannel);
    state.fantasyTeams.forEach((fantasyTeam) => {
      getGWStatsForTeam(fantasyTeam, debugChannel);
    });
  } catch (error) {
    // debugChannel.send(`getAsyncData failed with error: ${error}`);
  }
  return state;
};

export const getLiveData = async (debugChannel) => {
  let json: Array<unknown> = [];
  try {
    const response = await fetch(`${apiUrl}/event/${state.currentGameweek}/live`);
    json = (await response.json()) as Array<unknown>;
  } catch (error) {
    // debugChannel.send(`getLiveData failed with error: ${error}`);
  }
  return json;
};

const getLeagueInfo = async (debugChannel) => {
  let fantasyTeams: Array<FantasyTeam> = [];
  try {
    // const response = await fetch(`${apiUrl}/league/81059/details`);
    const response = await fetch(`${apiUrl}/league/${leagueCode}/details`);
    const leagueDetails: LeagueDetails = (await response.json()) as LeagueDetails;
    leagueDetails.league_entries.forEach((fantasyTeam) => {
      fantasyTeams.push({
        id: fantasyTeam.entry_id,
        name: fantasyTeam.entry_name,
        currentGameweekTeam: [],
      });
    });
  } catch (error) {
    // debugChannel.send(`getLeagueInfo failed with error: ${error}`);
  }
  return fantasyTeams;
};

const getGWStatsForTeam = async (fantasyTeam: FantasyTeam, debugChannel) => {
  try {
    const response = await fetch(
      `${apiUrl}/entry/${fantasyTeam.id}/event/${state.currentGameweek}`
    );
    const gameweekStats: GameweekStats = (await response.json()) as GameweekStats;

    gameweekStats.picks.forEach((player: Player) => {
      getPlayerInfo(fantasyTeam, player, debugChannel);
      gameweekScore(fantasyTeam, debugChannel);
    });
  } catch (error) {
    debugChannel.send(`getLeagueInfo failed with error: ${error}`);
  }
};

const getPlayerInfo = async (fantasyTeam, player: Player, debugChannel) => {
  try {
    const playerResponse = await fetch(`${apiUrl}/element-summary/${player.element}`);
    const playerDetails: PlayerDetails = await playerResponse.json();

    const historyArray = playerDetails.history || [];
    const lastMatch = historyArray.pop();
    const lastScore = lastMatch.total_points;
    let counter = 0;
    state.playerData.some((data) => {
      if (data.id === player.element) {
        const currentPlayer: Player = {
          element: player.element,
          position: player.position,
          name: data.second_name,
          currentScore: lastScore,
          events: [],
          penaltySave: lastMatch.penalties_saved,
          penaltyMiss: lastMatch.penalties_missed,
          minutesPlayed: lastMatch.minutes,
          messagesSent: 0,
        };
        state.activePlayers[player.element] = currentPlayer;
        counter = counter + 1;
        fantasyTeam.currentGameweekTeam.push(currentPlayer);
        return true;
      }
    });
  } catch (error) {
    debugChannel.send(`getPlayerInfo failed with error: ${error}`);
  }
};

const gameweekScore = async (fantasyTeam: FantasyTeam, debugChannel) => {
  try {
    const response = await fetch(`${apiUrl}/entry/${fantasyTeam.id}/public`);
    const json: GameweekScore = (await response.json()) as GameweekScore;

    fantasyTeam.gameweekScore = json.entry.event_points;

    fantasyTeam.totalScore = json.entry.overall_points;
  } catch (error) {
    debugChannel.send(`gameweekScore failed with error: ${error}`);
  }
};
