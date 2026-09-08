import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import { motion } from "framer-motion";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

import {
  ArrowRight,
  Brain,
  Sparkles,
  Activity,
  Target,
  Sun,
  Moon,
} from "lucide-react";

import "./App.css";


/* =========================================================
   CONTACT
   ========================================================= */

const contact = {
  github: "https://github.com/sarannnnnnnnn/",
  linkedin: "https://www.linkedin.com/in/sarannnn",
  email: "mailto:saran16062007@gmail.com",
  phone: "tel:+919597428933",
};


/* =========================================================
   FEATURES
   ========================================================= */

const features = [
  {
    number: "01",
    icon: Activity,
    title: "Observe",
    text: "Track the decisions, attempts and patterns behind every solution.",
  },
  {
    number: "02",
    icon: Brain,
    title: "Understand",
    text: "AI turns your coding behaviour into an understandable thinking profile.",
  },
  {
    number: "03",
    icon: Target,
    title: "Improve",
    text: "Discover exactly what to practise instead of simply solving more problems.",
  },
];


/* =========================================================
   SCROLL
   ========================================================= */

function goTo(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}


/* =========================================================
   METRIC
   ========================================================= */

function Metric({ name, value, progress }) {
  return (
    <div className="metric">

      <div className="metric-heading">
        <span>{name}</span>
        <strong>{value}</strong>
      </div>

      <div className="metric-track">

        <motion.div
          className="metric-progress"
          initial={{ width: 0 }}
          whileInView={{ width: progress }}
          viewport={{ once: true }}
          transition={{
            duration: 1.1,
            ease: "easeOut",
          }}
        />

      </div>

    </div>
  );
}


/* =========================================================
   HOME
   ========================================================= */

function Home() {

  /* -------------------------------------------------------
     THEME
     ------------------------------------------------------- */

  const [darkMode, setDarkMode] = useState(() => {

    const savedTheme =
      localStorage.getItem("thinkflow-theme");

    return savedTheme !== "light";
  });


  /* -------------------------------------------------------
     SAVE THEME
     ------------------------------------------------------- */

  useEffect(() => {

    document.documentElement.classList.toggle(
      "light-mode",
      !darkMode
    );

    localStorage.setItem(
      "thinkflow-theme",
      darkMode ? "dark" : "light"
    );

  }, [darkMode]);


  return (

    <div className="site">

      {/* ===================================================
          BACKGROUND
      ==================================================== */}

      <div className="background">

        <div className="glow glow-one" />
        <div className="glow glow-two" />
        <div className="glow glow-three" />

        <div className="grid-background" />

        <div className="noise" />

      </div>


      {/* ===================================================
          NAVBAR
      ==================================================== */}

      <header className="navbar-container">

        <nav className="navbar glass">

          {/* LOGO */}

          <button
            className="logo"
            onClick={() => goTo("home")}
          >

            <div className="logo-mark">
              <Brain size={22} />
            </div>

            <span className="logo-text">
              Think<span>Flow</span>
            </span>

          </button>


          {/* CENTER NAVIGATION */}

          <div className="nav-center">

            <button
              className="nav-link"
              onClick={() => goTo("home")}
            >
              Home
            </button>

            <button
              className="nav-link"
              onClick={() => goTo("features")}
            >
              Features
            </button>

            <button
              className="nav-link"
              onClick={() => goTo("about")}
            >
              About
            </button>

          </div>


          {/* RIGHT ACTIONS */}

          <div className="nav-actions">

            {/* THEME BUTTON */}

            <button
              className="theme-toggle"
              onClick={() =>
                setDarkMode((previous) => !previous)
              }
              title={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              aria-label={
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


            {/* SIGN IN */}

            <Link
              to="/login"
              className="signin-button"
            >
              Sign in
            </Link>


            {/* GET STARTED */}

            <Link
              to="/signup"
              className="signup-button"
            >
              Get started
            </Link>

          </div>

        </nav>

      </header>


      {/* ===================================================
          MAIN
      ==================================================== */}

      <main>


        {/* =================================================
            HERO
        ================================================= */}

        <section
          id="home"
          className="hero"
        >

          <motion.div
            className="hero-content"

            initial={{
              opacity: 0,
              y: 30,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
          >

            {/* PILL */}

            <div className="hero-pill glass">

              <span className="pulse-dot" />

              AI-powered problem-solving intelligence

            </div>


            {/* TITLE */}

            <h1>

              Understand how

              <br />

              <span>
                you think.
              </span>

            </h1>


            {/* DESCRIPTION */}

            <p className="hero-text">

              ThinkFlow analyses the journey behind your
              coding solutions — not just the final answer.

            </p>


            {/* BUTTON */}

            <div className="hero-actions">

              <button
                className="primary-button"
                onClick={() => goTo("features")}
              >

                Explore ThinkFlow

                <ArrowRight size={18} />

              </button>

            </div>

          </motion.div>


          {/* =================================================
              DASHBOARD PREVIEW
          ================================================= */}

          <motion.div
            className="dashboard-wrapper"

            initial={{
              opacity: 0,
              y: 70,
              scale: 0.97,
            }}

            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}

            transition={{
              duration: 1,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          >

            <div className="dashboard-shadow" />


            <div className="dashboard glass">


              {/* DASHBOARD HEADER */}

              <div className="dashboard-top">

                <div className="traffic-lights">

                  <span />
                  <span />
                  <span />

                </div>


                <div className="dashboard-session">

                  <span />

                  Session active

                </div>

              </div>


              {/* DASHBOARD BODY */}

              <div className="dashboard-content">


                {/* LEFT SIDE */}

                <div className="challenge">

                  <div className="challenge-header">

                    <div>

                      <small>
                        CURRENT CHALLENGE
                      </small>

                      <h2>
                        Two Sum
                      </h2>

                    </div>


                    <div className="difficulty">
                      EASY
                    </div>

                  </div>


                  {/* CODE */}

                  <div className="code-window">

                    <div className="code-line">

                      <span className="line-number">
                        01
                      </span>

                      <span>
                        <b>def</b>{" "}
                        two_sum(nums, target):
                      </span>

                    </div>


                    <div className="code-line">

                      <span className="line-number">
                        02
                      </span>

                      <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;seen = {"{}"}
                      </span>

                    </div>


                    <div className="code-line">

                      <span className="line-number">
                        03
                      </span>

                      <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <b>for</b> i, num{" "}
                        <b>in</b> enumerate(nums):
                      </span>

                    </div>


                    <div className="code-line">

                      <span className="line-number">
                        04
                      </span>

                      <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        complement = target - num
                      </span>

                    </div>


                    <div className="code-line">

                      <span className="line-number">
                        05
                      </span>

                      <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        ...
                      </span>

                    </div>

                  </div>


                  {/* ATTEMPTS */}

                  <div className="attempts">

                    <span>
                      02 attempts
                    </span>

                    <span>
                      01 rewrite
                    </span>

                    <span>
                      04:32
                    </span>

                  </div>

                </div>


                {/* RIGHT SIDE */}

                <div className="thinking">

                  <div className="thinking-header">

                    <div className="ai-symbol">

                      <Sparkles size={20} />

                    </div>


                    <div>

                      <small>
                        THINKFLOW ENGINE
                      </small>

                      <h2>
                        Thinking profile
                      </h2>

                    </div>

                  </div>


                  {/* METRICS */}

                  <div className="metrics">

                    <Metric
                      name="Algorithm selection"
                      value="52%"
                      progress="52%"
                    />

                    <Metric
                      name="Debugging"
                      value="84%"
                      progress="84%"
                    />

                    <Metric
                      name="Decomposition"
                      value="68%"
                      progress="68%"
                    />

                    <Metric
                      name="Optimization"
                      value="46%"
                      progress="46%"
                    />

                  </div>


                  {/* AI INSIGHT */}

                  <div className="ai-insight">

                    <div className="insight-title">

                      <Sparkles size={14} />

                      AI INSIGHT

                    </div>

                    <p>

                      You tend to start implementing before
                      identifying the optimal approach.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>

        </section>


        {/* =================================================
            FEATURES
        ================================================= */}

        <section
          id="features"
          className="features-section"
        >

          <div className="section-intro">

            <span className="section-label">
              FEATURES
            </span>

            <h2>

              See what happens

              <br />

              <span>
                behind the answer.
              </span>

            </h2>

          </div>


          <div className="feature-grid">

            {features.map((feature, index) => {

              const Icon = feature.icon;

              return (

                <motion.article
                  key={feature.number}
                  className="feature-card glass"

                  initial={{
                    opacity: 0,
                    y: 35,
                  }}

                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}

                  viewport={{
                    once: true,
                    margin: "-80px",
                  }}

                  transition={{
                    duration: 0.7,
                    delay: index * 0.1,
                  }}
                >

                  <div className="feature-top">

                    <div className="feature-icon">

                      <Icon size={21} />

                    </div>

                    <span>
                      {feature.number}
                    </span>

                  </div>


                  <h3>
                    {feature.title}
                  </h3>


                  <p>
                    {feature.text}
                  </p>

                </motion.article>

              );

            })}

          </div>

        </section>


        {/* =================================================
            ABOUT
        ================================================= */}

        <section
          id="about"
          className="about-section"
        >

          <div className="about-glow about-glow-left" />

          <div className="about-glow about-glow-right" />


          <div className="about-inner">


            {/* TOP */}

            <div className="about-top">

              <div className="about-number">
                03
              </div>

              <div className="about-heading-line" />

              <div className="about-top-label">
                ABOUT THINKFLOW
              </div>

            </div>


            {/* MAIN */}

            <div className="about-main">


              <div className="about-title">

                <span>
                  Built around
                </span>

                <span className="about-gradient">
                  how you think.
                </span>

              </div>


              <div className="about-copy">

                <p>

                  ThinkFlow explores the journey behind
                  every solution — helping you understand
                  your problem-solving process, not just
                  the final answer.

                </p>


                <div className="about-status">

                  <span className="status-dot" />

                  <span>
                    Problem-solving intelligence
                  </span>

                </div>

              </div>

            </div>


            {/* CONTACT */}

            <div className="about-contact">

              <div className="contact-title">

                <span>
                  LET'S CONNECT
                </span>

                <div />

              </div>


              <div className="contact-grid">


                {/* GITHUB */}

                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-item"
                >

                  <div className="contact-symbol github-symbol">

                    <svg viewBox="0 0 24 24">

                      <path
                        fill="currentColor"
                        d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.1c-3.2.7-3.88-1.54-3.88-1.54-.53-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.25 3.32.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.03 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.74.11 3.03.73.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.04.78 2.1v3.11c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
                      />

                    </svg>

                  </div>


                  <div className="contact-text">

                    <small>
                      GITHUB
                    </small>

                    <strong>
                      sarannnnnnnnn
                    </strong>

                  </div>


                  <span className="contact-arrow">
                    ↗
                  </span>

                </a>


                {/* LINKEDIN */}

                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-item"
                >

                  <div className="contact-symbol linkedin-symbol">

                    <span>
                      in
                    </span>

                  </div>


                  <div className="contact-text">

                    <small>
                      LINKEDIN
                    </small>

                    <strong>
                      sarannnn
                    </strong>

                  </div>


                  <span className="contact-arrow">
                    ↗
                  </span>

                </a>


                {/* EMAIL */}

                <a
                  href={contact.email}
                  className="contact-item"
                >

                  <div className="contact-symbol">

                    <svg viewBox="0 0 24 24">

                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />

                      <path
                        d="M4 7l8 6 8-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />

                    </svg>

                  </div>


                  <div className="contact-text">

                    <small>
                      EMAIL
                    </small>

                    <strong>
                      saran16062007@gmail.com
                    </strong>

                  </div>


                  <span className="contact-arrow">
                    ↗
                  </span>

                </a>


                {/* PHONE */}

                <a
                  href={contact.phone}
                  className="contact-item"
                >

                  <div className="contact-symbol">

                    <svg viewBox="0 0 24 24">

                      <path
                        d="M7.5 3.5l2.1-.5c.6-.1 1.1.2 1.3.8l1 2.6c.2.5 0 1-.4 1.3L10 9c1 2.1 2.7 3.8 4.8 4.8l1.3-1.5c.3-.4.8-.5 1.3-.3l2.6 1c.6.2.9.7.8 1.3l-.5 2.1c-.1.7-.7 1.1-1.4 1.1C11.2 17.5 6.5 12.8 6.5 5c0-.7.4-1.3 1-1.5Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                    </svg>

                  </div>


                  <div className="contact-text">

                    <small>
                      PHONE
                    </small>

                    <strong>
                      +91 95974 28933
                    </strong>

                  </div>


                  <span className="contact-arrow">
                    ↗
                  </span>

                </a>

              </div>

            </div>


            {/* ABOUT FOOTER */}

            <div className="about-footer">

              <span>
                THINKFLOW AI
              </span>

              <span className="footer-center">
                BUILT TO UNDERSTAND THE PROCESS
              </span>

              <span>
                2026
              </span>

            </div>

          </div>

        </section>

      </main>


      {/* ===================================================
          FOOTER
      ==================================================== */}

      <footer className="simple-footer">

        <span>
          Designed &amp; Developed by Saran
        </span>

        <span className="footer-dot">
          •
        </span>

        <span>
          ThinkFlow AI
        </span>

      </footer>

    </div>
  );
}


/* =========================================================
   APP / ROUTES
   ========================================================= */

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

      </Routes>

    </BrowserRouter>

  );
}


export default App;