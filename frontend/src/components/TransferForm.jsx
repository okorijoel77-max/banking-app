export default function TransferForm({
  receiverAccount,
  setReceiverAccount,
  transferAmount,
  setTransferAmount,
  handleTransfer
}) {
  return (
    <>
      <h2>Transfer</h2>

      <input
        placeholder="Account Number"
        value={receiverAccount}
        onChange={(e) =>
          setReceiverAccount(e.target.value)
        }
      />

      <input
        type="number"
        placeholder="Amount"
        value={transferAmount}
        onChange={(e) =>
          setTransferAmount(e.target.value)
        }
      />

      <button onClick={handleTransfer}>
        Transfer
      </button>
    </>
  );
}
