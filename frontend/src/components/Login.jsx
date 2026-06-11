export default function Login({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin
}) {
  return (
    <div className="card">
      <h2>Login</h2>

      <input className="input"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input className="input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button className="button" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
