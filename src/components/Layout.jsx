import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

export default function Layout({ children }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="layout">
      <header className="site-header">
        <div className="container site-header-inner">
          <Link to="/" className="site-title">
            <span className="site-title-lamp" aria-hidden="true">
              ✦
            </span>
            నా డైరీ
          </Link>

          <nav className="site-nav">
            {admin ? (
              <>
                <Link to="/dashboard" className="nav-link">
                  డాష్‌బోర్డ్
                </Link>
                <Link to="/dashboard/new" className="nav-link">
                  కొత్త రాత
                </Link>
                <Link to="/settings" className="nav-link">
                  సెట్టింగ్స్
                </Link>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  లాగ్ అవుట్
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-link nav-link-login">
                అడ్మిన్ లాగిన్
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <div className="container">
          <span className="hint">ప్రతి రోజు ఒక పువ్వు — every day, another flower on the thread.</span>
        </div>
      </footer>
    </div>
  );
}
