import fetch from 'node-fetch';
import { updateChallenge } from './db/challenges';

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
    messages: [],
};

export interface Bootstrap {
    elements: Array<PlayerData>;
    events: {
        current: number;
    };
}

export interface LeagueDetails {
    league_entries: Array<{
        entry_id: number;
        entry_name: string;
    }>;
}

export interface GameweekStats {
    picks: Array<Player>;
}

export interface PlayerDetails {
    history: Array<{
        total_points: number;
        penalties_saved: number;
        penalties_missed: number;
        minutes: number;
    }>;
}

export interface GameweekScore {
    entry: {
        event_points: number;
        overall_points: number;
    };
}

export const getAsyncData = async () => {
    const response = await fetch('https://draft.premierleague.com/api/bootstrap-static');
    const json: Bootstrap = await getBootstrapData(response);
    state.playerData = json.elements;
    state.currentGameweek = json.events.current;
    state.fantasyTeams = await getLeagueInfo();
    state.fantasyTeams.forEach((fantasyTeam) => {
        console.log('fantasyTeam', fantasyTeam);
        getGameweekStatsForSingleFantasyTeam(fantasyTeam);
    });
    return state;
};

const getBootstrapData = async (response): Promise<Bootstrap> => await response.json();

export const getLiveData = async () => {
    let json: Array<unknown> = [];
    try {
        const url = `https://draft.premierleague.com/api/event/${state.currentGameweek}/live`;
        const response = await fetch(url);

        json = await getLiveDataResponse(response);
    } catch (error) {
        console.log('shit hit the fan ', error);
    }
    return json;
};

const getLiveDataResponse = async (response): Promise<Array<unknown>> => await response.json();

const getLeagueInfo = async () => {
    let fantasyTeams: Array<FantasyTeam> = [];
    const response = await fetch('https://draft.premierleague.com/api/league/55840/details');
    const leagueDetails: LeagueDetails = await getLeagueInfoData(response);
    try {
        leagueDetails.league_entries.forEach((fantasyTeam) => {
            fantasyTeams.push({
                id: fantasyTeam.entry_id,
                name: fantasyTeam.entry_name,
                currentGameweekTeam: [],
            });
        });
    } catch (error) {
        console.log('shit went wrong!', error);
    }
    return fantasyTeams;
};

const getLeagueInfoData = async (response): Promise<LeagueDetails> => await response.json();

const getGameweekStatsForSingleFantasyTeam = async (fantasyTeam: FantasyTeam) => {
    const response = await fetch(
        `https://draft.premierleague.com/api/entry/${fantasyTeam.id}/event/${state.currentGameweek}`
    );
    const gameweekStats: GameweekStats = await getGameweekData(response);

    gameweekStats.picks.forEach((player: Player) => {
        getPlayerInfo(fantasyTeam, player);
        gameweekScore(fantasyTeam);
    });
};

const getGameweekData = async (response): Promise<GameweekStats> => await response.json();

const getPlayerInfo = async (fantasyTeam, player: Player) => {
    const playerResponse = await fetch(
        `https://draft.premierleague.com/api/element-summary/${player.element}`
    );
    const playerDetails: PlayerDetails = await getPlayerInfoData(playerResponse);

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
            state.activePlayers.add(currentPlayer);
            counter = counter + 1;
            fantasyTeam.currentGameweekTeam.push(currentPlayer);
            return true;
        }
    });
};

const getPlayerInfoData = async (response): Promise<PlayerDetails> => await response.json();

const gameweekScore = async (fantasyTeam: FantasyTeam) => {
    const response = await fetch(
        `https://draft.premierleague.com/api/entry/${fantasyTeam.id}/public`
    );
    const json: GameweekScore = await getGameweekScoreData(response);

    fantasyTeam.gameweekScore = json.entry.event_points;

    fantasyTeam.totalScore = json.entry.overall_points;
};

const getGameweekScoreData = async (response): Promise<GameweekScore> => await response.json();

export const checkForEventsWithState = (data, incomingState) => {
    state = incomingState;
    checkForEvents(data);
};

export const checkForEvents = (data) => {
    const elements = data.elements;
    let events = [];
    if (state.activePlayers) {
        state.activePlayers.forEach((player) => {
            try {
                const eventList = elements[player.element].explain[0][0] || [];
                if (eventList.length > player.events.length) {
                    let updatedPlayer;
                    eventList.forEach((event) => {
                        state.activePlayers.delete(player);
                        updatedPlayer.events.push({
                            stat: event.stat,
                            points: event.points,
                            value: event.value,
                        });
                        state.activePlayers.add(updatedPlayer);
                    });
                }
            } catch {
                // console.log('error');
            }
        });
    }
    return state;
};

export const getState = () => state;

export const getMessagesWithState = (events, incomingState) => {
    state = incomingState;
    return getMessages(events);
};

export const getMessages = (events): Array<String> => {
    if (events?.length > 1) {
        events.forEach((event: { stat: string; playerName: any }) => {
            if (event.stat === 'penalties_saved') {
                state.messages.push(`${event.playerName} redda akkurat straffe!`);
            } else if (event.stat === 'goals_scored') {
                state.messages.push(`Golazo ${event.playerName}`);
            } else if (event.stat === 'red_cards') {
                state.messages.push(`Off you pop ${event.playerName}`);
            } else if (event.stat === 'penalties_missed') {
                state.messages.push(`${event.playerName} pls`);
            }
        });
    }
    return state.messages;
};

export const resetMessages = () => (state.messages = []);

export const updateGameweekState = (element: number) => {};

export const checkForEvents2 = (data): Array<string> => {
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
    return events;
};
