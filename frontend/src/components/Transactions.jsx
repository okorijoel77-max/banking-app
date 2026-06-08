export default function Transactions({
  transactions
}) {
  return (
    <>
      <h2>Transactions</h2>

      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        transactions.map((tx) => (
          <div key={tx.id}>
            <p>Type: {tx.type}</p>
            <p>Amount: ₦{tx.amount}</p>
            <p>Date: {tx.created_at}</p>
          </div>
        ))
      )}
    </>
  );
}
