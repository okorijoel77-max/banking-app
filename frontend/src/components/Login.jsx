export default function Login({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin
}) {
  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
