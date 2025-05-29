import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rightPanelActive, setRightPanelActive] = useState(false);

  const [helpEmail, setHelpEmail] = useState("");
  const [helpMessage, setHelpMessage] = useState("");
  const [helpError, setHelpError] = useState("");
  const [helpSuccess, setHelpSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleHelpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHelpError("");
    setHelpSuccess("");

    if (!helpEmail) {
      setHelpError("Please enter your email.");
      return;
    }
    if (!helpMessage) {
      setHelpError("Please enter a message.");
      return;
    }

    console.log("Help Request submitted:", { helpEmail, helpMessage });
    setHelpSuccess("Your request has been submitted. We'll get back to you soon.");
    setHelpEmail("");
    setHelpMessage("");
  };

  const logoStyle: React.CSSProperties = {
    display: "block",
    margin: "0 auto 24px auto",
    maxWidth: 150,
    height: "auto",
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    borderRadius: 10,
    boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
    position: "relative",
    overflow: "hidden",
    width: 900,
    maxWidth: "100%",
    minHeight: 600,
    display: "flex",
  };

  const formContainerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "50%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#fff",
    color: "#111",
    boxSizing: "border-box",
    transition: "all 0.6s ease-in-out",
  };

  const formStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 280,
  };

  const inputStyle: React.CSSProperties = {
    marginBottom: 20,
    padding: 12,
    width: "100%",
    border: "1px solid black",
    borderRadius: 4,
    outline: "none",
  };

  return (
    <div
      style={{
        fontFamily: "'Montserrat', sans-serif",
        height: "100vh",
        background: "#f6f5f7",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        id="container"
        className={rightPanelActive ? "right-panel-active" : ""}
        style={containerStyle}
      >
        {/* Sign In Form */}
        <div
          className="form-container sign-in-container"
          style={{
            ...formContainerStyle,
            zIndex: rightPanelActive ? 1 : 2,
            transform: rightPanelActive ? "translateX(100%)" : "translateX(0)",
            left: 0,
          }}
        >
          <img src="/citimaxlogo.png" alt="Citimax Logo" style={logoStyle} />

          <h1 style={{ fontWeight: "bold", marginBottom: 24 }}>Sign In</h1>
          <form onSubmit={handleLogin} noValidate style={formStyle}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
            {error && (
              <div style={{ color: "red", marginBottom: 20, textAlign: "center" }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: 12,
                width: "100%",
                backgroundColor: "#dc2626",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                border: "none",
                borderRadius: 6,
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Request Help Form */}
        <div
          className="form-container sign-up-container"
          style={{
            ...formContainerStyle,
            left: "50%",
            zIndex: rightPanelActive ? 2 : 1,
            opacity: rightPanelActive ? 1 : 0,
            pointerEvents: rightPanelActive ? "auto" : "none",
            transform: rightPanelActive ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          <img src="/citimaxlogo.png" alt="Citimax Logo" style={logoStyle} />

          <h1 style={{ fontWeight: "bold", marginBottom: 24 }}>Request Help</h1>
          <form
            onSubmit={handleHelpSubmit}
            noValidate
            style={{ ...formStyle, color: "#111" }}
          >
            <input
              type="email"
              placeholder="Your Email"
              value={helpEmail}
              onChange={(e) => setHelpEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <textarea
              placeholder="Describe your issue or request an account"
              value={helpMessage}
              onChange={(e) => setHelpMessage(e.target.value)}
              required
              rows={4}
              style={{ ...inputStyle, resize: "none" }}
            />
            {helpError && (
              <div style={{ color: "red", marginBottom: 20, textAlign: "center" }}>
                {helpError}
              </div>
            )}
            {helpSuccess && (
              <div style={{ color: "green", marginBottom: 20, textAlign: "center" }}>
                {helpSuccess}
              </div>
            )}
            <button
              type="submit"
              style={{
                padding: 12,
                width: "100%",
                backgroundColor: "#dc2626",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                border: "none",
                borderRadius: 6,
              }}
            >
              Send Request
            </button>
          </form>
        </div>

        {/* Overlay */}
        <div
          className="overlay-container"
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: "50%",
            height: "100%",
            overflow: "hidden",
            transition: "transform 0.6s ease-in-out",
            zIndex: 100,
            transform: rightPanelActive ? "translateX(-100%)" : "translateX(0)",
            boxSizing: "border-box",
            padding: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(to right, #dc2626, #ef4444)",
            color: "white",
            textAlign: "center",
          }}
        >
          {!rightPanelActive ? (
            <>
              <h1 style={{ fontWeight: "bold", fontSize: 28, marginBottom: 24 }}>
                Forgot your account?
              </h1>
              <p style={{ fontSize: 16, maxWidth: 300, margin: "0 auto 40px" }}>
                If you forgot your account or want to request a new one, you can do so here.
              </p>
              <button
                className="ghost"
                onClick={() => setRightPanelActive(true)}
                style={{
                  padding: "12px 45px",
                  fontWeight: "bold",
                  borderRadius: 20,
                  border: "2px solid white",
                  backgroundColor: "transparent",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Request Help
              </button>
            </>
          ) : (
            <>
              <h1 style={{ fontWeight: "bold", fontSize: 28, marginBottom: 24 }}>
                Already have an account?
              </h1>
              <p style={{ fontSize: 16, maxWidth: 300, margin: "0 auto 40px" }}>
                Sign in with your email and password to continue.
              </p>
              <button
                className="ghost"
                onClick={() => setRightPanelActive(false)}
                style={{
                  padding: "12px 45px",
                  fontWeight: "bold",
                  borderRadius: 20,
                  border: "2px solid white",
                  backgroundColor: "transparent",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>

      {/* Focus border style */}
      <style jsx>{`
        input:focus,
        textarea:focus {
          border: 1px solid black;
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default Login;
