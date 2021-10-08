import { sqlite3 } from 'sqlite3';

export interface BetJoinedChallenges {
    challengeId: number;
    playerId: number;
    bet: string;
    name: string;
    options: string;
    result: string;
}

export interface BetJoinedChallengesJoinedLeagueChallenges {
    challengeId: number;
    playerId: number;
    bet: string;
    name: string;
    options: string;
    result: string;
    leagueId: number;
}

const sqlite3: sqlite3 = require('sqlite3').verbose();

export const getWinners = (challengeId: number, callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.serialize(() => {
        db.all(
            'SELECT playerId, bet, result from bets INNER JOIN challenges USING(challengeId) where challengeId = ?',
            [challengeId],
            (error, rows: Array<BetJoinedChallenges>) => {
                if (error) {
                    console.log('Something went wrong: ', error);
                } else {
                    callback(rows);
                }
            }
        );
    });
    db.close();
};

export const getWinnersInLeague = (challengeId: number, callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.serialize(() => {
        db.all(
            'SELECT playerId, bet, result, leagueId from bets INNER JOIN challenges USING(challengeId) INNER JOIN league_challenges USING (challengeId) where challengeId = ?',
            [challengeId],
            (error, rows: Array<BetJoinedChallengesJoinedLeagueChallenges>) => {
                if (error) {
                    console.log('Something went wrong: ', error);
                } else {
                    callback(rows);
                }
            }
        );
    });
    db.close();
};

export const addBet = (challengeId: number, playerId: number, bet: string) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.serialize(() => {
        console.log(
            `Inserting bet for challengeid ${challengeId} and playerId ${playerId} with bet ${bet} into db`
        );
        db.run(
            'INSERT OR REPLACE INTO bets (challengeId, playerId, bet) VALUES(?, ?, ?)',
            [challengeId, playerId, bet],
            (error) => {
                if (error) {
                    console.log('Something went wrong: ', error);
                } else {
                    console.log(
                        'Inserted bet with challengeid, playerid and bet:  ',
                        challengeId,
                        playerId,
                        bet
                    );
                }
            }
        );
    });
    db.close();
};

export const getBets = (callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.serialize(() => {
        db.all(
            'SELECT * FROM bets INNER JOIN challenges USING(challengeId) ORDER BY challengeId',
            [],
            (error, rows: Array<BetJoinedChallenges>) => {
                if (error) {
                    console.log('Something went wrong: ', error);
                } else {
                    callback(rows);
                }
            }
        );
    });
    db.close();
};
