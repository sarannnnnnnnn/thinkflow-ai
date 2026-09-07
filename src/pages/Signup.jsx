import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

function Signup() {
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
        className="auth-card glass signup-card"
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
          <small>GET STARTED</small>

          <h1>
            Start your
            <br />
            <span>thinking journey.</span>
          </h1>

          <p>
            Create your account and discover how you solve problems.
          </p>
        </div>

        <form className="auth-form">

          <div className="auth-field">
            <label>Full name</label>

            <input
              type="text"
              placeholder="Your name"
            />
          </div>

          <div className="auth-field">
            <label>Email</label>

            <input
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="auth-field">
            <label>Password</label>

            <div className="password-input">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
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
            Create account
            <ArrowRight size={17} />
          </button>

        </form>

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