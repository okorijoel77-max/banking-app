
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "../bank.db");
const initSqlJs = require("sql.js");

let db;
let SQL;

async function initDB() {
  SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    const fileBuffer = fs.readFileSync(DB_FILE);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        account_number TEXT UNIQUE,
        balance REAL DEFAULT 0
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER,
        type TEXT,
        amount REAL,
        created_at TEXT
      );
    `);

    saveDB();
  }

  console.log("Bank database ready");
}

function saveDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_FILE, buffer);
}


//CREATE_USER
function createUser(name, email, passwordHash) {
  try {
    const accountNumber = "BA" + Date.now();

    db.run(
      `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
      [name, email, passwordHash]
    );

    const userResult = db.exec(
      `SELECT id FROM users WHERE email = '${email}'`
    );

    const userId = userResult[0].values[0][0];

   db.run(
    `INSERT INTO accounts (user_id, account_number, balance)
    VALUES (?, ?, ?)`,
    [userId, accountNumber, 0]
  );

  saveDB();

    return { success: true, accountNumber };
  } catch (err) {
    return { success: false, error: err.message };
  }
}


//FIND_USER_BY_EMAIL
function findUserByEmail(email) {
  const result = db.exec(
    `SELECT * FROM users WHERE email = '${email}'`
  );

  if (result.length === 0) {
    return null;
  }

  const columns = result[0].columns;
  const values = result[0].values[0];

  const user = {};

  columns.forEach((col, index) => {
    user[col] = values[index];
  });

  return user;
}


//GET_ACCOUNT_BY_EMAIL
function getAccountByEmail(email) {
  const result = db.exec(`
    SELECT
      users.name,
      users.email,
      accounts.account_number,
      accounts.balance
    FROM users
    JOIN accounts
      ON users.id = accounts.user_id
    WHERE users.email = '${email}'
  `);

  if (result.length === 0) {
    return null;
  }

  const columns = result[0].columns;
  const values = result[0].values[0];

  let account = {};

  columns.forEach((col, index) => {
    account[col] = values[index];
  });

  return account;
}


//DEPOSIT_
function deposit(accountId, amount) {
  db.run(
    `UPDATE accounts
     SET balance = balance + ?
     WHERE id = ?`,
    [amount, accountId]
  );

  db.run(
    `INSERT INTO transactions
     (account_id, type, amount, created_at)
     VALUES (?, ?, ?, ?)`,
    [
      accountId,
      "deposit",
      amount,
      new Date().toISOString()
    ]
  );

  saveDB();
}


//WITHDRAW_
function withdraw(accountId, amount) {
  const result = db.exec(`
    SELECT balance FROM accounts WHERE id = ${accountId}
  `);

  if (!result.length) {
    throw new Error("Account not found");
  }

  const currentBalance = result[0].values[0][0];

  if (currentBalance < amount) {
    throw new Error("Insufficient balance");
  }

  db.run(
    `UPDATE accounts
     SET balance = balance - ?
     WHERE id = ?`,
    [amount, accountId]
  );

  db.run(
    `INSERT INTO transactions
     (account_id, type, amount, created_at)
     VALUES (?, ?, ?, ?)`,
    [
      accountId,
      "withdrawal",
      amount,
      new Date().toISOString()
    ]
  );

  saveDB();
}


//TRANSFER_
function transfer(fromAccountId, toAccountNumber, amount) {
  amount = Number(amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid amount");
  }

  // 1. Get sender account
  const senderResult = db.exec(
    `SELECT account_number, balance FROM accounts WHERE id = ?`,
    [fromAccountId]
  );

  if (!senderResult.length) {
    throw new Error("Sender account not found");
  }

  const sender = {
    account_number: senderResult[0].values[0][0],
    balance: senderResult[0].values[0][1]
  };

  // 2. Prevent self-transfer
  if (sender.account_number === toAccountNumber) {
    throw new Error("Cannot transfer to same account");
  }

  // 3. Check balance
  if (sender.balance < amount) {
    throw new Error("Insufficient balance");
  }

  // 4. Get receiver
  const receiverResult = db.exec(
    `SELECT id FROM accounts WHERE account_number = ?`,
    [toAccountNumber]
  );

  if (!receiverResult.length) {
    throw new Error("Receiver not found");
  }

  const toAccountId = receiverResult[0].values[0][0];

  const now = new Date().toISOString();

  // 5. EXECUTE SAFE TRANSACTION (logical atomicity)
  db.run(
    `UPDATE accounts SET balance = balance - ? WHERE id = ?`,
    [amount, fromAccountId]
  );

  db.run(
    `UPDATE accounts SET balance = balance + ? WHERE id = ?`,
    [amount, toAccountId]
  );

  // 6. Audit logs (critical in fintech)
  db.run(
    `INSERT INTO transactions (account_id, type, amount, created_at)
     VALUES (?, ?, ?, ?)`,
    [fromAccountId, "transfer_out", amount, now]
  );

  db.run(
    `INSERT INTO transactions (account_id, type, amount, created_at)
     VALUES (?, ?, ?, ?)`,
    [toAccountId, "transfer_in", amount, now]
  );

  // 7. Persist
  saveDB();

  return {
    success: true,
    amount,
    toAccountNumber
  };
}


//GET_ACC_BY_USER_ID
function getAccountByUserId(userId) {
  const result = db.exec(`
    SELECT * FROM accounts
    WHERE user_id = ${userId}
  `);

  if (result.length === 0) {
    return null;
  }

  const columns = result[0].columns;
  const values = result[0].values[0];

  let account = {};

  columns.forEach((col, index) => {
    account[col] = values[index];
  });

  return account;
}


//GET_TRANSACTIONS
function getTransactions(accountId) {
  const result = db.exec(`
    SELECT *
    FROM transactions
    WHERE account_id = ${accountId}
    ORDER BY id DESC
  `);

  if (result.length === 0) {
    return [];
  }

  const columns = result[0].columns;
  const values = result[0].values;

  return values.map(row => {
    const transaction = {};

    columns.forEach((col, index) => {
      transaction[col] = row[index];
    });

    return transaction;
  });
}


//FIND_ACC_BY_ACC-NUM
function findAccountByNumber(accountNumber) {
  const result = db.exec(`
    SELECT
      users.name,
      accounts.account_number
    FROM accounts
    JOIN users
      ON users.id = accounts.user_id
    WHERE accounts.account_number = '${accountNumber}'
  `);

  if (result.length === 0) {
    return null;
  }

  const columns = result[0].columns;
  const values = result[0].values[0];

  let account = {};

  columns.forEach((col, index) => {
    account[col] = values[index];
  });

  return account;
}


//EXPORTS_
module.exports = {
  initDB,
  createUser,
  findUserByEmail,
  getAccountByEmail,
  deposit,
  withdraw,
  transfer,
  getAccountByUserId,
  getTransactions,
  findAccountByNumber
};
