import { sqlite3 } from 'sqlite3';

export interface Player {
  playerId: number;
  name: string;
  rep: number;
}

export interface Stats {
  result: string;
  bet: string;
  name: string;
  rep: number;
}

const sqlite3: sqlite3 = require('sqlite3').verbose();

export const changePlayerTotalRep = (playerId: number) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  console.log('changing rep for player', playerId);
  db.serialize(() => {
    db.run('UPDATE players SET rep=rep + 1 WHERE playerId = ?', [playerId], (error) => {
      if (error) {
        console.log('Something went wrong: ', error);
      } else {
        console.log('Changed rep for player:  ', playerId);
      }
    });
  });
  db.close();
};

export const getPlayers = (callback: Function) => {
  const db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    db.all('SELECT * FROM players ORDER BY rep DESC', [], (error, rows: Array<Player>) => {
      if (error) {
        console.log('Something went wrong: ', error);
      } else {
        callback(rows);
      }
    });
  });
  db.close();
};

export const getStats = (callback: Function) => {
  const db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    db.all(
      'SELECT result, bet, players.name, players.rep FROM bets JOIN challenges ON bets.challengeId = challenges.challengeId JOIN players ON players.playerId = bets.playerId  AND result IS NOT NULL order by players.rep',
      [],
      (error, rows: Array<Stats>) => {
        if (error) {
          console.log('Something went wrong: ', error);
        } else {
          console.log(rows);
          callback(rows);
        }
      }
    );
  });
  db.close();
};
