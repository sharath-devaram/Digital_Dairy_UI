import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.status === 429
            ? err.message
            : "వినియోగదారు పేరు లేదా పాస్‌వర్డ్ తప్పు."
          : "లాగిన్ విఫలమైంది."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container login-page">
      <div className="login-card">
        <h1 className="login-title">అడ్మిన్ లాగిన్</h1>
        <form onSubmit={submit}>
          {error && <div className="banner banner-error">{error}</div>}
          <div className="field">
            <label htmlFor="username">వినియోగదారు పేరు</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">పాస్‌వర్డ్</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "లాగిన్ అవుతోంది…" : "లాగిన్"}
          </button>
        </form>
      </div>
    </div>
  );
}
