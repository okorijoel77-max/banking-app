const fs = require("fs");
const path = require("path");
const initSqlJs = require("sql.js");

const DB_FILE = path.join(__dirname, "../bank.db");

let SQL;
let db;

/* ---------------- INIT ---------------- */

async function initDB() {
  SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    const fileBuffer = fs.readFileSync(DB_FILE);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();

    db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
      );
    `);

    db.exec(`
      CREATE TABLE accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        account_number TEXT UNIQUE,
        balance REAL DEFAULT 0
      );
    `);

    db.exec(`
      CREATE TABLE transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER,
        type TEXT,
        amount REAL,
        created_at TEXT
      );
    `);

    saveDB();
  }

  console.log("Bank DB ready");
}

/* ---------------- SAVE ---------------- */

function saveDB() {
  const data = db.export();
  fs.writeFileSync(DB_FILE, Buffer.from(data));
}

/* ---------------- HELPERS ---------------- */

function exec(sql) {
  return db.exec(sql);
}

/* ---------------- USER ---------------- */

function createUser(name, email, passwordHash) {
  try {
    const accountNumber = "BA" + Date.now();

    exec(`
      INSERT INTO users (name, email, password)
      VALUES ('${name}', '${email}', '${passwordHash}');
    `);

    const userRes = exec(`
      SELECT id FROM users WHERE email = '${email}'
    `);

    const userId = userRes[0].values[0][0];

    exec(`
      INSERT INTO accounts (user_id, account_number, balance)
      VALUES (${userId}, '${accountNumber}', 0)
    `);

    saveDB();

    return { success: true, accountNumber };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function findUserByEmail(email) {
  const result = exec(`
    SELECT * FROM users WHERE email = '${email}'
  `);

  if (!result.length || !result[0].values.length) return null;

  const user = {};
  result[0].columns.forEach((c, i) => {
    user[c] = result[0].values[0][i];
  });

  return user;
}

/* ---------------- ACCOUNT ---------------- */

function getAccountByEmail(email) {
  const result = exec(`
    SELECT
      users.name,
      users.email,
      accounts.account_number,
      accounts.balance
    FROM users
    JOIN accounts ON users.id = accounts.user_id
    WHERE users.email = '${email}'
  `);

  if (!result.length || !result[0].values.length) return null;

  const account = {};
  result[0].columns.forEach((c, i) => {
    account[c] = result[0].values[0][i];
  });

  return account;
}

function getAccountByUserId(userId) {
  const result = exec(`
    SELECT
      accounts.id,
      accounts.user_id,
      accounts.account_number,
      accounts.balance,
      users.name
    FROM accounts
    JOIN users ON users.id = accounts.user_id
    WHERE accounts.user_id = ${userId}
  `);

  if (!result.length || !result[0].values.length) return null;

  const account = {};
  result[0].columns.forEach((c, i) => {
    account[c] = result[0].values[0][i];
  });

  return account;
}

function getAccountByAccountId(id) {
  const result = exec(`
    SELECT
      accounts.id,
      accounts.user_id,
      accounts.account_number,
      accounts.balance,
      users.name
    FROM accounts
    JOIN users ON users.id = accounts.user_id
    WHERE accounts.id = ${id}
  `);

  if (!result.length || !result[0].values.length) return null;

  const account = {};
  result[0].columns.forEach((c, i) => {
    account[c] = result[0].values[0][i];
  });

  return account;
}

function findAccountByNumber(accountNumber) {
  const result = exec(`
    SELECT
      accounts.id,
      users.name,
      accounts.account_number
    FROM accounts
    JOIN users ON users.id = accounts.user_id
    WHERE accounts.account_number = '${accountNumber}'
  `);

  if (!result.length || !result[0].values.length) return null;

  const account = {};
  result[0].columns.forEach((c, i) => {
    account[c] = result[0].values[0][i];
  });

  return account;
}

/* ---------------- MONEY OPS ---------------- */

function deposit(accountId, amount) {
  exec(`
    UPDATE accounts
    SET balance = balance + ${amount}
    WHERE id = ${accountId}
  `);

  exec(`
    INSERT INTO transactions (account_id, type, amount, created_at)
    VALUES (${accountId}, 'deposit', ${amount}, datetime('now'))
  `);

  saveDB();
}

function withdraw(accountId, amount) {
  const res = exec(`
    SELECT balance FROM accounts WHERE id = ${accountId}
  `);

  if (!res.length || !res[0].values.length) {
    throw new Error("Account not found");
  }

  const balance = res[0].values[0][0];

  if (balance < amount) {
    throw new Error("Insufficient balance");
  }

  exec(`
    UPDATE accounts
    SET balance = balance - ${amount}
    WHERE id = ${accountId}
  `);

  exec(`
    INSERT INTO transactions (account_id, type, amount, created_at)
    VALUES (${accountId}, 'withdrawal', ${amount}, datetime('now'))
  `);

  saveDB();
}

function transfer(fromId, toAccountNumber, amount) {
  amount = Number(amount);

  if (!amount || amount <= 0) {
    throw new Error("Invalid amount");
  }

  const senderRes = exec(`
    SELECT account_number, balance
    FROM accounts
    WHERE id = ${fromId}
  `);

  if (!senderRes.length) throw new Error("Sender not found");

  const sender = senderRes[0].values[0];

  const senderAccNumber = sender[0];
  const senderBalance = sender[1];

  if (senderBalance < amount) {
    throw new Error("Insufficient balance");
  }

  if (senderAccNumber === toAccountNumber) {
    throw new Error("Cannot transfer to self");
  }

  const receiverRes = exec(`
    SELECT id FROM accounts
    WHERE account_number = '${toAccountNumber}'
  `);

  if (!receiverRes.length || !receiverRes[0].values.length) {
    throw new Error("Receiver not found");
  }

  const toId = receiverRes[0].values[0][0];

  exec(`
    UPDATE accounts
    SET balance = balance - ${amount}
    WHERE id = ${fromId}
  `);

  exec(`
    UPDATE accounts
    SET balance = balance + ${amount}
    WHERE id = ${toId}
  `);

  exec(`
    INSERT INTO transactions (account_id, type, amount, created_at)
    VALUES (${fromId}, 'transfer_out', ${amount}, datetime('now'))
  `);

  exec(`
    INSERT INTO transactions (account_id, type, amount, created_at)
    VALUES (${toId}, 'transfer_in', ${amount}, datetime('now'))
  `);

//temporary
console.log("SENDER RES:", senderRes);
console.log("RECEIVER RES:", receiverRes);

  saveDB();

  return { success: true };
}

/* ---------------- TRANSACTIONS ---------------- */

function getTransactions(accountId) {
  const result = exec(`
    SELECT *
    FROM transactions
    WHERE account_id = ${accountId}
    ORDER BY id DESC
  `);

  if (!result.length || !result[0].values.length) return [];

  return result[0].values.map(row => {
    const obj = {};
    result[0].columns.forEach((c, i) => {
      obj[c] = row[i];
    });
    return obj;
  });
}


//Transaction_Loggin
function logDeposit(accountId, amount) {
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

function logTransfer(senderId, receiverId, amount) {
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO transactions
     (account_id, type, amount, created_at)
     VALUES (?, ?, ?, ?)`,
    [senderId, "transfer_out", amount, now]
  );

  db.run(
    `INSERT INTO transactions
     (account_id, type, amount, created_at)
     VALUES (?, ?, ?, ?)`,
    [receiverId, "transfer_in", amount, now]
  );

  saveDB();
}


/* ---------------- EXPORTS ---------------- */

module.exports = {
  initDB,
  createUser,
  findUserByEmail,
  getAccountByEmail,
  getAccountByUserId,
  getAccountByAccountId,
  findAccountByNumber,
  deposit,
  withdraw,
  transfer,
  getTransactions,
  exec,
  logDeposit,
  logTransfer
};
