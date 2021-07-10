import { sqlite3 } from "sqlite3";

const sqlite3: sqlite3 = require("sqlite3").verbose();

export const getChallenges = (callback: Function) => {
  let db = new sqlite3.Database("./banterbot-database.db");
  db.serialize(() => {
    db.all("SELECT * from challenges", [], (error, rows) => {
      if (error) {
        console.log("Something went wrong: ", error);
      } else {
        callback(rows);
      }
    });
  });
  db.close();
};

export const addChallenge = (
  name: string,
  options: string,
  callback: Function
) => {
  let db = new sqlite3.Database("./banterbot-database.db");
  db.serialize(() => {
    console.log(`Inserting ${name} into db`);
    db.run(
      "INSERT INTO challenges (name, options) VALUES(?, ?)",
      [name, options],
      function (error) {
        if (error) {
          console.log("Something went wrong: ", error);
          return undefined;
        } else {
          console.log(
            "Inserted challenge with name and id:  ",
            name,
            this.lastID
          );
          callback(this.lastID);
          return this.lastID;
        }
      }
    );
  });
  db.close();
};

export const deleteChallenge = (challengeId: number, callback: Function) => {
  let db = new sqlite3.Database("./banterbot-database.db");
  db.serialize(() => {
    console.log(`Deleting challenge with id ${challengeId}`);
    db.run(
      "DELETE FROM challenges WHERE challengeId = ?",
      [challengeId],
      function (error) {
        if (error) {
          console.log("Something went wrong: ", error);
        } else {
          console.log(
            "Deleted challenge with id and changes:  ",
            challengeId,
            this.changes
          );
          callback(
            `Sletta challenge med id ${challengeId} (endinger: ${this.changes})`
          );
        }
      }
    );
    db.run(
      "DELETE FROM bets WHERE challengeId = ?",
      [challengeId],
      function (error) {
        if (error) {
          console.log("Something went wrong: ", error);
        } else {
          console.log(
            "Deleted bets with id and changes:  ",
            challengeId,
            this.changes
          );
          callback(
            `Sletta bets med challengeId ${challengeId} (endringer: ${this.changes})`
          );
        }
      }
    );
  });
  db.close();
};

export const finishChallenge = (
  challengeId: number,
  result: string,
  callback: Function
) => {
  let db = new sqlite3.Database("./banterbot-database.db");
  db.serialize(() => {
    console.log(
      `Updating challenge with id ${challengeId} with result ${result}`
    );
    db.run(
      "UPDATE challenges SET result = ? where challengeId = ?",
      [result, challengeId],
      function (error) {
        if (error) {
          console.log("Something went wrong: ", error);
        } else {
          console.log(
            "Updated challenge with id and result:  ",
            challengeId,
            result
          );
          callback(this.changes);
        }
      }
    );
  });
  db.close();
};

export const getWinners = (challengeId: number, callback: Function) => {
  let db = new sqlite3.Database("./banterbot-database.db");
  let winners = [];
  let losers = [];
  db.serialize(() => {
    db.all(
      "SELECT playerId, bet, result from bets INNER JOIN challenges USING(challengeId) where challengeId = ?",
      [challengeId],
      (error, rows) => {
        if (error) {
          console.log("Something went wrong: ", error);
        } else {
          callback(rows);
        }
      }
    );
  });
  console.log("winners", winners);
  console.log("losers", losers);
  db.close();
};

export const addBet = (challengeId: number, playerId: number, bet: string) => {
  let db = new sqlite3.Database("./banterbot-database.db");
  db.serialize(() => {
    console.log(
      `Inserting bet for challengeid ${challengeId} and playerId ${playerId} with bet ${bet} into db`
    );
    db.run(
      "INSERT OR REPLACE INTO bets (challengeId, playerId, bet) VALUES(?, ?, ?)",
      [challengeId, playerId, bet],
      (error) => {
        if (error) {
          console.log("Something went wrong: ", error);
        } else {
          console.log(
            "Inserted bet with challengeid, playerid and bet:  ",
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
  let db = new sqlite3.Database("./banterbot-database.db");
  db.serialize(() => {
    db.all("SELECT * from bets", [], (error, rows) => {
      if (error) {
        console.log("Something went wrong: ", error);
      } else {
        callback(rows);
      }
    });
  });
  db.close();
};
