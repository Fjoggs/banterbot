import { sqlite3 } from 'sqlite3';

export interface RandomEntry {
    randomId: number;
    jamesCounter: number;
    lukakuCounter: number;
}

export interface Stats {
    name: string;
    usage: number;
}

const sqlite3: sqlite3 = require('sqlite3').verbose();

export const increaseJamesCounter = (callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    console.log('increment james counter by 1');
    db.serialize(() => {
        db.run('UPDATE random SET jamesCounter = jamesCounter + 1 WHERE randomId = 1', (error) => {
            if (error) {
                console.log('Something went wrong: ', error);
            } else {
                console.log('Increased jamescounter');
                callback();
            }
        });
    });
    db.close();
};

export const increaseLukakuCounter = (callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    console.log('increment lukaku counter by 1');
    db.serialize(() => {
        db.run(
            'UPDATE random SET lukakuCounter = lukakuCounter + 1 WHERE randomId = 1',
            (error) => {
                if (error) {
                    console.log('Something went wrong: ', error);
                } else {
                    console.log('Increased lukakuCounter');
                    callback();
                }
            }
        );
    });
    db.close();
};

export const getRandom = (callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.serialize(() => {
        db.get('SELECT * FROM random WHERE randomId = 1', [], (error, row: RandomEntry) => {
            if (error) {
                console.log('Something went wrong: ', error);
            } else {
                callback(row);
            }
        });
    });
    db.close();
};

export const insertOrUpdateUsage = (name: string) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.serialize(() => {
        db.get(
            'INSERT INTO emoji (name, usage) VALUES (?, 1) ON CONFLICT (name) DO UPDATE SET usage = usage + 1',
            [name],
            (error, row: Stats) => {
                if (error) {
                    console.log('Something went wrong: ', error);
                } else {
                    console.log(`Updated row for ${name}`, row);
                }
            }
        );
    });
    db.close();
};

export const getStatsAll = (callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.serialize(() => {
        db.all('SELECT * FROM emoji ORDER BY usage DESC', [], (error, row: RandomEntry) => {
            if (error) {
                console.log('Something went wrong: ', error);
            } else {
                callback(row);
            }
        });
    });
    db.close();
};

export const getStatsTop5 = (callback: Function) => {
    let db = new sqlite3.Database('./banterbot-database.db');
    db.serialize(() => {
        db.all('SELECT * FROM emoji ORDER BY usage DESC LIMIT 5', [], (error, row: RandomEntry) => {
            if (error) {
                console.log('Something went wrong: ', error);
            } else {
                callback(row);
            }
        });
    });
    db.close();
};
