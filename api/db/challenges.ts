import { DatabaseSync } from 'node:sqlite';

export interface Challenge {
    challengeId: number;
    name: string;
    options: string;
    result: string;
}

const DB_PATH = './banterbot-database.db';

export const getChallenges = (callback: Function) => {
    const db = new DatabaseSync(DB_PATH);
    try {
        const rows = db.prepare('SELECT * from challenges').all() as Challenge[];
        callback(rows);
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};

export const getChallenge = (challengeId: number, callback: Function) => {
    const db = new DatabaseSync(DB_PATH);
    try {
        const row = db.prepare('SELECT * from challenges WHERE challengeId = ?').get(challengeId) as
            | Challenge
            | undefined;
        callback(row);
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};

export const updateChallenge = (challengeId: number, options: string, callback: Function) => {
    const db = new DatabaseSync(DB_PATH);
    try {
        db.prepare('UPDATE Challenges set options = ? WHERE challengeId = ?').run(
            options,
            challengeId
        );
        console.log('Updated challenge', challengeId, options);
        callback();
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};

export const addChallenge = (name: string, options: string, callback: Function) => {
    const db = new DatabaseSync(DB_PATH);
    try {
        console.log(`Inserting ${name} into db`);
        const result = db.prepare('INSERT INTO challenges (name, options) VALUES(?, ?)').run(
            name,
            options
        );
        console.log('Inserted challenge with name and id:  ', name, result.lastInsertRowid);
        callback(result.lastInsertRowid);
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};

export const addChallengeToLeague = (challengeId: number, leagueId: number, callback: Function) => {
    const db = new DatabaseSync(DB_PATH);
    try {
        db.prepare('INSERT INTO league_challenges (leagueId, challengeId) VALUES(?, ?)').run(
            leagueId,
            challengeId
        );
        console.log(
            'Inserted challenge into league_challenges with leagueId and challengeId:  ',
            leagueId,
            challengeId
        );
        callback();
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};

export const deleteChallenge = (challengeId: number, callback: Function) => {
    const db = new DatabaseSync(DB_PATH);
    try {
        console.log(`Deleting challenge with id ${challengeId}`);
        const deletedChallenges = db
            .prepare('DELETE FROM challenges WHERE challengeId = ?')
            .run(challengeId);
        console.log(
            'Deleted challenge with id and changes:  ',
            challengeId,
            deletedChallenges.changes
        );
        callback(`Sletta spill med id ${challengeId} (endringer: ${deletedChallenges.changes})`);

        const deletedBets = db.prepare('DELETE FROM bets WHERE challengeId = ?').run(challengeId);
        console.log('Deleted bets with id and changes:  ', challengeId, deletedBets.changes);
        callback(`Sletta bets med challengeId ${challengeId} (endringer: ${deletedBets.changes})`);
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};

export const finishChallenge = (challengeId: number, result: string, callback: Function) => {
    const db = new DatabaseSync(DB_PATH);
    try {
        console.log(`Updating challenge with id ${challengeId} with result ${result}`);
        const dbResult = db
            .prepare('UPDATE challenges SET result = ? where challengeId = ?')
            .run(result, challengeId);
        console.log('Updated challenge with id and result:  ', challengeId, result);
        callback(dbResult.changes);
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};
