import { DatabaseSync } from 'node:sqlite';

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

const DB_PATH = './banterbot-database.db';

export const getWinners = (challengeId: number, callback: Function) => {
    const db = new DatabaseSync(DB_PATH);
    try {
        const rows = db
            .prepare(
                'SELECT playerId, bet, result from bets INNER JOIN challenges USING(challengeId) where challengeId = ?'
            )
            .all(challengeId) as BetJoinedChallenges[];
        callback(rows);
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};

export const getWinnersInLeague = (challengeId: number, callback: Function) => {
    const db = new DatabaseSync(DB_PATH);
    try {
        const rows = db
            .prepare(
                'SELECT playerId, bet, result, leagueId from bets INNER JOIN challenges USING(challengeId) INNER JOIN league_challenges USING (challengeId) where challengeId = ?'
            )
            .all(challengeId) as BetJoinedChallengesJoinedLeagueChallenges[];
        callback(rows);
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};

export const addBet = (challengeId: number, playerId: number, bet: string) => {
    const db = new DatabaseSync(DB_PATH);
    try {
        console.log(
            `Inserting bet for challengeid ${challengeId} and playerId ${playerId} with bet ${bet} into db`
        );
        db.prepare('INSERT OR REPLACE INTO bets (challengeId, playerId, bet) VALUES(?, ?, ?)').run(
            challengeId,
            playerId,
            bet
        );
        console.log(
            'Inserted bet with challengeid, playerid and bet:  ',
            challengeId,
            playerId,
            bet
        );
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};

export const getBets = (callback: Function) => {
    const db = new DatabaseSync(DB_PATH);
    try {
        const rows = db
            .prepare('SELECT * FROM bets INNER JOIN challenges USING(challengeId) ORDER BY challengeId')
            .all() as BetJoinedChallenges[];
        callback(rows);
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};
