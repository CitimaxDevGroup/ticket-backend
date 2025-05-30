import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login: React.FC = () => {
  // --- Login states ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Request Help form states ---
  const [helpEmail, setHelpEmail] = useState("");
  const [helpMessage, setHelpMessage] = useState("");
  const [helpError, setHelpError] = useState("");
  const [helpSuccess, setHelpSuccess] = useState("");

  // Toggle form view
  const [rightPanelActive, setRightPanelActive] = useState(false);

  // Handle user login with Firebase Auth
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Successful login - you can redirect or update UI here
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle help request submission to Google Sheets via Apps Script
  const handleHelpSubmit = async (e: React.FormEvent) => {
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

    try {
      // Prepare data as URL encoded form
      const data = {
        email: helpEmail,
        message: helpMessage,
      };

      // Convert to x-www-form-urlencoded format
      const formBody = new URLSearchParams(data).toString();

      await fetch(
        "https://script.google.com/macros/s/AKfycbyBPusqS7raGi_x1-JsIBMEIjzNcFI0Ix878ij7WqR3cZhvTqeFys6cUdc0yor_0z84rw/exec", // <-- Replace YOUR_SCRIPT_ID with your Apps Script URL
        {
          method: "POST",
          mode: "no-cors", // Important to avoid CORS errors
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formBody,
        }
      );

      // Because of no-cors, we can't read the response; assume success if no error thrown
      setHelpSuccess("Your request has been submitted. We'll get back to you soon.");
      setHelpEmail("");
      setHelpMessage("");
    } catch (error) {
      console.error("Error submitting request:", error);
      setHelpError("Failed to submit request. Please try again later.");
    }
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
        style={{
          backgroundColor: "#fff",
          borderRadius: 10,
          boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
          position: "relative",
          overflow: "hidden",
          width: 900,
          maxWidth: "100%",
          minHeight: 600,
          display: "flex",
        }}
      >
        {/* Sign In Form */}
        <div
          className="form-container sign-in-container"
          style={{
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
            zIndex: rightPanelActive ? 1 : 2,
            transform: rightPanelActive ? "translateX(100%)" : "translateX(0)",
            left: 0,
          }}
        >
          <img
            src="/citimaxlogo.png"
            alt="Citimax Logo"
            style={{
              display: "block",
              margin: "0 auto 24px auto",
              maxWidth: 150,
              height: "auto",
            }}
          />

          <h1 style={{ fontWeight: "bold", marginBottom: 24 }}>Sign In</h1>
          <form onSubmit={handleLogin} noValidate style={{ width: "100%", maxWidth: 280 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                marginBottom: 20,
                padding: 12,
                width: "100%",
                border: "1px solid black",
                borderRadius: 4,
                outline: "none",
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                marginBottom: 20,
                padding: 12,
                width: "100%",
                border: "1px solid black",
                borderRadius: 4,
                outline: "none",
              }}
            />
            {error && (
              <div style={{ color: "red", marginBottom: 20, textAlign: "center" }}>{error}</div>
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
            position: "absolute",
            top: 0,
            left: "50%",
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
            left: "50%",
            zIndex: rightPanelActive ? 2 : 1,
            opacity: rightPanelActive ? 1 : 0,
            pointerEvents: rightPanelActive ? "auto" : "none",
            transform: rightPanelActive ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          <img
            src="/citimaxlogo.png"
            alt="Citimax Logo"
            style={{
              display: "block",
              margin: "0 auto 24px auto",
              maxWidth: 150,
              height: "auto",
            }}
          />

          <h1 style={{ fontWeight: "bold", marginBottom: 24 }}>Request Help</h1>
          <form onSubmit={handleHelpSubmit} noValidate style={{ width: "100%", maxWidth: 280 }}>
            <input
              type="email"
              placeholder="Your Email"
              value={helpEmail}
              onChange={(e) => setHelpEmail(e.target.value)}
              required
              style={{
                marginBottom: 20,
                padding: 12,
                width: "100%",
                border: "1px solid black",
                borderRadius: 4,
                outline: "none",
              }}
            />
            <textarea
              placeholder="Describe your issue or request an account"
              value={helpMessage}
              onChange={(e) => setHelpMessage(e.target.value)}
              required
              rows={4}
              style={{
                marginBottom: 20,
                padding: 12,
                width: "100%",
                border: "1px solid black",
                borderRadius: 4,
                outline: "none",
                resize: "none",
              }}
            />
            {helpError && (
              <div style={{ color: "red", marginBottom: 20, textAlign: "center" }}>{helpError}</div>
            )}
            {helpSuccess && (
              <div style={{ color: "green", marginBottom: 20, textAlign: "center" }}>{helpSuccess}</div>
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
              <h1 style={{ fontWeight: "bold", fontSize: 28, marginBottom: 24 }}>Need Help?</h1>
              <p style={{ fontSize: 16, marginBottom: 24 }}>
                You can request a new account or report an issue here.
              </p>
              <button
                onClick={() => setRightPanelActive(true)}
                style={{
                  padding: 12,
                  backgroundColor: "transparent",
                  border: "2px solid white",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                  borderRadius: 6,
                  width: 180,
                }}
              >
                Request Help
              </button>
            </>
          ) : (
            <>
              <h1 style={{ fontWeight: "bold", fontSize: 28, marginBottom: 24 }}>Back to Login</h1>
              <p style={{ fontSize: 16, marginBottom: 24 }}>Remember your login? Sign in here.</p>
              <button
                onClick={() => setRightPanelActive(false)}
                style={{
                  padding: 12,
                  backgroundColor: "transparent",
                  border: "2px solid white",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                  borderRadius: 6,
                  width: 180,
                }}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
