
export default function TransferForm({
  receiverAccount,
  setReceiverAccount,
  transferAmount,
  setTransferAmount,
  handleTransfer,
  handleVerify,
  recipient,
  verifying
}) {

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Transfer</h2>

       <input
	  placeholder="Account Number"
	  value={receiverAccount}
	  onChange={(e) => {
	    const value = e.target.value;

	    setReceiverAccount(value);

	    if (value.length > 6) {
	      handleVerify(value);
	    }
	  }}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px"
        }}
      />

	{verifying && (
	  <p>Checking recipient...</p>
	)}

	{recipient && (
	  <p style={{ color: "green" }}>
	    Recipient: {recipient.name}
	  </p>
	)}

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
