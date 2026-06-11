// IMPORT_STATES
import { useState, useEffect } from "react";
import api from "./services/api";
import "./App.css";
import { FaUser, FaHeadset, FaMoneyBill, FaUniversity }
 from "react-icons/fa";

// IMPORT_COMPONENTS
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";


// EXPORT_APP_Functions

export default function App() {
  const [page, setPage] = useState("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [amount, setAmount] = useState("");
  const [receiverAccount, setReceiverAccount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  
  const [recipient, setRecipient] = useState(null);
  const [verifying, setVerifying] = useState(false);


// EFFECTS

  useEffect(() => {
    checkLogin();
    setLoading(false);
  }, []);


// AUTH_CHECK

  const checkLogin = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const accountRes = await api.get("/account/me", {
        headers: { Authorization: "Bearer " + token }
      });

      setAccount(accountRes.data.account);
      setTransactions(accountRes.data.transactions);
      setLoggedIn(true);
    } 
      catch (err) {
      localStorage.removeItem("token");
    }
  };


// LOGIN

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);

      await checkLogin();

      setLoggedIn(true);
      alert("Login successful");
    } catch {
      alert("Login failed");
    }
  };


 // REGISTER

  const handleRegister = async () => {
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password
      });

      alert("Account Created: " + res.data.accountNumber);
    
    setName("");
    setEmail("");
    setPassword("");
  }
   catch {
      alert("Registration failed");
    }
  };


// DEPOSIT

  const handleDeposit = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/account/deposit",
        { amount: Number(amount) },
        { headers: { Authorization: "Bearer " + token } }
      );

      await checkLogin();
      setAmount("");
      alert("Deposit successful");
    } catch {
      alert("Invalid amount");
    }
  };



// TRANSFER

const handleTransfer = async () => {
  try {
    if (!recipient) {
      alert("Verify recipient first");
      return;
    }

    const token = localStorage.getItem("token");

    await api.post(
     "/account/transfer",
    {
      accountNumber: receiverAccount,
      amount: Number(transferAmount)
    },
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    await checkLogin();

    setReceiverAccount("");
    setTransferAmount("");
    setRecipient(null);

    alert("Transfer successful");
  } catch (err) {
     console.log(err);
     alert(
     err?.response?.data?.error ||
     "Transfer failed"
   );
 }
};



// AUTO_VERIFY

  const handleVerify = async (accountNumber) => {
  try {
    setVerifying(true);

    const token = localStorage.getItem("token");

    const res = await api.get(
      `/account/verify/${accountNumber}`,
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    setRecipient(res.data);
  } catch (err) {
    setRecipient(null);
  } finally {
    setVerifying(false);
  }
};


// LOADING

  if (loading) return <h2>Loading...</h2>;


// DASHBOARD

  if (loggedIn && account) {
    return (
       <Dashboard
	  account={account}
	  transactions={transactions}
	  amount={amount}
	  setAmount={setAmount}
	  handleDeposit={handleDeposit}
	  receiverAccount={receiverAccount}
	  setReceiverAccount={setReceiverAccount}
	  transferAmount={transferAmount}
	  setTransferAmount={setTransferAmount}
	  handleTransfer={handleTransfer}
	  handleVerify={handleVerify}
	  recipient={recipient}
	  verifying={verifying}
	  handleLogout={() => {
	    localStorage.removeItem("token");
	    setLoggedIn(false);
	    setAccount(null);
	  }}
	/>
    );
  }



// HOME_PAGE

  return (
<>
    <div className="container">
     <div className="homeHero">
       <div className="fa"> 
         <FaHeadset style={{fontSize:"20px"}} />
       </div>
      <img src="/bank.png" alt="bankImg" className="homeImage"/>
     </div> 
        <div className="logReg">
        <button className="home-btn" onClick={() => setPage("login")}>Login</button>
        <button className="home-btn" onClick={() => setPage("register")}>Register</button>
        </div>

      {page === "login" ? (
        <Login
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      ) : (
        <Register
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleRegister={handleRegister}
        />
      )}
    </div>
    <footer className="footer">
        <p>powered by CBN copyrights® 2026</p>
    </footer>
</>
  );
}
