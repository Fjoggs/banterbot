import { DatabaseSync } from 'node:sqlite';

export interface Reminder {
  id: number;
  message: string;
  who: string;
  time: number;
  reminded: boolean;
  inProgress: boolean;
}

const DB_PATH = './banterbot-database.db';

export const initDb = () => {
  const db = new DatabaseSync(DB_PATH);
  try {
    db.exec(
      'CREATE TABLE IF NOT EXISTS reminder (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, message TEXT, who TEXT, time TEXT, reminded BOOLEAN, inProgress BOOLEAN)'
    );
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const getReminders = (callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    const rows = db.prepare('SELECT * FROM reminder').all() as Reminder[];
    callback(rows);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const getFutureReminders = (callback: Function) => {
  const now = Date.now();
  const db = new DatabaseSync(DB_PATH);
  try {
    const rows = db.prepare('SELECT * FROM reminder WHERE time > ?').all(now) as Reminder[];
    callback(rows);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const getReminderById = (id: number, callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    const row = db.prepare('SELECT * from reminder WHERE reminder = ?').get(id) as
      | Reminder
      | undefined;
    callback(row);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const addReminder = (message: string, who: string, when: Date, callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    console.log(`Inserting reminder ${message}, ${who}, ${when} into db`);
    const result = db
      .prepare(
        'INSERT INTO reminder (message, who, time, reminded, inProgress) VALUES(?, ?, ?, ?, ?)'
      )
      .run(message, who, when.getTime(), 0, 0);
    console.log('Inserted reminder: ', result.lastInsertRowid);
    callback();
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const undoneReminder = (id: number, callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    db.prepare('UPDATE reminder SET reminded = false where id = ?').run(id);
    console.log('Sat reminded = false for  reminder with id', id);
    callback();
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const completeReminder = (id: number, callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    db.prepare('UPDATE reminder SET reminded = true where id = ?').run(id);
    console.log('Completed reminder', id);
    callback();
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const deleteReminder = (id: number, callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    console.log(`Deleting reminder with  ${id}`);
    const result = db.prepare('DELETE FROM reminder WHERE id = ?').run(id);
    console.log('Deleted reminder list with  and changes:  ', id, result.changes);
    callback(`Sletta reminder med  ${id} (endringer: ${result.changes})`);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const finishReminder = (id: number, completed: boolean, callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    console.log(`Updating reminder list with  ${id} with status ${completed}`);
    const result = db
      .prepare('UPDATE reminder SET completed = ? where id = ?')
      .run(Number(completed), id);
    console.log('Updated reminder with  and result:  ', id, completed);
    callback(result.changes);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};
