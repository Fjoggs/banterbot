import { sqlite3 } from "sqlite3";

export interface Player {
  playerId: number;
  name: string;
  rep: number;
}

const sqlite3: sqlite3 = require("sqlite3").verbose();

export const changePlayerTotalRep = (playerId: number) => {
  let db = new sqlite3.Database("./banterbot-database.db");
  console.log("changing rep for player", playerId);
  db.serialize(() => {
    db.run(
      "UPDATE players SET rep=rep + 1 WHERE playerId = ?",
      [playerId],
      (error) => {
        if (error) {
          console.log("Something went wrong: ", error);
        } else {
          console.log("Changed rep for player:  ", playerId);
        }
      }
    );
  });
  db.close();
};

export const getPlayers = (callback: Function) => {
  let db = new sqlite3.Database("./banterbot-database.db");
  db.serialize(() => {
    db.all("SELECT * from players", [], (error, rows: Array<Player>) => {
      if (error) {
        console.log("Something went wrong: ", error);
      } else {
        callback(rows);
      }
    });
  });
  db.close();
};
