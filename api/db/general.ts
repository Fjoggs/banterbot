import { sqlite3 } from 'sqlite3';

export interface RandomEntry {
    randomId: number;
    jamesCounter: number;
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
