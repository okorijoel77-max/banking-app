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
    <div>
      <h2>Register</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

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

      <button onClick={handleRegister}>
        Create Account
      </button>
    </div>
  );
}
