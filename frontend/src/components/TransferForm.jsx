export default function TransferForm({
  receiverAccount,
  setReceiverAccount,
  transferAmount,
  setTransferAmount,
  handleTransfer
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Transfer</h2>

      <input
        placeholder="Account Number"
        value={receiverAccount}
        onChange={(e) =>
          setReceiverAccount(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px"
        }}
      />

      <input
        type="number"
        placeholder="Amount"
        value={transferAmount}
        onChange={(e) =>
          setTransferAmount(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px"
        }}
      />

      <button
        onClick={handleTransfer}
        style={{
          width: "100%",
          padding: "10px"
        }}
      >
        Transfer
      </button>
    </div>
  );
}
