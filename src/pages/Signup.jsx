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

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
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

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create account."
        );
      }

      // Store only authentication information temporarily.
      // User account itself is stored in PostgreSQL.
      sessionStorage.setItem(
        "thinkflow_token",
        data.token
      );

      sessionStorage.setItem(
        "thinkflow_user",
        JSON.stringify(data.user)
      );

      navigate("/dashboard");

    } catch (error) {
      console.error("Signup error:", error);

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
          {darkMode
            ? "Light mode"
            : "Dark mode"}
        </span>
      </button>


      {/* CARD */}

      <motion.div
        className="auth-card glass signup-card"
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

          <small>
            GET STARTED
          </small>

          <h1>
            Start your
            <br />
            <span>
              thinking journey.
            </span>
          </h1>

          <p>
            Create your account and discover
            how you solve problems.
          </p>

        </div>


        {/* FORM */}

        <form
          className="auth-form"
          onSubmit={handleSignup}
        >

          {/* NAME */}

          <div className="auth-field">

            <label>
              Full name
            </label>

            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>


          {/* EMAIL */}

          <div className="auth-field">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>


          {/* PASSWORD */}

          <div className="auth-field">

            <label>
              Password
            </label>

            <div className="password-input">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
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
            {loading
              ? "Creating account..."
              : "Create account"}

            {!loading && (
              <ArrowRight size={17} />
            )}
          </button>

        </form>


        {/* LOGIN */}

        <p className="auth-switch">

          Already have an account?

          <Link to="/login">
            Sign in
          </Link>

        </p>

      </motion.div>

    </div>
  );
}

export default Signup;