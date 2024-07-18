import { sqlite3 } from 'sqlite3';

export interface Shopping {
  shoppingId: number;
  items: string;
  completed: boolean;
}

const sqlite3: sqlite3 = require('sqlite3').verbose();

export const initDb = () => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    db.all(
      'CREATE TABLE IF NOT EXISTS shopping (shoppingId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, items TEXT, completed BOOLEAN)',
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

export const getShopping = (callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    db.all(
      'SELECT shoppingId, items, completed FROM shopping',
      [],
      (error, rows: Array<Shopping>) => {
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

export const getShoppingById = (shoppingId: number, callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    db.get('SELECT * from shopping WHERE shoppingId = ?', [shoppingId], (error, row: Shopping) => {
      if (error) {
        console.log('Something went wrong: ', error);
      } else {
        callback(row);
      }
    });
  });
  db.close();
};

export const updateShopping = (shoppingId: number, shoppingList: string[], callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  getShoppingById(shoppingId, (existingList: Shopping) => {
    if (existingList.completed) {
      callback(false);
    } else {
      console.log('adding items', shoppingList.join(', '));
      db.serialize(() => {
        db.get(
          "UPDATE shopping SET items = (items || ', ' || ?) where shoppingId = ?",
          [shoppingList.join(', '), shoppingId],
          (error, row: Shopping) => {
            if (error) {
              console.log('Something went wrong: ', error);
            } else {
              console.log('Updated shopping list', shoppingId, shoppingList);
              callback(true);
            }
          }
        );
      });
      db.close();
    }
  });
};

export const addShopping = (shoppingList: string[], callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    console.log(`Inserting shopping list into db`);
    db.run(
      'INSERT INTO shopping (items, completed) VALUES(?, ?)',
      [shoppingList, false],
      function (error) {
        if (error) {
          console.log('Something went wrong: ', error);
        } else {
          console.log('Inserted shoping list id: ', this.lastID);
          callback(this.lastID, shoppingList);
        }
      }
    );
  });
  db.close();
};

export const undoneShopping = (shoppingId: number, callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    db.get(
      'UPDATE shopping SET completed = false where shoppingId = ?',
      [shoppingId],
      (error, row: Shopping) => {
        if (error) {
          console.log('Something went wrong: ', error);
        } else {
          console.log('Opened shopping list', shoppingId);
          callback();
        }
      }
    );
  });
  db.close();
};

export const deleteShopping = (shoppingId: number, callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    console.log(`Deleting shopping with id ${shoppingId}`);
    db.run('DELETE FROM shopping WHERE shoppingId = ?', [shoppingId], function (error) {
      if (error) {
        console.log('Something went wrong: ', error);
      } else {
        console.log('Deleted shopping list with id and changes:  ', shoppingId, this.changes);
        callback(`Sletta shopping med id ${shoppingId} (endringer: ${this.changes})`);
      }
    });
  });
  db.close();
};

export const finishShopping = (shoppingId: number, completed: boolean, callback: Function) => {
  let db = new sqlite3.Database('./banterbot-database.db');
  db.serialize(() => {
    console.log(`Updating shopping list with id ${shoppingId} with status ${completed}`);
    db.run(
      'UPDATE shopping SET completed = ? where shoppingId = ?',
      [completed, shoppingId],
      function (error) {
        if (error) {
          console.log('Something went wrong: ', error);
        } else {
          console.log('Updated shopping with id and result:  ', shoppingId, completed);
          callback(this.changes);
        }
      }
    );
  });
  db.close();
};
