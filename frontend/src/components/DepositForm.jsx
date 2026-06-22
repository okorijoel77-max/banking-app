import { FaPaperPlane } from "react-icons/fa";

export default function DepositForm({
  amount,
  setAmount,
  handleDeposit
}) {
  return (
      <div className="card"
        style={{ width: "80%",
               margin: "20px auto"
            }}>
      <h2>Deposit</h2>

      <input className="input"
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
      />

      <button className="button"
        onClick={handleDeposit}
      >
        <FaPaperPlane style={{color:"red"}}/>
      </button>
    </div>
  );
}
