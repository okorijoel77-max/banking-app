const db = require("../services/dbService");

// GET ACCOUNT BY USER ID
function getByUserId(userId) {
  return db.getAccountByUserId(userId);
}

// GET ACCOUNT BY ACCOUNT ID
function getByAccountId(accountId) {
  return db.getAccountByAccountId(accountId);
}

// GET ACCOUNT BY ACCOUNT NUMBER
function getByAccountNumber(accountNumber) {
  return db.findAccountByNumber(accountNumber);
}

// DEBIT ACCOUNT
function debit(accountId, amount) {
  db.exec(`
    UPDATE accounts
    SET balance = balance - ${amount}
    WHERE id = ${accountId}
  `);
  return true;
}

// CREDIT ACCOUNT
function credit(accountId, amount) {
  db.exec(`
    UPDATE accounts
    SET balance = balance + ${amount}
    WHERE id = ${accountId}
  `);
  return true;
}

module.exports = {
  getByUserId,
  getByAccountId,
  getByAccountNumber,
  debit,
  credit
};
