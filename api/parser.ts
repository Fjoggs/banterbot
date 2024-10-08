import { FantasyTeam, GameState } from '../types/Fantasy';
import { getAsyncData } from './api';

let state: GameState;
export const fetchData = async (debugChannel) => (state = await getAsyncData(debugChannel));

export const rittardOfTheWeek = () => {
  let currentRittard = '';
  let currentScore = 0;
  state.fantasyTeams.forEach((team: FantasyTeam) => {
    let benchScore = 0;
    team.currentGameweekTeam.forEach((player) => {
      if (player.position > 11) {
        benchScore += player.currentScore;
      }
    });
    if (benchScore > currentScore) {
      currentScore = benchScore;
      currentRittard = team.name;
    }
  });
  return `Ukas rittard er "${currentRittard}" med ${currentScore} poeng på benken. NOICE`;
};

export const topDickOfTheWeek = () => {
  let currentTopDick = '';
  let currentScore = 0;
  state.fantasyTeams.forEach((team: FantasyTeam) => {
    if (team.gameweekScore && team.gameweekScore > currentScore) {
      currentScore = team.gameweekScore;
      currentTopDick = team.name;
    }
  });
  return `Ukas topdick er "${currentTopDick}" med ${currentScore}`;
};

export const luckernoobOfTheWeek = () => {
  let currentLuckernoob = '';
  let currentAmount = 0;
  state.fantasyTeams.forEach((team: FantasyTeam) => {
    team.currentGameweekTeam.forEach((player) => {
      if (player.penaltySave && player.penaltySave > currentAmount) {
        currentAmount = +player.penaltySave;
        currentLuckernoob = team.name;
      }
    });
  });
  if (currentAmount > 0) {
    const format = currentAmount > 1 ? 'strafferedninger' : 'strafferedning';
    return `Ukas luckernoob er "${currentLuckernoob}" med ${currentAmount} ${format}`;
  } else {
    return 'Kun noobs denne uka';
  }
};

export const essentialOfTheWeek = () => {};

export const table = () => {
  console.log('state', state);
};
