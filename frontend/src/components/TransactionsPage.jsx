export default function TransactionsPage({
  transactions,
  goBack
}) {
  const labels = {
    deposit: "💰 Deposit",
    transfer_in: "⬇ Money Received",
    transfer_out: "⬆ Money Sent",
    withdrawal: "🏧 Withdrawal"
  };

  return (
    <div>
      <h2>Transactions</h2>

      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        transactions.map((tx) => {
          const isCredit =
            tx.type === "deposit" ||
            tx.type === "transfer_in";

          return (
            <div className="transactions-card"
              key={tx.id}
            >
              <h3>{labels[tx.type] || tx.type}</h3>

              <p
                style={{
                  color: isCredit ? "green" : "red",
                  fontWeight: "bold"
                }}
              >
                ₦{Number(tx.amount).toLocaleString()}
              </p>

              <small>
                {new Date(tx.created_at).toLocaleString()}
              </small>
            </div>
          );
        })
      )}

      <button className="logout" onClick={goBack}>
        Back
      </button>
    </div>
  );
}
