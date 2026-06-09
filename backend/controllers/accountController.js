const accountService = require("../services/accountService");

// GET MY ACCOUNT + TRANSACTIONS
async function getMyAccount(req, res) {
  try {
    const data = await accountService.getDashboard(req.user.userId);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

// DEPOSIT
async function depositMoney(req, res) {
  try {
    await accountService.deposit(req.user.userId, req.body.amount);
    const data = await accountService.getDashboard(req.user.userId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// TRANSFER
async function transferMoney(req, res) {
  try {
    await accountService.transfer(req.user.userId, req.body);
    const data = await accountService.getDashboard(req.user.userId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// VERIFY ACCOUNT
async function verifyAccount(req, res) {
  try {
    const data = await accountService.verifyAccount(req.params.accountNumber);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

// TRANSACTIONS (OPTIONAL SEPARATE ENDPOINT)
async function getTransactionHistory(req, res) {
  try {
    const data = await accountService.getDashboard(req.user.userId);
    res.json(data.transactions);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = {
  getMyAccount,
  depositMoney,
  transferMoney,
  verifyAccount,
  getTransactionHistory
};
