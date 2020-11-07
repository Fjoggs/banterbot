import fetch from 'node-fetch'

export type Player = {
    element: Number; // id
    position: Number;
    name: String;
    currentScore: Number;
    totalScore?: Number;
}

export type Team = {
    id: Number;
    name: String;
    currentGameweekTeam: Array<Player>;
}

export const getAsyncData = async () => {
    const response = await fetch('https://draft.premierleague.com/api/bootstrap-static');
    const json = await response.json();
    const playerInfo = json.elements || [];
    const currentGameweek = json.events.current;
    const teams = await getLeagueInfo();
    teams.forEach(team => {
        getGameweekStats(team, currentGameweek, playerInfo)
    })
    return teams;
}

const getLeagueInfo = async () => {
    let teams: Array<Team> = [];
    const data = await fetch('https://draft.premierleague.com/api/league/46578/details');
    const leagueDetails = await data.json()
    leagueDetails.league_entries.forEach(team => {
        teams.push({
            id: team.entry_id,
            name: team.entry_name,
            currentGameweekTeam: [],
        })
    });
    return teams;
}

const getGameweekStats = async (team, currentGameweek, playerInfo) => {
    const data = await fetch(`https://draft.premierleague.com/api/entry/${team.id}/event/${currentGameweek}`);
    const gameweekStats = await data.json();
    gameweekStats.picks.forEach((player: Player) => {
        getPlayerInfo(team, player, playerInfo)
    })
}

const getPlayerInfo = async (team, player, playerInfo) => {
    const playerResponse = await fetch(`https://draft.premierleague.com/api/element-summary/${player.element}`);
    const playerDetails = await playerResponse.json()
    const historyArray = playerDetails.history || []
    const lastMatch = historyArray.pop()
    const lastScore = lastMatch.total_points;
    playerInfo.some(playerInfo => {
        if (playerInfo.id === player.element) {
            const currentPlayer: Player = {
                element: player.element,
                position: player.position,
                name: playerInfo.second_name,
                currentScore: lastScore
            }
            team.currentGameweekTeam.push(currentPlayer)
            return true;
        }
    });
}


const prettyPrint = (teams) => {
    teams.forEach(team => {
        let printed = false;
        team.currentGameweekTeam.forEach(currentTeam => {
            if (!printed) {
                console.log(`${team.name} ${(team.id)}. Current gameweek team: `);
                printed = true;
            }
            console.log(currentTeam)
        });
    });
}

