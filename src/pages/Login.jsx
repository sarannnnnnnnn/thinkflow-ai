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
  AlertCircle,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("thinkflow_theme") === "dark";
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "thinkflow_theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }

      const response = await fetch(
        `${apiUrl}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
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
          data?.error ||
            "Incorrect email or password."
        );
      }

      if (!data?.token) {
        throw new Error(
          "Login failed. No authentication token was received."
        );
      }

      sessionStorage.setItem(
        "thinkflow_token",
        data.token
      );

      if (data.user) {
        sessionStorage.setItem(
          "thinkflow_user",
          JSON.stringify(data.user)
        );
      }

      const savedToken =
        sessionStorage.getItem("thinkflow_token");

      if (!savedToken) {
        throw new Error(
          "Unable to create your login session."
        );
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setError(
      "Password reset is not available yet."
    );
  };

  return (
    <div
      className={`auth-page ${
        darkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <div className="auth-background">
        <div className="auth-glow auth-glow-one" />
        <div className="auth-glow auth-glow-two" />
        <div className="auth-grid" />
      </div>

      <button
        type="button"
        className="auth-back-button"
        onClick={() => navigate("/")}
        disabled={loading}
      >
        <ArrowLeft size={17} />
        Back
      </button>

      <button
        type="button"
        className="auth-theme-button"
        onClick={() =>
          setDarkMode((prev) => !prev)
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

      <main className="auth-container">
        <div className="auth-card">

          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Brain size={22} />
            </div>

            <span>
              Think<span>Flow</span>
            </span>
          </div>

          <div className="auth-heading">
            <span className="auth-label">
              THINKFLOW AI
            </span>

            <h1>Welcome back.</h1>

            <p>
              Sign in to continue understanding
              how you think.
            </p>
          </div>

          {error && (
            <div
              className="auth-error"
              role="alert"
            >
              <AlertCircle size={17} />
              <span>{error}</span>
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={handleLogin}
          >
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

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>

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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);

                    if (error) {
                      setError("");
                    }
                  }}
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
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

            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-switch">
            <span>
              Don't have an account?
            </span>

            <Link to="/signup">
              Create one
            </Link>
          </div>

          <div className="auth-footer">
            <span>THINKFLOW AI</span>
            <span>•</span>
            <span>
              UNDERSTAND THE PROCESS
            </span>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Login;