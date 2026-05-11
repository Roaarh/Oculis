import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import Enterbutton from "../components/Enterbutton";
import "../styles/Auth.css";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, THEME_STYLES } = useTheme();
  const currentStyle = THEME_STYLES[theme];

  // Read mode from query (?mode=login or ?mode=signup), default signup
  const searchParams = new URLSearchParams(location.search);
  const queryMode = searchParams.get("mode");
  const initialMode = queryMode === "login" ? "login" : "signup";

  // Username from Welcome page (via state, NOT localStorage)
  const welcomeUsername = location.state?.welcomeUsername || "";

  const [mode, setMode] = useState(initialMode);

  // LOGIN fields: EMAIL + PASSWORD
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // SIGNUP fields
  const [signupName, setSignupName] = useState(welcomeUsername); // Read from state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleMute = () => setIsMuted((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (mode === "login") {
        // LOGIN: email + password
        const res = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.ok) {
          setErrorMsg(data.error || "Invalid email or password");
          setLoading(false);
          return;
        }

        // Save to localStorage AFTER successful login
        localStorage.setItem("oculis_token", data.token);
        localStorage.setItem("oculis_user_id", data.user.id);
        localStorage.setItem("oculis_username", data.user.username || "");
        localStorage.setItem("oculis_email", data.user.email || "");

        setLoading(false);
        navigate("/roadmap");
      } else {
        // SIGNUP: username + email + password
        if (signupPassword !== signupConfirm) {
          setErrorMsg("Passwords do not match");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:4000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: signupName,
            email: signupEmail,
            password: signupPassword,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.ok) {
          setErrorMsg(data.error || "Sign up failed");
          setLoading(false);
          return;
        }

        // Save to localStorage AFTER successful signup (ALL together in database)
        localStorage.setItem("oculis_token", data.token);
        localStorage.setItem("oculis_user_id", data.user.id);
        localStorage.setItem("oculis_username", data.user.username || "");
        localStorage.setItem("oculis_email", data.user.email || "");

        setLoading(false);
        // after signup complete, navigate to onboarding or dashboard
        navigate("/Onboarding");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-root"
      style={{
        background: currentStyle.background,
        color: currentStyle.text,
      }}
    >
     
      {/* MAIN CENTERED CARD */}
      <main className="auth-main">
        <div className="auth-card">
          {/* Toggle buttons */}
          <div className="auth-toggle">
            <button
              type="button"
              className={`auth-toggle-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => {
                setMode("login");
                setErrorMsg("");
              }}
            >
              Log in
            </button>
            <button
              type="button"
              className={`auth-toggle-btn ${
                mode === "signup" ? "active" : ""
              }`}
              onClick={() => {
                setMode("signup");
                setErrorMsg("");
              }}
            >
              Sign up
            </button>
          </div>

          {errorMsg && <p className="auth-error">{errorMsg}</p>}

          {/* LOGIN FORM */}
          {mode === "login" && (
            <form className="auth-form" onSubmit={handleSubmit}>
              <h2 className="auth-title">Welcome back</h2>
              <p className="auth-subtitle">Log in to continue your journey</p>

              <label className="auth-label">
                Email
                <input
                  type="email"
                  className="auth-input"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </label>

              <label className="auth-label">
                Password
                <input
                  type="password"
                  className="auth-input"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </label>

              <Enterbutton
                type="submit"
                disabled={!loginEmail || !loginPassword || loading}
                className="auth-submit-btn"
              >
                {loading ? "Please wait..." : "Continue"}
              </Enterbutton>
            </form>
          )}

          {/* SIGNUP FORM */}
          {mode === "signup" && (
            <form className="auth-form" onSubmit={handleSubmit}>
              <h2 className="auth-title">Create account</h2>
              <p className="auth-subtitle">Sign up and start dreaming</p>

              <label className="auth-label">
                Username
                <input
                  type="text"
                  className="auth-input"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                />
              </label>

              <label className="auth-label">
                Email
                <input
                  type="email"
                  className="auth-input"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </label>

              <label className="auth-label">
                Password
                <input
                  type="password"
                  className="auth-input"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
              </label>

              <label className="auth-label">
                Confirm password
                <input
                  type="password"
                  className="auth-input"
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  required
                />
              </label>

              <Enterbutton
                type="submit"
                disabled={
                  !signupName ||
                  !signupEmail ||
                  !signupPassword ||
                  signupPassword !== signupConfirm ||
                  loading
                }
                className="auth-submit-btn"
              >
                {loading ? "Please wait..." : "Continue"}
              </Enterbutton>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
