import { sqlite3 } from 'sqlite3';

export interface Reminder {
  id: number;
  message: string;
  when: Date;
}

const sqlite3: sqlite3 = require('sqlite3').verbose();

export const initDb = () => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    db.all(
      'CREATE TABLE IF NOT EXISTS reminder ( INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, message TEXT, who TEXT, when TEXT)',
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

export const getReminder = (callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    db.all(
      'SELECT reminder, items, completed FROM reminder',
      [],
      (error, rows: Array<Reminder>) => {
        if (error) {
          console.log('Something went wrong: ', error);
        } else {
          callback(rows);
        }
      }
    );
  });
  db.close();
};

export const getReminderBy = (id: number, callback: Function) => {
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

export const addReminder = (reminderList: string[], callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    console.log(`Inserting reminder list into db`);
    db.run(
      'INSERT INTO reminder (items, completed) VALUES(?, ?)',
      [reminderList, false],
      function (error) {
        if (error) {
          console.log('Something went wrong: ', error);
        } else {
          console.log('Inserted shoping list : ', this.lastID);
          callback(this.lastID, reminderList);
        }
      }
    );
  });
  db.close();
};

export const undoneReminder = (id: number, callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    db.get('UPDATE reminder SET completed = false where id = ?', [id], (error, row: Reminder) => {
      if (error) {
        console.log('Something went wrong: ', error);
      } else {
        console.log('Opened reminder list', id);
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
