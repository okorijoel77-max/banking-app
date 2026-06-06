const db = require("../services/dbService");

//GET_MY_ACCOUNT
function getMyAccount(req, res) {
  const account = db.getAccountByEmail(
    req.user.email
  );

  if (!account) {
    return res.status(404).json({
      error: "Account not found"
    });
  }

  res.json(account);
}


//LOOKUP_ACCOUNT
function lookupAccount(req, res) {
  const { accountNumber } = req.params;

  const account =
    db.findAccountByNumber(accountNumber);

  if (!account) {
    return res.status(404).json({
      error: "Account not found"
    });
  }

  res.json(account);
}


//DEPOSIT_MONEY
function depositMoney(req, res) {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      error: "Invalid amount"
    });
  }

  const account =
    db.getAccountByUserId(req.user.userId);

  if (!account) {
    return res.status(404).json({
      error: "Account not found"
    });
  }

  db.deposit(account.id, amount);

  res.json({
    message: "Deposit successful",
    amount
  });
}


// WITHDRAW_MONEY
function withdrawMoney(req, res) {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      error: "Invalid amount"
    });
  }

  const account = db.getAccountByUserId(req.user.userId);

  if (!account) {
    return res.status(404).json({
      error: "Account not found"
    });
  }

  try {
    db.withdraw(account.id, amount);

    res.json({
      message: "Withdrawal successful",
      amount
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message
    });
  }
}


//TRANSFER_MONEY
function transferMoney(req, res) {
  try {
    const { accountNumber, amount } = req.body;

    if (!accountNumber || !amount) {
      return res.status(400).json({
        error: "Missing fields"
      });
    }

    const sender = db.getAccountByUserId(req.user.userId);

    if (!sender) {
      return res.status(404).json({
        error: "Account not found"
      });
    }

    const result = db.transfer(
      sender.id,
      accountNumber,
      amount
    );

    return res.json({
      message: "Transfer successful",
      ...result
    });

  } catch (err) {
    return res.status(400).json({
      error: err.message
    });
  }
}


//GET_TRANS_HISTORY
function getTransactionHistory(req, res) {
  const account =
    db.getAccountByUserId(req.user.userId);

  if (!account) {
    return res.status(404).json({
      error: "Account not found"
    });
  }

  const transactions =
    db.getTransactions(account.id);

  res.json(transactions);
}


//EXPORTS_
module.exports = {
  getMyAccount,
  lookupAccount,
  depositMoney,
  withdrawMoney,
  transferMoney,
  getTransactionHistory
};
