export default function DepositForm({
  amount,
  setAmount,
  handleDeposit
}) {
  return (
      <div style={{
	  marginBottom: "20px"
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
        Deposit
      </button>
    </div>
  );
}
