import * as Discord from 'discord.js';
import {
  getWinnersInLeague,
  getBets,
  BetJoinedChallenges,
  addBet,
  BetJoinedChallengesJoinedLeagueChallenges,
  getWinners,
} from '../api/db/bets';
import {
  getChallenges,
  Challenge,
  addChallenge,
  addChallengeToLeague,
  deleteChallenge,
  finishChallenge,
  getChallenge,
  updateChallenge,
} from '../api/db/challenges';
import {
  changeLeagueRep,
  getLeague,
  League,
  getLeaguePlayers,
  getLeagues,
  League_League_Challenges_Challenge,
  addLeague,
  deleteLeague,
} from '../api/db/leagues';
import { changePlayerTotalRep, getPlayers, getStats, Player, Stats } from '../api/db/players';

let currentChallengeId;

const nameToPlayerIds = {
  fjoggs: 1,
  nwbi: 2,
  fnettarn: 3,
  vimbs: 4,
  ulfoshashtagattenfemtifire: 5,
  dun_: 6,
  torp1: 7,
  illegal_taxi: 8,
  nuppe: 9,
  biten: 10,
  godyzz: 11,
  molbs: 12,
  juell: 13,
};

const playersIdsToName = {
  1: 'Fjoggs',
  2: 'nwbi',
  3: 'FN',
  4: 'Vimbs',
  5: 'Ulfos',
  6: 'dun',
  7: 'Torp',
  8: 'illegal_taxi',
  9: 'Nuppe',
  10: 'biten',
  11: 'gody',
  12: 'Molbs',
  13: 'juell',
};

export const checkForProfeten = (msg: Discord.Message, channel, debugChannel) => {
  const messageIsEqual = (phrase: string) => msg.content.toLowerCase() === phrase;
  const messageStartsWith = (phrase: string) => msg.content.toLowerCase().startsWith(phrase);

  if (messageIsEqual('!help')) {
    const embed = new Discord.MessageEmbed().setTitle('Commands').addFields(
      {
        name: '!spill',
        value: 'Viser alle spill, åpen eller lukket',
      },
      {
        name: '!spill navn på spill (valg alternativer i parantes) ligaId <- ikke obligatorisk',
        value: 'Legger til nytt spill',
      },
      {
        name: '!fasit spillId resultat',
        value: 'Lukker et spill med gitt spillid og resultat og deler ut rep',
      },
      {
        name: '!-spill spillId',
        value: 'Sletter et spill. Funker kun for Fjoggs',
      },
      {
        name: '!bet spillId din bet her',
        value: 'Legger til et bet hvis spillet med gitt id er åpent',
      },
      {
        name: '!rep',
        value: 'Viser total rep for alle spillere, uavhengig av liga',
      },
      {
        name: '!rep ligaId',
        value: 'Viser rep for alle spillere i en gitt liga',
      },
      {
        name: '!liga navn på liga',
        value: 'Legger til en ny liga',
      },
      {
        name: '!-liga ligaId',
        value: 'Sletter en liga. Funker kun for Fjoggs',
      },
      {
        name: '!setid',
        value: 'Setter aktiv spill id slik at shorthand bets/donespill funker',
      }
    );
    debugChannel.send({ embeds: [embed] });
  } else if (messageStartsWith('!skynet')) {
    const challengeId = Number(msg.content.toLowerCase().replace('!skynet ', ''));
    getChallenge(challengeId, (challenge: Challenge) => {
      if (challenge) {
        const options = challenge.options.split(' ');
        const magicNumber = Math.floor(Math.random() * options.length);
        debugChannel.send(`Ez seier for ${options[magicNumber]}`);
      } else {
        debugChannel.send(':feelsbotman:');
      }
    });
  } else if (messageStartsWith('!setid')) {
    currentChallengeId = Number(msg.content.toLowerCase().replace('!setid ', ''));
    debugChannel.send(`Aktiv spill id er nå ${currentChallengeId}`);
  } else if (messageIsEqual('!arkiv')) {
    getChallenges((challenges: Array<Challenge>) => {
      let message = '';
      challenges.forEach((challenge) => {
        if (challenge.result) {
          const resultOrOptions =
            challenge.result?.length > 0
              ? `Resultat: ${challenge.result}`
              : `Alternativer: ${challenge.options}`;
          message += `${challenge.name} (spill id: ${challenge.challengeId}) ${resultOrOptions}\n`;
        }
      });
      debugChannel.send(message, { code: true });
    });
  } else if (messageStartsWith('!spill')) {
    if (messageIsEqual('!spill')) {
      getChallenges((challenges: Array<Challenge>) => {
        let message = '';
        challenges.forEach((challenge) => {
          if (!challenge.result) {
            const resultOrOptions =
              challenge.result?.length > 0
                ? `Resultat: ${challenge.result}`
                : `Alternativer: ${challenge.options}`;
            message += `${challenge.name} (spill id: ${challenge.challengeId}) ${resultOrOptions}\n`;
          }
        });
        console.log('message', message);
        if (message) {
          debugChannel.send(message, { code: true });
        } else {
          debugChannel.send('Ingen aktive spill', { code: true });
        }
      });
    } else {
      if (msg.content.indexOf('(') === -1 || msg.content.indexOf(')') === -1) {
        debugChannel.send(
          'Ugyldig syntax: !spill navn på spill (valg alternativer i parantes) ligaId <- ikke obligatorisk'
        );
      } else {
        const line = msg.content.replace('!spill ', '');
        const split = line.split('(');
        const name = split[0].trim();
        const optionsAndLeagueId = split[1].split(')');
        const options = optionsAndLeagueId[0];
        const leagueId = optionsAndLeagueId[1]?.trim();
        if (options === 'ja/nei') {
          addChallengeAndToLeagueIfProvided(name, 'ja nei', leagueId, debugChannel);
        } else if (options === 'alle') {
          const allPlayers =
            'Fjoggs nwbi FN Vimbs Ulfos dun Torp iLLegaL_taXi Nuppe biten gody Molbs Juell';
          addChallengeAndToLeagueIfProvided(name, allPlayers, leagueId, debugChannel);
        } else {
          addChallengeAndToLeagueIfProvided(name, options, leagueId, debugChannel);
        }
      }
    }
  } else if (messageStartsWith('!-spill')) {
    if (messageIsEqual('!-spill')) {
      debugChannel.send('Syntax: !-spill "spillId" (funker kun forn onkel fjoggs)');
    } else {
      if (msg.author.username === 'Fjoggs') {
        const spillId = Number(msg.content.replace('!-spill ', ''));
        deleteChallenge(spillId, (message) => {
          debugChannel.send(message);
        });
      }
    }
  } else if (messageStartsWith('!+valg')) {
    const split = msg.content.replace('!+valg ', '').split(' ');
    const challengeId = Number(split.shift());
    const option = split.join(' ');
    getChallenge(challengeId, (challenge: Challenge) => {
      if (challenge) {
        let options = challenge.options + ` ${option}`;
        updateChallenge(challengeId, options, () => {
          debugChannel.send(`La til ${option} for spill med id ${challengeId}`);
        });
      } else {
        debugChannel.send('Ittno spell å legge til valg for');
      }
    });
  } else if (messageStartsWith('!fasit')) {
    if (messageIsEqual('!fasit')) {
      debugChannel.send('Syntax: !fasit spillId resultat');
    } else {
      const line = msg.content.replace('!fasit ', '').trim();
      const split = line.split(' ');
      let challengeId;
      if (isNaN(Number(split[0]))) {
        if (currentChallengeId) {
          //fast track bet
          challengeId = currentChallengeId;
        } else {
          debugChannel.send(
            'Ingen aktiv spill id er satt. Bruk !setid spillId for å enable shorthand donespill'
          );
        }
      } else {
        challengeId = Number(split.shift());
      }
      const result = split.join(' ');
      if (challengeId) {
        finishChallenge(challengeId, result, () => {
          let losers = [];
          let winners = [];
          getWinnersInLeague(
            challengeId,
            (rows: Array<BetJoinedChallengesJoinedLeagueChallenges>) => {
              if (rows.length > 0) {
                rows.forEach((row) => {
                  if (row.bet.toLowerCase() === row.result.toLowerCase()) {
                    winners.push(playersIdsToName[row.playerId]);
                    changePlayerTotalRep(row.playerId);
                    changeLeagueRep(row.playerId, row.leagueId);
                  } else {
                    losers.push(playersIdsToName[row.playerId]);
                  }
                });
                debugChannel.send(
                  `+rep: ${winners.length > 0 ? `**${winners}**` : 'Assa hallo'}. 0 rep: ${
                    losers.length > 0 ? `**${losers}**` : 'Ingen losers pog'
                  }`
                );
              } else {
                getWinners(challengeId, (rows: Array<BetJoinedChallenges>) => {
                  rows.forEach((row) => {
                    if (row.bet.toLowerCase() === row.result.toLowerCase()) {
                      winners.push(playersIdsToName[row.playerId]);
                      changePlayerTotalRep(row.playerId);
                    } else {
                      losers.push(playersIdsToName[row.playerId]);
                    }
                  });
                  debugChannel.send(
                    `+rep: ${winners.length > 0 ? `**${winners}**` : 'Assa hallo'}. 0 rep: ${
                      losers.length > 0 ? `**${losers}**` : 'Ingen losers pog'
                    }`
                  );
                });
              }
            }
          );
        });
      }
    }
  } else if (messageStartsWith('!bet')) {
    if (messageIsEqual('!bet')) {
      debugChannel.send('Syntax: !bet spillId din bet her');
    } else if (messageIsEqual('!bets')) {
      getBets((betJoinedChallenges: Array<BetJoinedChallenges>) => {
        let challengeId;
        let message = '';
        betJoinedChallenges.forEach((betJoinedChallenge) => {
          if (!betJoinedChallenge.result) {
            if (betJoinedChallenge.challengeId !== challengeId) {
              message += `\n${betJoinedChallenge.name} (spill id: ${betJoinedChallenge.challengeId})\n------\n`;
              challengeId = betJoinedChallenge.challengeId;
            }
            message += `${playersIdsToName[betJoinedChallenge.playerId]}: ${
              betJoinedChallenge.bet
            }\n`;
          }
        });
        if (message) {
          debugChannel.send(message, { code: true });
        } else {
          debugChannel.send('Ingen bets');
        }
      });
    } else {
      const line = msg.content.replace('!bet ', '').trim();
      const split = line.split(' ');
      let challengeId: number;
      if (isNaN(Number(split[0]))) {
        if (currentChallengeId) {
          //fast track bet
          challengeId = currentChallengeId;
        } else {
          debugChannel.send(
            'Ingen aktiv spill id er satt. Bruk !setid spillId for å enable shorthand bets'
          );
        }
      } else {
        challengeId = Number(split.shift());
      }
      if (line.includes('jesus take the wheel')) {
        getChallenge(challengeId, (challenge: Challenge) => {
          if (challenge.result?.length > 0) {
            debugChannel.send('Den konkurransen er allerede ferdig');
          } else {
            const options = challenge.options.split(' ');
            const magicNumber = Math.floor(Math.random() * options.length);
            const bet = options[magicNumber];
            addBet(challengeId, nameToPlayerIds[msg.author.username], bet);
            debugChannel.send(
              `Botjævlan betta **${bet}** for ${msg.author.username} på spill nummer ${challengeId}`
            );
          }
        });
      } else {
        const bet = split.join(' ');
        if (bet.length === 0) {
          debugChannel.send('Tomt bet på spill med id: ', challengeId);
        } else {
          if (challengeId) {
            getChallenge(challengeId, (challenge: Challenge) => {
              if (challenge) {
                if (challenge.result?.length > 0) {
                  debugChannel.send('Den konkurransen er allerede ferdig');
                } else {
                  if (challenge.options.toLowerCase().indexOf(bet.toLowerCase()) === -1) {
                    debugChannel.send(
                      `Ugyldig alternativ ${bet}. Gyldige alternativer er ${challenge.options} (ikke case sensitiv)`
                    );
                  } else {
                    console.log('author', msg.author.username);
                    addBet(
                      challengeId,
                      nameToPlayerIds[msg.author.username.toLowerCase()],
                      bet.toLowerCase()
                    );

                    msg.author.send(
                      `${msg.author.username} betta **${bet}** på spill nummer ${challengeId}`
                    );
                  }
                }
              } else {
                debugChannel.send('Fant ikke spill');
              }
            });
          }
        }
      }
    }
  } else if (messageStartsWith('!rep')) {
    if (messageIsEqual('!rep')) {
      // getStats((stats: Array<Stats>) => {
      //   let message = 'Kis | Score | +rep | -rep\n';
      //   stats.forEach((stat) => {
      //     message += `${stat.name} ${stat.rep} ${stat.}`
      //     channel.send(message, { code: true });
      //   });
      // })
      getPlayers((players: Array<Player>) => {
        let message = 'Total rep:\n';
        players.forEach((player) => {
          if (player.rep > 0) {
            message += `${playersIdsToName[player.playerId]}:  ${player.rep} rep\n`;
          }
        });
        debugChannel.send(message, { code: true });
      });
    } else {
      const leagueIdString = msg.content.toLowerCase().replace('!rep', '').trim();
      if (leagueIdString.length > 0) {
        const leagueId = Number(leagueIdString);
        getLeague(leagueId, (league: League) => {
          getLeaguePlayers(leagueId, (rows) => {
            debugChannel.send(
              `${league.name}:\n${rows.map(
                (playerLeagues) =>
                  `${playersIdsToName[playerLeagues.playerId]}:  ${playerLeagues.rep} rep\n`
              )}`.replace(/,/g, ''),
              { code: true }
            );
          });
        });
      }
    }
  } else if (messageStartsWith('!liga')) {
    if (messageIsEqual('!liga')) {
      getLeagues((leagues: Array<League_League_Challenges_Challenge>) => {
        let message = '';
        let leagueId;
        leagues.forEach((league) => {
          if (league.leagueId !== leagueId) {
            message += `\n${league.leagueName} (liga id: ${league.leagueId})\n------\n`;
            leagueId = league.leagueId;
          }
          message += `${league.challengeName} (spill id: ${league.challengeId})\n`;
        });
        if (message) {
          debugChannel.send(message, { code: true });
        } else {
          debugChannel.send('Ingen liga');
        }
      });
    } else if (messageStartsWith('!liga ')) {
      const name = msg.content.toLowerCase().replace('!liga', '').trim();
      if (name.length > 0) {
        addLeague(name, (leagueId) => {
          debugChannel.send(`Opprettet liga med navn **${name}** og id **${leagueId}**`);
        });
      } else {
        debugChannel.send('Syntax: !liga navn-på-liga');
      }
    }
  } else if (messageStartsWith('!-liga')) {
    if (messageIsEqual('!-liga')) {
      debugChannel.send('Syntax: !-liga ligaId (funker kun forn onkel fjoggs)');
    } else {
      if (msg.author.username === 'Fjoggs') {
        const leagueId = Number(msg.content.toLowerCase().replace('!-liga', '').trim());
        deleteLeague(leagueId, (message) => {
          debugChannel.send(message);
        });
      }
    }
  }
};

export const addChallengeAndToLeagueIfProvided = (
  name: string,
  options: string,
  leagueId: string,
  channel: any
) => {
  addChallenge(name, options, (challengeId: number) => {
    currentChallengeId = challengeId;
    if (leagueId) {
      addChallengeToLeague(challengeId, Number(leagueId), () => {
        channel.send(
          `Opprettet spill med navn "${name}" og alternativer "${options}" med id **${challengeId}** i liga med id **${leagueId}**`
        );
      });
    } else {
      channel.send(
        `Opprettet spill med navn "${name}" og alternativer "${options}" med id **${challengeId}**`
      );
    }
  });
};
