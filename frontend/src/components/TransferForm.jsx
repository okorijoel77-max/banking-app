import { FaPaperPlane } from "react-icons/fa";

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
    <div className="card" 
      style={{ width: "80%",
               margin: "20px auto"
            }}>
      <h2>Transfer</h2>

       <input className="input"
	  placeholder="Account Number"
	  value={receiverAccount}
	  onChange={(e) => {
	    const value = e.target.value;

	    setReceiverAccount(value);

	    if (value.length > 6) {
	      handleVerify(value);
	    }
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

      <input className="input"
        type="number"
        placeholder="Amount"
        value={transferAmount}
        onChange={(e) =>
          setTransferAmount(e.target.value)
        }
      />

      <button className="button"
        onClick={handleTransfer}
      >
        <FaPaperPlane style={{color:"red"}}/>
      </button>
    </div>
  );
}
