import { getAsyncData, Team } from "./api"


let data = []
export const fetchData = async () => data = await getAsyncData()

export const rittardOfTheWeek = () => {
    let currentRittard = '';
    let currentScore = 0;
    data.forEach((team: Team) => {
        let benchScore = 0;
        team.currentGameweekTeam.forEach(player => {
            if (player.position > 11) {
                benchScore += player.currentScore;
            }
        });
        if (benchScore > currentScore) {
            currentScore = benchScore;
            currentRittard = team.name;
        }
    });
    return `Ukas rittard er "${currentRittard}" med ${currentScore} poeng på benken. NOICE`
}