import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-page">

      <div className="background">
        <div className="glow glow-one" />
        <div className="glow glow-two" />
        <div className="glow glow-three" />
        <div className="grid-background" />
        <div className="noise" />
      </div>

      <motion.div
        className="auth-card glass"
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
        }}
      >

        <Link to="/" className="auth-logo">
          <div className="auth-logo-mark">
            <Brain size={22} />
          </div>

          <span>
            Think<span>Flow</span>
          </span>
        </Link>

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

        <form className="auth-form">

          <div className="auth-field">
            <label>Email</label>

            <input
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="auth-field">

            <div className="password-label">
              <label>Password</label>

              <button type="button">
                Forgot password?
              </button>
            </div>

            <div className="password-input">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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

          <button
            type="submit"
            className="auth-submit"
          >
            Sign in
            <ArrowRight size={17} />
          </button>

        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

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