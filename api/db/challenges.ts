import { sqlite3 } from "sqlite3";

const sqlite3: sqlite3 = require("sqlite3").verbose();

export const addChallenge = (name: string, options: string, callback: Function) => {
    let db = new sqlite3.Database("./banterbot-database.db");
    db.serialize(() => {
        console.log(`Inserting ${name} into db`);
        db.run("INSERT INTO challenges (name, options) VALUES(?, ?)", [name, options], function (error) {
            if (error) {
                console.log("Something went wrong: ", error);
                return undefined;
            } else {
                console.log("Inserted challenge with name and id:  ", name, this.lastID);
                callback(this.lastID);
                return this.lastID;
            }
        });
    });
    db.close();
}

export const addBet = (challengeId: number, playerId: number, bet: string) => {
    let db = new sqlite3.Database("./banterbot-database.db");
    db.serialize(() => {
        console.log(`Inserting bet for challengeid ${challengeId} and playerId ${playerId} with bet ${bet} into db`);
        db.run("INSERT INTO bets (challengeId, playerId, bet) VALUES(?, ?, ?)", [challengeId, playerId, bet], (error) => {
            if (error) {
                console.log("Something went wrong: ", error);
            } else {
                console.log("Inserted bet with challengeid, playerid and bet:  ", challengeId, playerId, bet);
            }
        });
    });
    db.close();
}