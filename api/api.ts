import fetch from "node-fetch";

export type Player = {
  element: number; // id
  position: number;
  name: string;
  currentScore: number;
  events: Event[];
  totalScore?: number;
  penaltySave?: number;
  penaltyMiss?: number;
  minutesPlayed?: number;
  messagesSent: number;
};

type Event = {
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
  messages: string[];
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
  messages: []
};

export const getAsyncData = async () => {
  const response = await fetch(
    "https://draft.premierleague.com/api/bootstrap-static"
  );
  const json = await response.json();
  state.playerData = json.elements;
  console.log("json", json.events.current);
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
  try {
    leagueDetails.league_entries.forEach((fantasyTeam) => {
      fantasyTeams.push({
        id: fantasyTeam.entry_id,
        name: fantasyTeam.entry_name,
        currentGameweekTeam: [],
      });
    });
  } catch (error) {
    console.log("shit went wrong!", error);
  }
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
        events: [],
        penaltySave: lastMatch.penalties_saved,
        penaltyMiss: lastMatch.penalties_missed,
        minutesPlayed: lastMatch.minutes,
        messagesSent: 0
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
    const url = `https://draft.premierleague.com/api/event/${state.currentGameweek}/live`;
    console.log("getting events for url", url);
    const data = await fetch(url);
    json = await data.json();
  } catch (error) {
    console.log("shit hit the fan ", error);
  }
  return json;
};

export const checkForEventsWithState = (data, incomingState) => {
  state = incomingState;
  checkForEvents(data)
}

export const checkForEvents = (data) => {
  const elements = data.elements;
  if (state.activePlayers) {
    state.activePlayers.forEach(player => {
      const eventList = elements[player.element].explain[0][0] || [];
      if (eventList.length > player.events) {
        eventList.forEach(event => {
          state.activePlayers.delete(player)
          let updatedPlayer = player
          updatedPlayer.events.push({
            stat: event.stat,
            points: event.points,
            value: event.value
          })
          state.activePlayers.add(player)
        });
      }
    })
  }
}

export const getState = () => state;

export const getMessagesWithState = (events, incomingState) => {
  state = incomingState
  return getMessages(events)
}

export const getMessages = (events): Array<String> => {
  if (events?.length > 1) {
    events.forEach((event: { stat: string; playerName: any; }) => {
      if (event.stat === "penalties_saved") {
        state.messages.push(`${event.playerName} redda akkurat straffe!`);
      } else if (event.stat === "goals_scored") {
        state.messages.push(`Golazo ${event.playerName}`);
      } else if (event.stat === "red_cards") {
        state.messages.push(`Off you pop ${event.playerName}`);
      } else if (event.stat === "penalties_missed") {
        state.messages.push(`${event.playerName} pls`);
      }
    });
  }
  return state.messages;
}

export const resetMessages = () => (state.messages = [])

export const updateGameweekState = (element: number) => {

}


export const checkForEvents2 = (data): Array<string> => {
  console.log("checking for events");
  const elements = data.elements;
  let events = [];
  // if (state.activePlayers) {
  //   state.activePlayers.forEach((player) => {
  //     if (elements) {
  //       if (elements[player.element]) {
  //         let eventList = [];
  //         if (
  //           elements[player.element].explain[0] &&
  //           elements[player.element].explain[0][0]
  //         ) {
  //           eventList = elements[player.element].explain[0][0];
  //         }
  //         if (eventList.length > 1) {
  //           if (eventList.length > player.events) {
  //             const diff = eventList.length - player.events;
  //             for (
  //               let i = eventList.length - 1;
  //               i >= eventList.length - diff;
  //               i--
  //             ) {
  //               const event = eventList[i];
  //               state.activePlayers.delete(player);
  //               let updatedPlayer = player;
  //               updatedPlayer.events = eventList.length;
  //               state.activePlayers.add(updatedPlayer);
  //               if (event.stat === "penalties_saved") {
  //                 events.push(`${player.name} redda akkurat straffe!`);
  //               } else if (event.stat === "goals_scored") {
  //                 events.push(`Golazo ${player.name}`);
  //               } else if (event.stat === "red_cards") {
  //                 events.push(`Off you pop ${player.name}`);
  //               } else if (event.stat === "penalties_missed") {
  //                 events.push(`${player.name} pls`);
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   });
  // }
  console.log("events", events);
  return events;
};
