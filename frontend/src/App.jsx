import { useState, useEffect } from "react";
import api from "./services/api";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

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

  useEffect(() => {
    checkLogin();
    setLoading(false);
  }, []);

  // AUTH CHECK
  const checkLogin = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const accountRes = await api.get("/account/me", {
        headers: { Authorization: "Bearer " + token }
      });

      const txRes = await api.get("/account/transactions", {
        headers: { Authorization: "Bearer " + token }
      });

      setAccount(accountRes.data);
      setTransactions(txRes.data);
      setLoggedIn(true);
    } catch (err) {
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
    } catch {
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
      alert("Deposit failed");
    }
  };

  // TRANSFER
  const handleTransfer = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/account/transfer",
        {
          accountNumber: receiverAccount,
          amount: Number(transferAmount)
        },
        { headers: { Authorization: "Bearer " + token } }
      );

      await checkLogin();
      setReceiverAccount("");
      setTransferAmount("");

      alert("Transfer successful");
    } catch {
      alert("Transfer failed");
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
        handleLogout={() => {
          localStorage.removeItem("token");
          setLoggedIn(false);
          setAccount(null);
        }}
      />
    );
  }

  // LOGIN / REGISTER
  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>🏦 Joel Bank</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("register")}>Register</button>
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
  );
}
