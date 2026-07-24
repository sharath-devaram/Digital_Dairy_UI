import { useState } from "react";
import { api, ApiError } from "../api";
import { useAuth } from "../context/AuthContext";
import "./Settings.css";

export default function Settings() {
  const { admin, refresh } = useAuth();

  const [currentPw1, setCurrentPw1] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [usernameMsg, setUsernameMsg] = useState(null);
  const [savingUsername, setSavingUsername] = useState(false);

  const [currentPw2, setCurrentPw2] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [savingPassword, setSavingPassword] = useState(false);

  const submitUsername = async (e) => {
    e.preventDefault();
    setUsernameMsg(null);
    setSavingUsername(true);
    try {
      await api.changeUsername(currentPw1, newUsername.trim());
      await refresh();
      setUsernameMsg({ type: "success", text: "వినియోగదారు పేరు మార్చబడింది." });
      setCurrentPw1("");
      setNewUsername("");
    } catch (err) {
      setUsernameMsg({
        type: "error",
        text: err instanceof ApiError ? err.message : "మార్చడంలో లోపం.",
      });
    } finally {
      setSavingUsername(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "కొత్త పాస్‌వర్డ్‌లు సరిపోలడం లేదు." });
      return;
    }
    setSavingPassword(true);
    try {
      await api.changePassword(currentPw2, newPassword);
      setPasswordMsg({ type: "success", text: "పాస్‌వర్డ్ మార్చబడింది." });
      setCurrentPw2("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMsg({
        type: "error",
        text: err instanceof ApiError ? err.message : "మార్చడంలో లోపం.",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="container settings-page">
      <h1>సెట్టింగ్స్</h1>
      <p className="hint">లాగిన్ అయినవారు: {admin?.username}</p>

      <section className="settings-card">
        <h2>వినియోగదారు పేరు మార్చండి</h2>
        <form onSubmit={submitUsername}>
          {usernameMsg && (
            <div className={`banner banner-${usernameMsg.type}`}>{usernameMsg.text}</div>
          )}
          <div className="field">
            <label htmlFor="cur-pw-1">ప్రస్తుత పాస్‌వర్డ్</label>
            <input
              id="cur-pw-1"
              type="password"
              value={currentPw1}
              onChange={(e) => setCurrentPw1(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="new-username">కొత్త వినియోగదారు పేరు</label>
            <input
              id="new-username"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              minLength={3}
              required
            />
          </div>
          <button className="btn btn-primary btn-sm" disabled={savingUsername}>
            {savingUsername ? "సేవ్ అవుతోంది…" : "నవీకరించండి"}
          </button>
        </form>
      </section>

      <section className="settings-card">
        <h2>పాస్‌వర్డ్ మార్చండి</h2>
        <form onSubmit={submitPassword}>
          {passwordMsg && (
            <div className={`banner banner-${passwordMsg.type}`}>{passwordMsg.text}</div>
          )}
          <div className="field">
            <label htmlFor="cur-pw-2">ప్రస్తుత పాస్‌వర్డ్</label>
            <input
              id="cur-pw-2"
              type="password"
              value={currentPw2}
              onChange={(e) => setCurrentPw2(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="new-pw">కొత్త పాస్‌వర్డ్ (కనీసం 8 అక్షరాలు)</label>
            <input
              id="new-pw"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="confirm-pw">కొత్త పాస్‌వర్డ్ నిర్ధారించండి</label>
            <input
              id="confirm-pw"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <button className="btn btn-primary btn-sm" disabled={savingPassword}>
            {savingPassword ? "సేవ్ అవుతోంది…" : "నవీకరించండి"}
          </button>
        </form>
      </section>
    </div>
  );
}
