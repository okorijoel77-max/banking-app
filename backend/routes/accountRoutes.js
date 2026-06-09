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
  "/transfer",
  authenticate,
  accountController.transferMoney
);

router.get(
  "/verify/:accountNumber",
  authenticate,
  accountController.verifyAccount
);

module.exports = router;
