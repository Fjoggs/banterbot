import { DatabaseSync } from 'node:sqlite';

export interface League {
    leagueId: number;
    name: string;
}

export interface player_leagues {
    playerId: number;
    leagueId: number;
    rep: number;
}

export interface League_Challenges {
    leagueId: number;
    challengeId: number;
}

export interface League_League_Challenges_Challenge {
    leagueId: number;
    leagueName: string;
    challengeId: number;
    challengeName: string;
}

const DB_PATH = './banterbot-database.db';

export const changeLeagueRep = (playerId: number, leagueId: number) => {
    const db = new DatabaseSync(DB_PATH);
    console.log('changing rep for player', playerId);
    try {
        const result = db
            .prepare('UPDATE player_leagues SET rep=rep + 1 WHERE playerId = ? AND leagueId = ?')
            .run(playerId, leagueId);
        if (result.changes === 0) {
            insertNewPlayerLeague(playerId, leagueId);
        } else {
            console.log('Changed league rep for player:', playerId);
        }
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};

const insertNewPlayerLeague = (playerId: number, leagueId: number) => {
    const db = new DatabaseSync(DB_PATH);
    console.log('No rows affected. Inserting new entry');
    try {
        db.prepare('INSERT INTO player_leagues (playerId, leagueId, rep) VALUES(?, ?, ?)').run(
            playerId,
            leagueId,
            1
        );
        console.log(
            'Inserted into player_leagues with playerId, leagueId and 1 rep',
            playerId,
            leagueId
        );
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};

export const getLeaguePlayers = (leagueId: number, callback: Function) => {
    const db = new DatabaseSync(DB_PATH);
    try {
        const rows = db
            .prepare('SELECT * from player_leagues WHERE leagueId = ?')
            .all(leagueId) as player_leagues[];
        callback(rows);
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};

export const getLeagues = (callback: Function) => {
    const db = new DatabaseSync(DB_PATH);
    try {
        const rows = db
            .prepare(
                'SELECT leagueId, challengeId, leagues.name as leagueName, challenges.name as challengeName from leagues INNER JOIN league_challenges USING(leagueId) INNER JOIN challenges USING(challengeId) ORDER BY leagueId'
            )
            .all() as League_League_Challenges_Challenge[];
        callback(rows);
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};

export const getLeague = (leagueId: number, callback: Function) => {
    const db = new DatabaseSync(DB_PATH);
    try {
        const league = db.prepare('SELECT * from leagues WHERE leagueId = ?').get(leagueId) as
            | League
            | undefined;
        callback(league);
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};

export const getLeagueIdForChallenge = (challengeId: number, callback: Function) => {
    const db = new DatabaseSync(DB_PATH);
    try {
        const row = db.prepare('SELECT * from league_challenges').get() as
            | League_Challenges
            | undefined;
        callback(row?.leagueId);
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};

export const addLeague = (name: string, callback: Function) => {
    const db = new DatabaseSync(DB_PATH);
    try {
        console.log(`Inserting league with name ${name}`);
        const result = db.prepare('INSERT INTO leagues (name) VALUES(?)').run(name);
        console.log('Inserted league with name:', name);
        callback(result.lastInsertRowid);
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};

export const deleteLeague = (leagueId: number, callback: Function) => {
    const db = new DatabaseSync(DB_PATH);
    try {
        console.log(`Deleting league with id ${leagueId}`);
        const deletedLeagues = db.prepare('DELETE FROM leagues WHERE leagueId = ?').run(leagueId);
        console.log('Deleted league with id and changes:  ', leagueId, deletedLeagues.changes);
        callback(`Sletta liga med id ${leagueId} (endringer: ${deletedLeagues.changes})`);

        const deletedLeagueChallenges = db
            .prepare('DELETE FROM league_challenges WHERE leagueId = ?')
            .run(leagueId);
        console.log(
            'Deleted league_challenges with id and changes:  ',
            leagueId,
            deletedLeagueChallenges.changes
        );
        callback(
            `Sletta entries i liga+konkurranser tabellen med leagueId ${leagueId} (endringer: ${deletedLeagueChallenges.changes})`
        );
    } catch (error) {
        console.log('Something went wrong: ', error);
    } finally {
        db.close();
    }
};
