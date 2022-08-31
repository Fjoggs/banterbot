import fetch from 'node-fetch';
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
    activePlayers: new Set(),
    messages: [],
};

const apiUrl = 'https://draft.premierleague.com/api';

export const updateGameweek = async () => {
    const response = await fetch(`${apiUrl}/bootstrap-static`);
    const json: Bootstrap = await getBootstrapData(response);
    state.currentGameweek = json.events.current;
};

export const getCurrentGameweek = () => state.currentGameweek;

export const getAsyncData = async (debugChannel): Promise<GameState> => {
    try {
        const response = await fetch(`${apiUrl}/bootstrap-static`);
        const json: Bootstrap = await getBootstrapData(response);
        state.playerData = json.elements;
        state.currentGameweek = json.events.current || 1;
        state.fantasyTeams = await getLeagueInfo(debugChannel);
        state.fantasyTeams.forEach((fantasyTeam) => {
            getGWStatsForTeam(fantasyTeam, debugChannel);
        });
        return state;
    } catch (error) {
        debugChannel.send(`getAsyncData failed with error: ${error}`);
        return state;
    }
};

const getBootstrapData = async (response): Promise<Bootstrap> => await response.json();

export const getLiveData = async (debugChannel) => {
    let json: Array<unknown> = [];
    try {
        const response = await fetch(`${apiUrl}/event/${state.currentGameweek}/live`);
        json = await response.json();
    } catch (error) {
        debugChannel.send(`getLiveData failed with error: ${error}`);
    }
    return json;
};

const getLeagueInfo = async (debugChannel) => {
    let fantasyTeams: Array<FantasyTeam> = [];
    try {
        const response = await fetch(`${apiUrl}/league/81059/details`);
        const leagueDetails: LeagueDetails = await response.json();
        leagueDetails.league_entries.forEach((fantasyTeam) => {
            fantasyTeams.push({
                id: fantasyTeam.entry_id,
                name: fantasyTeam.entry_name,
                currentGameweekTeam: [],
            });
        });
    } catch (error) {
        debugChannel.send(`getLeagueInfo failed with error: ${error}`);
    }
    return fantasyTeams;
};

const getGWStatsForTeam = async (fantasyTeam: FantasyTeam, debugChannel) => {
    try {
        const response = await fetch(
            `${apiUrl}/entry/${fantasyTeam.id}/event/${state.currentGameweek}`
        );
        const gameweekStats: GameweekStats = await response.json();

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
    } catch (error) {
        debugChannel.send(`getPlayerInfo failed with error: ${error}`);
    }
};

const getPlayerInfoData = async (response): Promise<PlayerDetails> => await response.json();

const gameweekScore = async (fantasyTeam: FantasyTeam, debugChannel) => {
    try {
        const response = await fetch(`${apiUrl}/entry/${fantasyTeam.id}/public`);
        const json: GameweekScore = await response.json();

        fantasyTeam.gameweekScore = json.entry.event_points;

        fantasyTeam.totalScore = json.entry.overall_points;
    } catch (error) {
        debugChannel.send(`gameweekScore failed with error: ${error}`);
    }
};

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
