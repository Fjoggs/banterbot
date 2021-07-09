import { sqlite3 } from "sqlite3";

const sqlite3: sqlite3 = require("sqlite3").verbose();

interface Player {
  playerId: number;
  name: string;
}

interface Challenge {
  challengeId: number;
  name: string;
  scores: Array<Score>;
}

interface Score {
  playerId: number;
  challengeId: number;
  score: number;
  name: string;
}

let challenges: Challenge[] = [];
let scores: Score[] = [];

export default class BanterBotDB {
  constructor() {}

  addChallenge(name: string): void {
    let db = new sqlite3.Database("./banterbot-database.db");
    db.serialize(() => {
      db.run("INSERT INTO Challenge (name) VALUES(?)", [name], (error) => {
        if (error) {
          console.log("Something went wrong: ", error);
        } else {
          console.log("Inserted challenge with name and id:  ", name);
        }
      });
    });
    db.close();
  }

  getChallenge(name: string) {
    let db = new sqlite3.Database("./banterbot-database.db");
    db.serialize(() => {
      db.get(
        "SELECT * from Challenge INNER JOIN Score USING(challengeId) where name = ?",
        [name],
        (error, row) => {
          if (error) {
            console.log("Something went wrong: ", error);
            return undefined;
          } else {
            console.log("row", row);
            return row;
          }
        }
      );
    });
    db.close();
  }

  async getChallenges() {
    let db = new sqlite3.Database("./banterbot-database.db");
    db.serialize(() => {
      db.all("SELECT * from Challenge", [], (error, rows) => {
        if (error) {
          console.log("Something went wrong: ", error);
          return undefined;
        } else {
          console.log("rows", rows);
          challenges = rows;
        }
      });
    });
    db.close();
  }

  addScore(challengeId: number, playerId: number, score: number): void {
    let db = new sqlite3.Database("./banterbot-database.db");
    db.serialize(() => {
      db.run(
        "INSERT INTO Score (challengeId, playerId, score) VALUES(?, ? , ?)",
        [challengeId, playerId, score],
        (error) => {
          if (error) {
            console.log("Something went wrong: ", error);
          } else {
            console.log(
              "Inserted score with challengeId, playerId and score:  ",
              challengeId,
              playerId,
              score
            );
          }
        }
      );
    });
    db.close();
  }

  getScore(challengeId: number, playerId: number) {
    let db = new sqlite3.Database("./banterbot-database.db");
    db.serialize(() => {
      db.get(
        "SELECT * from Score where challengeId = ? AND playerId = ?",
        [challengeId, playerId],
        (error, row) => {
          if (error) {
            console.log("Something went wrong: ", error);
            return undefined;
          } else {
            console.log("row", row);
            return row;
          }
        }
      );
    });
    db.close();
  }

  async getScores() {
    let db = new sqlite3.Database("./banterbot-database.db");
    db.serialize(() => {
      db.all(
        "SELECT * from Score INNER JOIN Challenge USING(challengeId) INNER JOIN Player USING(playerId)",
        [],
        (error, rows) => {
          if (error) {
            console.log("Something went wrong: ", error);
            return undefined;
          } else {
            console.log("rows", rows);
            scores = rows;
          }
        }
      );
    });
    db.close();
  }

  getChallengesList() {
    return challenges;
  }

  getScoreList() {
    return scores;
  }
}
