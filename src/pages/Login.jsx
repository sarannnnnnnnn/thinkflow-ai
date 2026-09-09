import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  ArrowRight,
  Eye,
  EyeOff,
  Sun,
  Moon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("thinkflow_theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem(
      "thinkflow_theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((previous) => !previous);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Incorrect email or password."
        );
      }

      // Store JWT and user information for the current session
      sessionStorage.setItem(
        "thinkflow_token",
        data.token
      );

      sessionStorage.setItem(
        "thinkflow_user",
        JSON.stringify(data.user)
      );

      // Login successful
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`auth-page ${
        darkMode ? "auth-dark" : "auth-light"
      }`}
    >
      {/* BACKGROUND */}

      <div className="background">
        <div className="glow glow-one" />
        <div className="glow glow-two" />
        <div className="glow glow-three" />
        <div className="grid-background" />
        <div className="noise" />
      </div>

      {/* THEME BUTTON */}

      <button
        className="auth-theme-button"
        onClick={toggleTheme}
        type="button"
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

        <span>
          {darkMode ? "Light mode" : "Dark mode"}
        </span>
      </button>

      {/* CARD */}

      <motion.div
        className="auth-card glass"
        initial={{
          opacity: 0,
          y: 25,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* LOGO */}

        <Link
          to="/"
          className="auth-logo"
        >
          <div className="auth-logo-mark">
            <Brain size={22} />
          </div>

          <span>
            Think<span>Flow</span>
          </span>
        </Link>

        {/* HEADING */}

        <div className="auth-heading">
          <small>WELCOME BACK</small>

          <h1>
            Sign in to
            <br />
            <span>ThinkFlow.</span>
          </h1>

          <p>
            Continue understanding how you think.
          </p>
        </div>

        {/* FORM */}

        <form
          className="auth-form"
          onSubmit={handleLogin}
        >
          {/* EMAIL */}

          <div className="auth-field">
            <label>Email</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
          </div>

          {/* PASSWORD */}

          <div className="auth-field">
            <div className="password-label">
              <label>Password</label>

              <button
                type="button"
                onClick={() =>
                  setError(
                    "Password reset is not available in this demo."
                  )
                }
              >
                Forgot password?
              </button>
            </div>

            <div className="password-input">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
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

          {/* ERROR */}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}

            {!loading && (
              <ArrowRight size={17} />
            )}
          </button>
        </form>

        {/* DIVIDER */}

        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/* SIGNUP */}

        <p className="auth-switch">
          Don't have an account?

          <Link to="/signup">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;