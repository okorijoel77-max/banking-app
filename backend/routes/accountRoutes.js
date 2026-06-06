const express = require("express");
const router = express.Router();

const authenticate =
  require("../middleware/authMiddleware");

const accountController =
  require("../controllers/accountController");

router.get(
  "/me",
  authenticate,
  accountController.getMyAccount
);

router.get(
  "/lookup/:accountNumber",
  authenticate,
  accountController.lookupAccount
);

router.get(
  "/transactions",
  authenticate,
  accountController.getTransactionHistory
);

router.post(
  "/deposit",
  authenticate,
  accountController.depositMoney
);

router.post(
  "/withdraw",
  authenticate,
  accountController.withdrawMoney
);

router.post(
  "/transfer",
  authenticate,
  accountController.transferMoney
);

module.exports = router;
