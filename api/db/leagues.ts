import { sqlite3 } from 'sqlite3';

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

const sqlite3: sqlite3 = require('sqlite3').verbose();

export const changeLeagueRep = (playerId: number, leagueId: number) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    console.log('changing rep for player', playerId);
    db.serialize(() => {
        db.run(
            'UPDATE player_leagues SET rep=rep + 1 WHERE playerId = ? AND leagueId = ?',
            [playerId, leagueId],
            function (error) {
                if (error) {
                    console.log('Something went wrong: ', error);
                } else {
                    console.log('Changed league rep for player:', playerId);
                    if (this.changes === 0) {
                        insertNewPlayerLeague(playerId, leagueId);
                    }
                }
            }
        );
    });
    db.close();
};

const insertNewPlayerLeague = (playerId: number, leagueId: number) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    console.log('No rows affected. Inserting new entry');
    db.run(
        'INSERT INTO player_leagues (playerId, leagueId, rep) VALUES(?, ?, ?)',
        [playerId, leagueId, 1],
        function (error) {
            if (error) {
                console.log('Something went wrong: ', error);
            } else {
                console.log(
                    'Inserted into player_leagues with playerId, leagueId and 1 rep',
                    playerId,
                    leagueId
                );
            }
        }
    );
    db.close();
};

export const getLeaguePlayers = (leagueId: number, callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.serialize(() => {
        db.all(
            'SELECT * from player_leagues WHERE leagueId = ?',
            [leagueId],
            (error, rows: Array<player_leagues>) => {
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

export const getLeagues = (callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.serialize(() => {
        db.all(
            'SELECT leagueId, challengeId, leagues.name as leagueName, challenges.name as challengeName from leagues INNER JOIN league_challenges USING(leagueId) INNER JOIN challenges USING(challengeId) ORDER BY leagueId',
            [],
            (error, rows: Array<League_League_Challenges_Challenge>) => {
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

export const getLeague = (leagueId: number, callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.serialize(() => {
        db.get('SELECT * from leagues WHERE leagueId = ?', [leagueId], (error, league: League) => {
            if (error) {
                console.log('Something went wrong: ', error);
            } else {
                callback(league);
            }
        });
    });
    db.close();
};

export const getLeagueIdForChallenge = (challengeId: number, callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.serialize(() => {
        db.get('SELECT * from league_challenges', [], (error, row: League_Challenges) => {
            if (error) {
                console.log('Something went wrong: ', error);
            } else {
                callback(row?.leagueId);
            }
        });
    });
    db.close();
};

export const addLeague = (name: string, callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.serialize(() => {
        console.log(`Inserting league with name ${name}`);
        db.run('INSERT INTO leagues (name) VALUES(?)', [name], function (error) {
            if (error) {
                console.log('Something went wrong: ', error);
            } else {
                console.log('Inserted league with name:', name);
                callback(this.lastID);
            }
        });
    });
    db.close();
};

export const deleteLeague = (leagueId: number, callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.serialize(() => {
        console.log(`Deleting league with id ${leagueId}`);
        db.run('DELETE FROM leagues WHERE leagueId = ?', [leagueId], function (error) {
            if (error) {
                console.log('Something went wrong: ', error);
            } else {
                console.log('Deleted league with id and changes:  ', leagueId, this.changes);
                callback(`Sletta liga med id ${leagueId} (endringer: ${this.changes})`);
            }
        });
        db.run('DELETE FROM league_challenges WHERE leagueId = ?', [leagueId], function (error) {
            if (error) {
                console.log('Something went wrong: ', error);
            } else {
                console.log(
                    'Deleted league_challenges with id and changes:  ',
                    leagueId,
                    this.changes
                );
                callback(
                    `Sletta entries i liga+konkurranser tabellen med leagueId ${leagueId} (endringer: ${this.changes})`
                );
            }
        });
    });
    db.close();
};
