export default function Register({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  handleRegister
}) {
  return (
    <div className="card">
      <h2>Register</h2>

      <input className="input"
        placeholder="Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <input className="input"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input className="input"
        type="password"
        placeholder="Set password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button className="button" onClick={handleRegister}>
        Create Account
      </button>
    </div>
  );
}
