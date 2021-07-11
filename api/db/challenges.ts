import { sqlite3 } from 'sqlite3';

export interface Challenge {
    challengeId: number;
    name: string;
    options: string;
    result: string;
}

const sqlite3: sqlite3 = require('sqlite3').verbose();

export const getChallenges = (callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.serialize(() => {
        db.all('SELECT * from challenges', [], (error, rows: Array<Challenge>) => {
            if (error) {
                console.log('Something went wrong: ', error);
            } else {
                callback(rows);
            }
        });
    });
    db.close();
};

export const getChallenge = (challengeId: number, callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.serialize(() => {
        db.get(
            'SELECT * from challenges WHERE challengeId = ?',
            [challengeId],
            (error, row: Challenge) => {
                if (error) {
                    console.log('Something went wrong: ', error);
                } else {
                    callback(row);
                }
            }
        );
    });
    db.close();
};

export const addChallenge = (name: string, options: string, callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    let challengeId;
    db.serialize(() => {
        console.log(`Inserting ${name} into db`);
        db.run(
            'INSERT INTO challenges (name, options) VALUES(?, ?)',
            [name, options],
            function (error) {
                if (error) {
                    console.log('Something went wrong: ', error);
                } else {
                    console.log('Inserted challenge with name and id:  ', name, this.lastID);
                    callback(this.lastID);
                    challengeId = this.lastID;
                }
            }
        );
    });
    db.close();
};

export const addChallengeToLeague = (challengeId: number, leagueId: number, callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.run(
        'INSERT INTO league_challenges (leagueId, challengeId) VALUES(?, ?)',
        [leagueId, challengeId],
        function (error) {
            if (error) {
                console.log('Something went wrong: ', error);
            } else {
                console.log(
                    'Inserted challenge into league_challenges with leagueId and challengeId:  ',
                    leagueId,
                    challengeId
                );
                callback();
            }
        }
    );
    db.close();
};

export const deleteChallenge = (challengeId: number, callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.serialize(() => {
        console.log(`Deleting challenge with id ${challengeId}`);
        db.run('DELETE FROM challenges WHERE challengeId = ?', [challengeId], function (error) {
            if (error) {
                console.log('Something went wrong: ', error);
            } else {
                console.log('Deleted challenge with id and changes:  ', challengeId, this.changes);
                callback(`Sletta spill med id ${challengeId} (endringer: ${this.changes})`);
            }
        });
        db.run('DELETE FROM bets WHERE challengeId = ?', [challengeId], function (error) {
            if (error) {
                console.log('Something went wrong: ', error);
            } else {
                console.log('Deleted bets with id and changes:  ', challengeId, this.changes);
                callback(`Sletta bets med challengeId ${challengeId} (endringer: ${this.changes})`);
            }
        });
    });
    db.close();
};

export const finishChallenge = (challengeId: number, result: string, callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.serialize(() => {
        console.log(`Updating challenge with id ${challengeId} with result ${result}`);
        db.run(
            'UPDATE challenges SET result = ? where challengeId = ?',
            [result, challengeId],
            function (error) {
                if (error) {
                    console.log('Something went wrong: ', error);
                } else {
                    console.log('Updated challenge with id and result:  ', challengeId, result);
                    callback(this.changes);
                }
            }
        );
    });
    db.close();
};
