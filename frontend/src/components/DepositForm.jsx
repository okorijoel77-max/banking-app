export default function DepositForm({
  amount,
  setAmount,
  handleDeposit
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>Deposit</h2>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px"
        }}
      />

      <button
        onClick={handleDeposit}
        style={{
          width: "100%",
          padding: "10px"
        }}
      >
        Deposit
      </button>
    </div>
  );
}
