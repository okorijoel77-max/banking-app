import { useState, useEffect } from "react";
import api from "./services/api";

export default function App() {
  const [page, setPage] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [receiverAccount, setReceiverAccount] =
        useState("");
  const [transferAmount, setTransferAmount] =
        useState("");
  const [loading, setLoading] = useState(true);

useEffect(() => {
  checkLogin();
  setLoading(false);
}, []);

//HANDLE_REGISTER_
const handleRegister = async () => {
  try {
    const res = await api.post(
      "/auth/register",
      {
        name,
        email,
        password
      }
    );

    alert(
      "Account Created: " +
      res.data.accountNumber
    );
  } catch (err) {
    alert("Registration failed");
    console.log(err);
  }
};


//HANDLE_LOGIN_
const handleLogin = async () => {
  try {
    const res = await api.post(
      "/auth/login",
      {
        email,
        password
      }
    );

    localStorage.setItem(
     "token",
     res.data.token
    );

    const accountRes = await api.get(
      "/account/me",
    {
      headers: {
        Authorization:
        "Bearer " + res.data.token
      }
    }
 );

setAccount(accountRes.data);

const txRes = await api.get(
  "/account/transactions",
  {
    headers: {
      Authorization:
        "Bearer " + res.data.token
    }
  }
);

setTransactions(txRes.data);

     setLoggedIn(true);

     alert("Login successful");
  } catch (err) {
    alert("Login failed");
  }
};


//HANDLE_DEPOSIT_
const handleDeposit = async () => {
  try {
    const token =
      localStorage.getItem("token");

    await api.post(
      "/account/deposit",
      {
        amount: Number(amount)
      },
      {
        headers: {
          Authorization:
            "Bearer " + token
        }
      }
    );

    const accountRes = await api.get(
      "/account/me",
      {
        headers: {
          Authorization:
            "Bearer " + token
        }
      }
    );

    setAccount(accountRes.data);

    const txRes = await api.get(
      "/account/transactions",
     {
      headers: {
        Authorization:
         "Bearer " + token
      }
     }
   );

    setTransactions(txRes.data);

      setAmount("");

      alert("Deposit successful");
     } catch (err) {
      alert("Deposit failed");
    }
  };


//HANDLE_TRANSFER_
const handleTransfer = async () => {
  try {
    const token =
      localStorage.getItem("token");

    await api.post(
      "/account/transfer",
      {
        accountNumber: receiverAccount,
        amount: Number(transferAmount)
      },
      {
        headers: {
          Authorization:
            "Bearer " + token
        }
      }
    );

    const accountRes = await api.get(
      "/account/me",
      {
        headers: {
          Authorization:
            "Bearer " + token
        }
      }
    );

    setAccount(accountRes.data);

    const txRes = await api.get(
      "/account/transactions",
      {
        headers: {
          Authorization:
            "Bearer " + token
        }
      }
    );

    setTransactions(txRes.data);

    setReceiverAccount("");
    setTransferAmount("");

    alert("Transfer successful");
  } catch (err) {
    alert("Transfer failed");
    console.log(err);
  }
};


console.log("loggedIn =", loggedIn);


//AUTO_LOGIN_
const checkLogin = async () => {
  try {
    const token =
      localStorage.getItem("token");

    if (!token) return;

    const accountRes = await api.get(
      "/account/me",
      {
        headers: {
          Authorization:
            "Bearer " + token
        }
      }
    );

    setAccount(accountRes.data);

    const txRes = await api.get(
      "/account/transactions",
      {
        headers: {
          Authorization:
            "Bearer " + token
        }
      }
    );

    setTransactions(txRes.data);

    setLoggedIn(true);
  } catch (err) {
    localStorage.removeItem("token");
  }
};


//DASHBOARD_
if (loggedIn) {
  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "20px"
      }}
    >
      <h1>🏦 Dashboard</h1>

    {account && (
 <>
    <p>
      <strong>Name:</strong>{" "}
      {account.name}
    </p>

    <p>
      <strong>Account Number:</strong>{" "}
      {account.account_number}
    </p>

    <p>
      <strong>Balance:</strong> ₦
      {account.balance}
    </p>

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
	>
	  Deposit
	</button>


	<h2>Transfer</h2>

	<input
	  placeholder="Account Number"
	  value={receiverAccount}
	  onChange={(e) =>
	    setReceiverAccount(e.target.value)
	  }
	  style={{
	    width: "100%",
	    padding: "10px",
	    marginBottom: "10px"
	  }}
	/>

	<input
	  type="number"
	  placeholder="Amount"
	  value={transferAmount}
	  onChange={(e) =>
	    setTransferAmount(e.target.value)
	  }
	  style={{
	    width: "100%",
	    padding: "10px",
	    marginBottom: "10px"
	  }}
	/>

	<button onClick={handleTransfer}>
	  Transfer
	</button>
    </>
   )}

      <button
        onClick={() => {
          localStorage.removeItem("token");
          setLoggedIn(false);
        }}
      >
        Logout
      </button>
    </div>
  );
}



//HOME_PAGE_
if (loading) {
  return <h2>Loading...</h2>;
}
  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial"
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        🏦 Joel Bank
      </h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px"
        }}
      >
        <button
          onClick={() => setPage("login")}
        >
          Login
        </button>

        <button
          onClick={() => setPage("register")}
        >
          Register
        </button>
      </div>

      {page === "login" ? (
        <div>
          <h2>Login</h2>
	<input
	  placeholder="Email"
	  value={email}
	  onChange={(e) =>
	    setEmail(e.target.value)
	  }
	  style={{
	    width: "100%",
	    padding: "10px",
	    marginBottom: "10px"
	  }}
	/>

	<input
	  type="password"
	  placeholder="Password"
	  value={password}
	  onChange={(e) =>
	    setPassword(e.target.value)
	  }
	  style={{
	    width: "100%",
	    padding: "10px",
	    marginBottom: "10px"
	  }}
	/>
          <button onClick={handleLogin}>
             Login
          </button>
        </div>
      ) : (
        <div>
          <h2>Register</h2>

          <input
            placeholder="Name"
	    value={name}
 	    onChange={(e) =>
   	    setName(e.target.value)
  	   }

            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px"
            }}
          />
          <input
   	    placeholder="Email"
	    value={email} 
	    onChange={(e) => 
	    setEmail(e.target.value)
	  }
	      style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px"
            }}
          />

 	  <input
 	      type="password"
	      placeholder="Password"
	      value={password}
	      onChange={(e) =>
  	      setPassword(e.target.value)
	  }	 
	   style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px"
            }}
          />

         <button
           onClick={handleRegister}
         >
           Create Account
         </button>
        </div>
      )}
    </div>
  );
}

