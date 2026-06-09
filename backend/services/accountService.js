const accountRepo = require("../repositories/accountRepo");
const db = require("../services/dbService");

// TRANSFER MONEY (MAIN LOGIC)
async function transfer(senderUserId, { accountNumber, amount }) {
  amount = Number(amount);

  if (!accountNumber || !amount || amount <= 0) {
    throw new Error("Invalid transfer request");
  }

  const sender = await accountRepo.getByUserId(senderUserId);
  const receiver = await accountRepo.getByAccountNumber(accountNumber);

  if (!sender) {
    throw new Error("Sender account not found");
  }

  if (!receiver) {
    throw new Error("Recipient not found");
  }

  if (sender.id === receiver.id) {
    throw new Error("Cannot transfer to self");
  }

  if (sender.balance < amount) {
    throw new Error("Insufficient balance");
  }

  // EXECUTE TRANSFER (ATOMIC LOGIC)
  await accountRepo.debit(sender.id, amount);
  await accountRepo.credit(receiver.id, amount);

  // LOG TRANSACTION
  db.logTransfer(sender.id, receiver.id, amount);

  return true;
}


// DEPOSIT MONEY
async function deposit(userId, amount) {
  amount = Number(amount);

  if (!amount || amount <= 0) {
    throw new Error("Invalid amount");
  }

  const account = await accountRepo.getByUserId(userId);

  if (!account) {
    throw new Error("Account not found");
  }

  await accountRepo.credit(account.id, amount);

  db.logDeposit(account.id, amount);

  return true;
}


// GET DASHBOARD DATA
async function getDashboard(userId) {
  const account = await accountRepo.getByUserId(userId);

  if (!account) {
    throw new Error("Account not found");
  }

  const transactions = db.getTransactions(account.id);

  return {
    account,
    transactions
  };
}


// VERIFY ACCOUNT
async function verifyAccount(accountNumber) {
  const account = await accountRepo.getByAccountNumber(accountNumber);

  if (!account) {
    throw new Error("Account not found");
  }

  return {
    accountId: account.id,
    name: account.name,
    accountNumber: account.account_number
  };
}

module.exports = {
  transfer,
  deposit,
  getDashboard,
  verifyAccount
};
