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

let playerInfoArray = []
let currentGameweek = 0;
let teams: Array<Team> = [];


export const getData = () => {
    fetch('https://draft.premierleague.com/api/bootstrap-static').then(response => {
        response.json().then(value => {
            playerInfoArray = value.elements || [];
            currentGameweek = value.events.current;
            getLeagueInfo()
        }).catch(error => {
            console.log('something went wrong', error)
        })
    }).catch(error => {
        console.log('error', error)
    })
}
getData();

const getLeagueInfo = () => {
    fetch('https://draft.premierleague.com/api/league/46578/details').then(response => {
        response.json().then(value => {
            value.league_entries.forEach(team => {
                teams.push({
                    id: team.entry_id,
                    name: team.entry_name,
                    currentGameweekTeam: [],
                })
            });
            getGameweekStats()
        })
    })
}

const getGameweekStats = () => {
    teams.forEach(team => {
        fetch(`https://draft.premierleague.com/api/entry/${team.id}/event/${currentGameweek}`).then(response => {
            response.json().then(gameweekTeam => {
                gameweekTeam.picks.forEach((player: Player) => {
                    fetch(`https://draft.premierleague.com/api/element-summary/${player.element}`).then(playerResponse => {
                        playerResponse.json().then(playerValue => {
                            const historyArray = playerValue.history || []
                            const lastMatch = historyArray.pop()
                            const lastScore = lastMatch.total_points;
                            playerInfoArray.some(playerInfo => {
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
                        })
                    })
                });
            })
        }).catch(error => {
            console.log('getGameweekStats Trouble brewing: ', error)
        })
    });
}


const prettyPrint = () => {
    console.log('teams', teams)
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

setTimeout(prettyPrint, 1000)
