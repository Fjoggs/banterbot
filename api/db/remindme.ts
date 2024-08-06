import { sqlite3 } from 'sqlite3';

export interface Reminder {
  id: number;
  message: string;
  who: string;
  time: number;
  reminded: boolean;
  inProgress: boolean;
}

const sqlite3: sqlite3 = require('sqlite3').verbose();

export const initDb = () => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    db.all(
      'CREATE TABLE IF NOT EXISTS reminder (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, message TEXT, who TEXT, time TEXT, reminded BOOLEAN, inProgress BOOLEAN)',
      [],
      (error) => {
        if (error) {
          console.log('Something went wrong: ', error);
        }
      }
    );
  });
  db.close();
};

export const getReminders = (callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    db.all('SELECT * FROM reminder', [], (error, rows: Array<Reminder>) => {
      if (error) {
        console.log('Something went wrong: ', error);
      } else {
        callback(rows);
      }
    });
  });
  db.close();
};

export const getFutureReminders = (callback: Function) => {
  const now = Date.now();
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    db.all('SELECT * FROM reminder WHERE time > ?', [now], (error, rows: Array<Reminder>) => {
      if (error) {
        console.log('Something went wrong: ', error);
      } else {
        callback(rows);
      }
    });
  });
  db.close();
};

export const getReminderById = (id: number, callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    db.get('SELECT * from reminder WHERE reminder = ?', [id], (error, row: Reminder) => {
      if (error) {
        console.log('Something went wrong: ', error);
      } else {
        callback(row);
      }
    });
  });
  db.close();
};

export const addReminder = (message: string, who: string, when: Date, callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    console.log(`Inserting reminder ${message}, ${who}, ${when} into db`);
    db.run(
      'INSERT INTO reminder (message, who, time, reminded, inProgress) VALUES(?, ?, ?, ?, ?)',
      [message, who, when, false, false],
      function (error) {
        if (error) {
          console.log('Something went wrong: ', error);
        } else {
          console.log('Inserted reminder: ', this.lastID);
          callback();
        }
      }
    );
  });
  db.close();
};

export const undoneReminder = (id: number, callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    db.get('UPDATE reminder SET reminded = false where id = ?', [id], (error, _) => {
      if (error) {
        console.log('Something went wrong: ', error);
      } else {
        console.log('Sat reminded = false for  reminder with id', id);
        callback();
      }
    });
  });
  db.close();
};

export const completeReminder = (id: number, callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    db.get('UPDATE reminder SET reminded = true where id = ?', [id], (error, _) => {
      if (error) {
        console.log('Something went wrong: ', error);
      } else {
        console.log('Completed reminder', id);
        callback();
      }
    });
  });
  db.close();
};

export const deleteReminder = (id: number, callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    console.log(`Deleting reminder with  ${id}`);
    db.run('DELETE FROM reminder WHERE id = ?', [id], function (error) {
      if (error) {
        console.log('Something went wrong: ', error);
      } else {
        console.log('Deleted reminder list with  and changes:  ', id, this.changes);
        callback(`Sletta reminder med  ${id} (endringer: ${this.changes})`);
      }
    });
  });
  db.close();
};

export const finishReminder = (id: number, completed: boolean, callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    console.log(`Updating reminder list with  ${id} with status ${completed}`);
    db.run('UPDATE reminder SET completed = ? where id = ?', [completed, id], function (error) {
      if (error) {
        console.log('Something went wrong: ', error);
      } else {
        console.log('Updated reminder with  and result:  ', id, completed);
        callback(this.changes);
      }
    });
  });
  db.close();
};
