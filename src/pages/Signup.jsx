import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Lock,
  Mail,
  User,
  AlertCircle,
} from "lucide-react";
import Toast from "../components/Common/Toast";

function Signup() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("thinkflow_theme") === "dark";
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      "thinkflow_theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }

      const response = await fetch(
        `${apiUrl}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to create account."
        );
      }

      if (!data?.token) {
        throw new Error(
          "Account created, but no authentication token was received."
        );
      }

      // Do NOT store the token here â€” user must log in manually.
      // Remove any stale session data that might have been set.
      sessionStorage.removeItem("thinkflow_token");
      sessionStorage.removeItem("thinkflow_user");

      setToast({
        type: "success",
        title: "Account created successfully!",
        message: "Please log in to continue.",
        duration: 2800,
      });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Signup error:", err);

      setError(
        err?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`auth-page ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          darkMode={darkMode}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}

      {/* BACKGROUND */}

      <div className="auth-background">
        <div className="auth-glow auth-glow-one" />
        <div className="auth-glow auth-glow-two" />
        <div className="auth-grid" />
      </div>

      {/* BACK */}

      <button
        type="button"
        className="auth-back-button"
        onClick={() => navigate("/")}
        disabled={loading}
      >
        <ArrowLeft size={17} />
        Back
      </button>

      {/* THEME */}

      <button
        type="button"
        className="auth-theme-button"
        onClick={() =>
          setDarkMode((previous) => !previous)
        }
        aria-label="Toggle theme"
        title={
          darkMode
            ? "Switch to light mode"
            : "Switch to dark mode"
        }
      >
        {darkMode ? (
          <Sun size={18} />
        ) : (
          <Moon size={18} />
        )}
      </button>

      {/* CONTENT */}

      <main className="auth-container">
        <div className="auth-card signup-card">

          {/* LOGO */}

          <Link
            to="/"
            className="auth-logo"
            style={{ textDecoration: "none" }}
          >
            <div className="auth-logo-icon">
              <Brain size={22} />
            </div>

            <span>
              Think<span>Flow</span>
            </span>
          </Link>

          {/* HEADING */}

          <div className="auth-heading">
            <span className="auth-label">
              GET STARTED
            </span>

            <h1>Create your account.</h1>

            <p>
              Start understanding how you think
              and solve problems.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div
              className="auth-error"
              role="alert"
            >
              <AlertCircle size={17} />
              <span>{error}</span>
            </div>
          )}

          {/* FORM */}

          <form
            className="auth-form"
            onSubmit={handleSignup}
          >

            {/* NAME */}

            <div className="auth-field">
              <label htmlFor="name">
                Full name
              </label>

              <div className="auth-input-wrapper">
                <User size={17} />

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);

                    if (error) {
                      setError("");
                    }
                  }}
                  autoComplete="name"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}

            <div className="auth-field">
              <label htmlFor="email">
                Email address
              </label>

              <div className="auth-input-wrapper">
                <Mail size={17} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    if (error) {
                      setError("");
                    }
                  }}
                  autoComplete="email"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="auth-field">
              <label htmlFor="password">
                Password
              </label>

              <div className="auth-input-wrapper">
                <Lock size={17} />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);

                    if (error) {
                      setError("");
                    }
                  }}
                  autoComplete="new-password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* LOGIN */}

          <div className="auth-switch">
            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign in
            </Link>
          </div>

          {/* FOOTER */}

          <div className="auth-footer">
            <span>THINKFLOW AI</span>
            <span>â€¢</span>
            <span>
              UNDERSTAND THE PROCESS
            </span>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Signup;