import { DatabaseSync } from 'node:sqlite';

export interface Shopping {
  shoppingId: number;
  items: string;
  completed: boolean;
}

const DB_PATH = './banterbot-database.db';

export const initDb = () => {
  const db = new DatabaseSync(DB_PATH);
  try {
    db.exec(
      'CREATE TABLE IF NOT EXISTS shopping (shoppingId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, items TEXT, completed BOOLEAN)'
    );
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const getShopping = (callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    const rows = db.prepare('SELECT shoppingId, items, completed FROM shopping').all() as Shopping[];
    callback(rows);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const getShoppingById = (shoppingId: number, callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    const row = db.prepare('SELECT * from shopping WHERE shoppingId = ?').get(shoppingId) as
      | Shopping
      | undefined;
    callback(row);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const updateShopping = (shoppingId: number, shoppingList: string[], callback: Function) => {
  getShoppingById(shoppingId, (existingList: Shopping) => {
    if (existingList.completed) {
      callback(false);
    } else {
      console.log('adding items', shoppingList.join(', '));
      const db = new DatabaseSync(DB_PATH);
      try {
        db.prepare("UPDATE shopping SET items = (items || ', ' || ?) where shoppingId = ?").run(
          shoppingList.join(', '),
          shoppingId
        );
        console.log('Updated shopping list', shoppingId, shoppingList);
        callback(true);
      } catch (error) {
        console.log('Something went wrong: ', error);
      } finally {
        db.close();
      }
    }
  });
};

export const addShopping = (shoppingList: string[], callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    console.log(`Inserting shopping list into db`);
    const result = db.prepare('INSERT INTO shopping (items, completed) VALUES(?, ?)').run(
      shoppingList.join(', '),
      0
    );
    console.log('Inserted shoping list id: ', result.lastInsertRowid);
    callback(result.lastInsertRowid, shoppingList);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const undoneShopping = (shoppingId: number, callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    db.prepare('UPDATE shopping SET completed = false where shoppingId = ?').run(shoppingId);
    console.log('Opened shopping list', shoppingId);
    callback();
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const deleteShopping = (shoppingId: number, callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    console.log(`Deleting shopping with id ${shoppingId}`);
    const result = db.prepare('DELETE FROM shopping WHERE shoppingId = ?').run(shoppingId);
    console.log('Deleted shopping list with id and changes:  ', shoppingId, result.changes);
    callback(`Sletta shopping med id ${shoppingId} (endringer: ${result.changes})`);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};

export const finishShopping = (shoppingId: number, completed: boolean, callback: Function) => {
  const db = new DatabaseSync(DB_PATH);
  try {
    console.log(`Updating shopping list with id ${shoppingId} with status ${completed}`);
    const result = db
      .prepare('UPDATE shopping SET completed = ? where shoppingId = ?')
      .run(Number(completed), shoppingId);
    console.log('Updated shopping with id and result:  ', shoppingId, completed);
    callback(result.changes);
  } catch (error) {
    console.log('Something went wrong: ', error);
  } finally {
    db.close();
  }
};
