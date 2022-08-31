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
import { changePlayerTotalRep, getPlayers, Player } from '../api/db/players';

let currentChallengeId;

const nameToPlayerIds = {
    Fjoggs: 1,
    nwbi: 2,
    FN: 3,
    Vimbs: 4,
    Ulfos: 5,
    dun: 6,
    Torp: 7,
    iLLegaL_taXi: 8,
    Nuppe: 9,
    biten: 10,
    gody: 11,
    Molbs: 12,
    Juell: 13,
};

const playersIdsToName = {
    1: 'Fjoggs',
    2: 'nwbi',
    3: 'FN',
    4: 'Vimbs',
    5: 'Ulfos',
    6: 'dun',
    7: 'Torp',
    8: 'iLLegaL_taXi',
    9: 'Nuppe',
    10: 'biten',
    11: 'gody',
    12: 'Molbs',
    13: 'Juell',
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
        channel.send(embed);
    } else if (messageStartsWith('!skynet')) {
        const challengeId = Number(msg.content.toLowerCase().replace('!skynet ', ''));
        getChallenge(challengeId, (challenge: Challenge) => {
            const options = challenge.options.split(' ');
            const magicNumber = Math.floor(Math.random() * options.length);
            channel.send(`Ez seier for ${options[magicNumber]}`);
        });
    } else if (messageStartsWith('!setid')) {
        currentChallengeId = Number(msg.content.toLowerCase().replace('!setid ', ''));
        channel.send(`Aktiv spill id er nå ${currentChallengeId}`);
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
            channel.send(message, { code: true });
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
                channel.send(message, { code: true });
            });
        } else {
            if (msg.content.indexOf('(') === -1 || msg.content.indexOf(')') === -1) {
                channel.send(
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
                    addChallengeAndToLeagueIfProvided(name, 'ja nei', leagueId, channel);
                } else if (options === 'alle') {
                    const allPlayers =
                        'Fjoggs nwbi FN Vimbs Ulfos dun Torp iLLegaL_taXi Nuppe biten gody Molbs Juell';
                    addChallengeAndToLeagueIfProvided(name, allPlayers, leagueId, channel);
                } else {
                    addChallengeAndToLeagueIfProvided(name, options, leagueId, channel);
                }
            }
        }
    } else if (messageStartsWith('!-spill')) {
        if (messageIsEqual('!-spill')) {
            channel.send('Syntax: !-spill "spillId" (funker kun forn onkel fjoggs)');
        } else {
            if (msg.author.username === 'Fjoggs') {
                const spillId = Number(msg.content.replace('!-spill ', ''));
                deleteChallenge(spillId, (message) => {
                    channel.send(message);
                });
            }
        }
    } else if (messageStartsWith('!+valg')) {
        const split = msg.content.replace('!+valg ', '').split(' ');
        const challengeId = Number(split.shift());
        const option = split.join(' ');
        getChallenge(challengeId, (challenge: Challenge) => {
            let options = challenge.options + ` ${option}`;
            updateChallenge(challengeId, options, () => {
                channel.send(`La til ${option} for spill med id ${challengeId}`);
            });
        });
    } else if (messageStartsWith('!fasit')) {
        if (messageIsEqual('!fasit')) {
            channel.send('Syntax: !fasit spillId resultat');
        } else {
            const line = msg.content.replace('!fasit ', '').trim();
            const split = line.split(' ');
            let challengeId;
            if (isNaN(Number(split[0]))) {
                if (currentChallengeId) {
                    //fast track bet
                    challengeId = currentChallengeId;
                } else {
                    channel.send(
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
                                channel.send(
                                    `+rep: ${
                                        winners.length > 0 ? `**${winners}**` : 'Assa hallo'
                                    }. 0 rep: ${
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
                                    channel.send(
                                        `+rep: ${
                                            winners.length > 0 ? `**${winners}**` : 'Assa hallo'
                                        }. 0 rep: ${
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
            channel.send('Syntax: !bet spillId din bet her');
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
                channel.send(message, { code: true });
            });
        } else {
            const line = msg.content.replace('!bet ', '').trim();
            const split = line.split(' ');
            let challengeId;
            if (isNaN(Number(split[0]))) {
                if (currentChallengeId) {
                    //fast track bet
                    challengeId = currentChallengeId;
                } else {
                    channel.send(
                        'Ingen aktiv spill id er satt. Bruk !setid spillId for å enable shorthand bets'
                    );
                }
            } else {
                challengeId = Number(split.shift());
            }
            if (line.includes('jesus take the wheel')) {
                getChallenge(challengeId, (challenge: Challenge) => {
                    if (challenge.result?.length > 0) {
                        channel.send('Den konkurransen er allerede ferdig');
                    } else {
                        const options = challenge.options.split(' ');
                        const magicNumber = Math.floor(Math.random() * options.length);
                        const bet = options[magicNumber];
                        addBet(challengeId, nameToPlayerIds[msg.author.username], bet);
                        channel.send(
                            `Botjævlan betta **${bet}** for ${msg.author.username} på spill nummer ${challengeId}`
                        );
                    }
                });
            } else {
                const bet = split.join(' ');
                if (bet.length === 0) {
                    channel.send('Tomt bet på spill med id: ', challengeId);
                } else {
                    if (challengeId) {
                        getChallenge(challengeId, (challenge: Challenge) => {
                            if (challenge.result?.length > 0) {
                                channel.send('Den konkurransen er allerede ferdig');
                            } else {
                                if (
                                    challenge.options.toLowerCase().indexOf(bet.toLowerCase()) ===
                                    -1
                                ) {
                                    channel.send(
                                        `Ugyldig alternativ ${bet}. Gyldige alternativer er ${challenge.options} (ikke case sensitiv)`
                                    );
                                } else {
                                    addBet(
                                        challengeId,
                                        nameToPlayerIds[msg.author.username],
                                        bet.toLowerCase()
                                    );

                                    msg.author.send(
                                        `${msg.author.username} betta **${bet}** på spill nummer ${challengeId}`
                                    );
                                }
                            }
                        });
                    }
                }
            }
        }
    } else if (messageStartsWith('!rep')) {
        if (messageIsEqual('!rep')) {
            getPlayers((players: Array<Player>) => {
                let message = 'Total rep:\n';
                players.forEach((player) => {
                    if (player.rep > 0) {
                        message += `${playersIdsToName[player.playerId]}:  ${player.rep} rep\n`;
                    }
                });
                channel.send(message, { code: true });
            });
        } else {
            const leagueIdString = msg.content.toLowerCase().replace('!rep', '').trim();
            if (leagueIdString.length > 0) {
                const leagueId = Number(leagueIdString);
                getLeague(leagueId, (league: League) => {
                    getLeaguePlayers(leagueId, (rows) => {
                        channel.send(
                            `${league.name}:\n${rows.map(
                                (playerLeagues) =>
                                    `${playersIdsToName[playerLeagues.playerId]}:  ${
                                        playerLeagues.rep
                                    } rep\n`
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
                channel.send(message, { code: true });
            });
        } else if (messageStartsWith('!liga ')) {
            const name = msg.content.toLowerCase().replace('!liga', '').trim();
            if (name.length > 0) {
                addLeague(name, (leagueId) => {
                    channel.send(`Opprettet liga med navn **${name}** og id **${leagueId}**`);
                });
            } else {
                channel.send('Syntax: !liga navn-på-liga');
            }
        }
    } else if (messageStartsWith('!-liga')) {
        if (messageIsEqual('!-liga')) {
            channel.send('Syntax: !-liga ligaId (funker kun forn onkel fjoggs)');
        } else {
            if (msg.author.username === 'Fjoggs') {
                const leagueId = Number(msg.content.toLowerCase().replace('!-liga', '').trim());
                deleteLeague(leagueId, (message) => {
                    channel.send(message);
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
