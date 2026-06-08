export default function Transactions({
  transactions
}) {
  return (
    <div>
      <h2>Transactions</h2>

      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        transactions.map((tx) => (
          <div
            key={tx.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px"
            }}
          >
            <p>
              <strong>Type:</strong> {tx.type}
            </p>

            <p>
              <strong>Amount:</strong> ₦{tx.amount}
            </p>

            <p>
              <strong>Date:</strong> {tx.created_at}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
