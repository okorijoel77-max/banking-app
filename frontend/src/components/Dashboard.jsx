import DepositForm from "./DepositForm";
import TransferForm from "./TransferForm";
import Transactions from "./Transactions";
import TransactionsPage from "./TransactionsPage";
import { FaUser, FaHeadset, FaUniversity, FaPaperPlane }
 from "react-icons/fa";

export default function Dashboard({
  account,
  transactions,
  amount,
  setAmount,
  handleDeposit,
  receiverAccount,
  setReceiverAccount,
  transferAmount,
  setTransferAmount,
  handleTransfer,
  handleVerify,
  recipient,
  verifying,
  handleLogout,
  setScreen
}) {

return (
  <div className="container">
      <div className="dashboard">
	  <img
	    src="/bank.png"
	    alt="bankImg"
	    style={{ borderRadius: "50%", width: "100px",
	             height: "100px", margin:"20px"}}
	   />
      </div>
   
      <div className="card section">
        <FaUser className="faUser"/>
        <p><strong>Name:</strong> {account.name}</p>
        <p><strong>Account Number:</strong>
            {account.account_number}</p>
        <p className="balance">₦{Number(account.balance)
                      .toLocaleString()} </p>
      </div>

    <div>
      <DepositForm
        amount={amount}
        setAmount={setAmount}
        handleDeposit={handleDeposit}
      />

      <TransferForm
	  receiverAccount={receiverAccount}
	  setReceiverAccount={setReceiverAccount}
	  transferAmount={transferAmount}
	  setTransferAmount={setTransferAmount}
	  handleTransfer={handleTransfer}
	  handleVerify={handleVerify}
	  recipient={recipient}
	  verifying={verifying}
	/>
     </div>
    <p className="service-p">Services</p>
    <div className="services-grid">
       <div className="service-card"
         onClick={() => setScreen("transactions")}>💴<br /> Transactions</div>
       <div className="service-card">🔄<br /> Transfer</div>
       <div className="service-card">📞<br /> Airtime</div>
       <div className="service-card">📶<br /> Data</div>
       <div className="service-card">⚽<br /> Betting</div>
       <div className="service-card">💰<br />Savings</div>
       <div className="service-card">📚<br /> Education</div>
       <div className="service-card">📄<br /> Statement</div>
    </div>
      <button className="logout"
        onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

