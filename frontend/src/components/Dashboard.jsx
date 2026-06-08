import DepositForm from "./DepositForm";
import TransferForm from "./TransferForm";
import Transactions from "./Transactions";

export default function Dashboard({
  account,
  transactions,
  amount,
  setAmount,
  handleDeposit,
  receiverAccount,
  setReceiverAccount,
  transferAmount,
  setTransferAmount,
  handleTransfer,
  handleLogout
}) {
  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "20px" }}>
      <h1>🏦 Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <p><strong>Name:</strong> {account.name}</p>
        <p><strong>Account Number:</strong> {account.account_number}</p>
        <p><strong>Balance:</strong> ₦{account.balance}</p>
      </div>

      <DepositForm
        amount={amount}
        setAmount={setAmount}
        handleDeposit={handleDeposit}
      />

      <TransferForm
        receiverAccount={receiverAccount}
        setReceiverAccount={setReceiverAccount}
        transferAmount={transferAmount}
        setTransferAmount={setTransferAmount}
        handleTransfer={handleTransfer}
      />

      <Transactions transactions={transactions} />

      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          background: "black",
          color: "white",
          padding: "10px",
          width: "100%"
        }}
      >
        Logout
      </button>
    </div>
  );
}
