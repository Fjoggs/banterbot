import fetch from 'node-fetch'

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
}

type Event = {
    name: string;
    points: number;
    value: number;
    stat: string;
}

export type Team = {
    id: number;
    name: string;
    currentGameweekTeam: Array<Player>;
    gameweekScore?: number;
    totalScore?: number;
}

export let fantasyTeamIds = [];
let activePlayers: Array<Player> = [];

export const getAsyncData = async () => {
    const response = await fetch('https://draft.premierleague.com/api/bootstrap-static');
    const json = await response.json();
    const playerInfo = json.elements || [];
    const currentGameweek = json.events.current;
    const teams = await getLeagueInfo();
    teams.forEach(fantasyTeam => {
        getGameweekStats(fantasyTeam, currentGameweek, playerInfo)
    })
    return teams;
}

const getLeagueInfo = async () => {
    let fantasyTeams: Array<Team> = [];
    const data = await fetch('https://draft.premierleague.com/api/league/46578/details');
    const leagueDetails = await data.json()
    fantasyTeamIds = [];
    leagueDetails.league_entries.forEach(fantasyTeam => {
        fantasyTeamIds.push(fantasyTeam.entry_id);
        fantasyTeams.push({
            id: fantasyTeam.entry_id,
            name: fantasyTeam.entry_name,
            currentGameweekTeam: [],
        })
    });
    return fantasyTeams;
}

const getGameweekStats = async (fantasyTeam: Team, currentGameweek, playerInfo) => {
    const data = await fetch(`https://draft.premierleague.com/api/entry/${fantasyTeam.id}/event/${currentGameweek}`);
    const gameweekStats = await data.json();
    gameweekStats.picks.forEach((player: Player) => {
        getPlayerInfo(fantasyTeam, player, playerInfo)
        gameweekScore(fantasyTeam)
    })
}

const getPlayerInfo = async (fantasyTeam, player: Player, playerInfo) => {
    const playerResponse = await fetch(`https://draft.premierleague.com/api/element-summary/${player.element}`);
    const playerDetails = await playerResponse.json()
    const historyArray = playerDetails.history || []
    const lastMatch = historyArray.pop()
    const lastScore = lastMatch.total_points;
    let counter = 0;
    playerInfo.some(playerInfo => {
        if (playerInfo.id === player.element) {
            const currentPlayer: Player = {
                element: player.element,
                position: player.position,
                name: playerInfo.second_name,
                currentScore: lastScore,
                events: 0,
                penaltySave: lastMatch.penalties_saved,
                penaltyMiss: lastMatch.penalties_missed,
                minutesPlayed: lastMatch.minutes,

            }
            // console.log('currentPlayer', currentPlayer);
            activePlayers.push(currentPlayer);
            counter = counter + 1;
            fantasyTeam.currentGameweekTeam.push(currentPlayer)
            return true;
        }
    });
}


const gameweekScore = async (fantasyTeam: Team) => {
    const data = await fetch(`https://draft.premierleague.com/api/entry/${fantasyTeam.id}/public`)
    const json = await data.json()
    fantasyTeam.gameweekScore = json.entry.event_points;
    fantasyTeam.totalScore = json.entry.overall_points;
}

export const getLiveData = async () => {
    let json = []
    try {
        const data = await fetch(`https://draft.premierleague.com/api/event/8/live`);
        json = await data.json();
    } catch (error) {
        console.log('shit hit the fan ', error);
    }
    return json;
}

export const checkForEvents = (data) => {
    console.log('checking for events');
    const elements = data.elements;
    let events = []
    let index = 0;
    console.log('activePlayers.length', activePlayers.length);
    activePlayers.forEach(player => {
        const eventList = elements[player.element].explain[0][0] || [];
        const diff = eventList.length - player.events;
        // console.log('diff', player.name, diff)
        if (diff > 0) {
            for (let i = 0; i < diff; i++) {
                const event: Event = eventList[i];
                activePlayers[index].events = eventList.length;
                if (event.stat === 'penalties_saved') {
                    events.push(`${player.name} redda akkurat straffe!`);
                }
            }
        }
        index++;
    });
    return events;
}

