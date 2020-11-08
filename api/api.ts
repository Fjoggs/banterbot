import fetch from "node-fetch";

export type Player = {
  element: number; // id
  position: number;
  name: string;
  currentScore: number;
  events: number;
  totalScore?: number;
  penaltySave?: number;
  penaltyMiss?: number;
  minutesPlayed?: number;
};

type Event = {
  name: string;
  points: number;
  value: number;
  stat: string;
};

export type FantasyTeam = {
  id: number;
  name: string;
  currentGameweekTeam: Array<Player>;
  gameweekScore?: number;
  totalScore?: number;
};

export type GameState = {
  playerData: Array<PlayerData>;
  currentGameweek: number;
  fantasyTeams: Array<FantasyTeam>;
  activePlayers: Set<Player>;
};

export type PlayerData = {
  id: number;
  second_name: string;
};

let state: GameState = {
  playerData: [],
  currentGameweek: 0,
  fantasyTeams: [],
  activePlayers: new Set(),
};

export const getAsyncData = async () => {
  const response = await fetch(
    "https://draft.premierleague.com/api/bootstrap-static"
  );
  const json = await response.json();
  state.playerData = json.elements;
  state.currentGameweek = json.events.current;
  state.fantasyTeams = await getLeagueInfo();
  state.fantasyTeams.forEach((fantasyTeam) => {
    getGameweekStatsForSingleFantasyTeam(fantasyTeam);
  });
  return state;
};

const getLeagueInfo = async () => {
  let fantasyTeams: Array<FantasyTeam> = [];
  const data = await fetch(
    "https://draft.premierleague.com/api/league/46578/details"
  );
  const leagueDetails = await data.json();
  leagueDetails.league_entries.forEach((fantasyTeam) => {
    fantasyTeams.push({
      id: fantasyTeam.entry_id,
      name: fantasyTeam.entry_name,
      currentGameweekTeam: [],
    });
  });
  return fantasyTeams;
};

const getGameweekStatsForSingleFantasyTeam = async (
  fantasyTeam: FantasyTeam
) => {
  const data = await fetch(
    `https://draft.premierleague.com/api/entry/${fantasyTeam.id}/event/${state.currentGameweek}`
  );
  const gameweekStats = await data.json();
  gameweekStats.picks.forEach((player: Player) => {
    getPlayerInfo(fantasyTeam, player);
    gameweekScore(fantasyTeam);
  });
};

const getPlayerInfo = async (fantasyTeam, player: Player) => {
  const playerResponse = await fetch(
    `https://draft.premierleague.com/api/element-summary/${player.element}`
  );
  const playerDetails = await playerResponse.json();
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
        events: 0,
        penaltySave: lastMatch.penalties_saved,
        penaltyMiss: lastMatch.penalties_missed,
        minutesPlayed: lastMatch.minutes,
      };
      state.activePlayers.add(currentPlayer);
      counter = counter + 1;
      fantasyTeam.currentGameweekTeam.push(currentPlayer);
      return true;
    }
  });
};

const gameweekScore = async (fantasyTeam: FantasyTeam) => {
  const data = await fetch(
    `https://draft.premierleague.com/api/entry/${fantasyTeam.id}/public`
  );
  const json = await data.json();
  fantasyTeam.gameweekScore = json.entry.event_points;
  fantasyTeam.totalScore = json.entry.overall_points;
};

export const getLiveData = async () => {
  let json = [];
  try {
    const data = await fetch(
      `https://draft.premierleague.com/api/event/8/live`
    );
    json = await data.json();
  } catch (error) {
    console.log("shit hit the fan ", error);
  }
  return json;
};

export const checkForEvents = (data): Array<string> => {
  console.log("checking for events");
  const elements = data.elements;
  let events = [];
  state.activePlayers.forEach((player) => {
    const eventList = elements[player.element].explain[0][0] || [];
    if (eventList.length > 1) {
      if (eventList.length > player.events) {
        const diff = eventList.length - player.events;
        console.log("player.events", player.events);
        console.log("eventList", eventList);
        console.log("diff", diff);
        console.log("eventlist.length - 1", eventList.length - 1);
        console.log("eventlist.length - diff", eventList.length - diff);
        for (let i = eventList.length - 1; i >= eventList.length - diff; i--) {
          const event = eventList[i];
          console.log("event", event);
          state.activePlayers.delete(player);
          let updatedPlayer = player;
          updatedPlayer.events = eventList.length;
          state.activePlayers.add(updatedPlayer);
          if (event.stat === "penalties_saved") {
            events.push(`${player.name} redda akkurat straffe!`);
          } else if (event.stat === "goals_scored") {
            events.push(`Golazo ${player.name}`);
          } else if (event.stat === "red_cards") {
            events.push(`Off you pop ${player.name}`);
          } else if (event.stat === "penalties_missed") {
            events.push(`${player.name} pls`);
          }
        }
      }
    }
  });
  console.log("events", events);
  return events;
};
