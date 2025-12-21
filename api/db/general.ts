import { sqlite3 } from 'sqlite3';

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

const sqlite3: sqlite3 = require('sqlite3').verbose();

export const increaseGressCounter = (name: string, callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  console.log(`increment gress counter for ${name} by 1`);
  db.serialize(() => {
    db.run(
      'INSERT INTO gress (name, counter) VALUES (?, 1) ON CONFLICT (name) DO UPDATE SET counter = counter + 1',
      [name],
      (error) => {
        if (error) {
          console.log('Something went wrong: ', error);
        } else {
          console.log(`Increased gresscounter for ${name}`);
          callback();
        }
      }
    );
  });
  db.close();
};

export const increaseLukakuCounter = (callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  console.log('increment lukaku counter by 1');
  db.serialize(() => {
    db.run('UPDATE random SET lukakuCounter = lukakuCounter + 1 WHERE randomId = 1', (error) => {
      if (error) {
        console.log('Something went wrong: ', error);
      } else {
        console.log('Increased lukakuCounter');
        callback();
      }
    });
  });
  db.close();
};

export const increaseAfkonkCounter = (callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  console.log('increment afkonk counter by 1');
  db.serialize(() => {
    db.run('UPDATE afkonk SET counter = counter + 1 WHERE afkonkId = 1', (error) => {
      if (error) {
        console.log('Something went wrong: ', error);
      } else {
        console.log('Increased afkonkCounter');
        callback();
      }
    });
  });
  db.close();
};

export const getAfkonkCounter = (callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    db.get('SELECT * FROM afkonk WHERE afkonkId = 1', [], (error, row: AfkonkEntry) => {
      if (error) {
        console.log('Something went wrong: ', error);
      } else {
        callback(row);
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

export const getGress = (name: string, callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    db.get('SELECT * FROM gress WHERE name = ?', [name], (error, row: GressEntry) => {
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

export const getGressStats = (callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    db.all('SELECT * FROM gress ORDER BY counter DESC', [], (error, row: GressEntry) => {
      if (error) {
        console.log('Something went wrong: ', error);
      } else {
        callback(row);
      }
    });
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
