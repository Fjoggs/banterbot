import { DatabaseSync } from 'node:sqlite';

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

const DB_PATH = './banterbot-database.db';

export const changePlayerTotalRep = (playerId: number) => {
  const db = new DatabaseSync(DB_PATH);
  console.log('changing rep for player', playerId);
  try {
    db.prepare('UPDATE players SET rep=rep + 1 WHERE playerId = ?').run(playerId);
    console.log('Changed rep for player:  ', playerId);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const getPlayers = (callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    const rows = db.prepare('SELECT * FROM players ORDER BY rep DESC').all() as Player[];
    callback(rows);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const getStats = (callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    const rows = db
      .prepare(
        'SELECT result, bet, players.name, players.rep FROM bets JOIN challenges ON bets.challengeId = challenges.challengeId JOIN players ON players.playerId = bets.playerId  AND result IS NOT NULL order by players.rep'
      )
      .all() as Stats[];
    console.log(rows);
    callback(rows);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};
