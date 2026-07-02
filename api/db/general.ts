import { DatabaseSync } from 'node:sqlite';

export interface RandomEntry {
  randomId: number;
  jamesCounter: number;
  lukakuCounter: number;
}

export type AfkonkEntry = {
  afkonkId: number;
  counter: number;
};

export interface GressEntry {
  name: string;
  counter: number;
}

export interface Stats {
  name: string;
  usage: number;
}

const DB_PATH = './banterbot-database.db';

export const increaseGressCounter = (name: string, callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  console.log(`increment gress counter for ${name} by 1`);
  try {
    db.prepare(
      'INSERT INTO gress (name, counter) VALUES (?, 1) ON CONFLICT (name) DO UPDATE SET counter = counter + 1'
    ).run(name);
    console.log(`Increased gresscounter for ${name}`);
    callback();
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const increaseLukakuCounter = (callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  console.log('increment lukaku counter by 1');
  try {
    db.prepare('UPDATE random SET lukakuCounter = lukakuCounter + 1 WHERE randomId = 1').run();
    console.log('Increased lukakuCounter');
    callback();
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const increaseAfkonkCounter = (callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  console.log('increment afkonk counter by 1');
  try {
    db.prepare('UPDATE afkonk SET counter = counter + 1 WHERE afkonkId = 1').run();
    console.log('Increased afkonkCounter');
    callback();
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const getAfkonkCounter = (callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    const row = db.prepare('SELECT * FROM afkonk WHERE afkonkId = 1').get() as
      | AfkonkEntry
      | undefined;
    callback(row);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const getRandom = (callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    const row = db.prepare('SELECT * FROM random WHERE randomId = 1').get() as
      | RandomEntry
      | undefined;
    callback(row);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const getGress = (name: string, callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    const row = db.prepare('SELECT * FROM gress WHERE name = ?').get(name) as
      | GressEntry
      | undefined;
    callback(row);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const insertOrUpdateUsage = (name: string) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    const result = db
      .prepare(
        'INSERT INTO emoji (name, usage) VALUES (?, 1) ON CONFLICT (name) DO UPDATE SET usage = usage + 1'
      )
      .run(name);
    console.log(`Updated row for ${name}`, result);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const getGressStats = (callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    const rows = db.prepare('SELECT * FROM gress ORDER BY counter DESC').all() as GressEntry[];
    callback(rows);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const getStatsAll = (callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    const rows = db.prepare('SELECT * FROM emoji ORDER BY usage DESC').all() as RandomEntry[];
    callback(rows);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const getStatsTop5 = (callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    const rows = db
      .prepare('SELECT * FROM emoji ORDER BY usage DESC LIMIT 5')
      .all() as RandomEntry[];
    callback(rows);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};
