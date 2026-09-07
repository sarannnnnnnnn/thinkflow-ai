import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import "./App.css";


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
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";

const contact = {
  github: "https://github.com/sarannnnnnnnn/",
  linkedin: "https://www.linkedin.com/in/sarannnn",
  email: "mailto:saran16062007@gmail.com",
  phone: "tel:9597428933",
};

function GithubIcon({ size = 19 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.81 1.3 3.5.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

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

function goTo(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

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
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="site">

      {/* BACKGROUND */}
      <div className="background">
        <div className="glow glow-one" />
        <div className="glow glow-two" />
        <div className="glow glow-three" />
        <div className="grid-background" />
        <div className="noise" />
      </div>


      {/* =====================================================
          NAVBAR
      ====================================================== */}

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


          {/* RIGHT BUTTONS */}

          <div className="nav-actions">

            <Link to="/login" className="signin-button">
              Sign in
            </Link>

            <Link to="/signup" className="signup-button">
              Get started
            </Link>

          </div>

        </nav>
      </header>


      <main>

        {/* ===================================================
            HOME
        ==================================================== */}

        <section id="home" className="hero">

          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
          >

            <div className="hero-pill glass">
              <span className="pulse-dot" />
              AI-powered problem-solving intelligence
            </div>


            <h1>
              Understand how
              <br />
              <span>you think.</span>
            </h1>


            <p className="hero-text">
              ThinkFlow analyses the journey behind your
              coding solutions — not just the final answer.
            </p>


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


          {/* DASHBOARD */}

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


              <div className="dashboard-content">

                {/* LEFT */}

                <div className="challenge">

                  <div className="challenge-header">

                    <div>
                      <small>CURRENT CHALLENGE</small>
                      <h2>Two Sum</h2>
                    </div>

                    <div className="difficulty">
                      EASY
                    </div>

                  </div>


                  <div className="code-window">

                    <div className="code-line">
                      <span className="line-number">01</span>
                      <span>
                        <b>def</b> two_sum(nums, target):
                      </span>
                    </div>

                    <div className="code-line">
                      <span className="line-number">02</span>
                      <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;seen = {"{}"}
                      </span>
                    </div>

                    <div className="code-line">
                      <span className="line-number">03</span>
                      <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <b>for</b> i, num <b>in</b> enumerate(nums):
                      </span>
                    </div>

                    <div className="code-line">
                      <span className="line-number">04</span>
                      <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        complement = target - num
                      </span>
                    </div>

                    <div className="code-line">
                      <span className="line-number">05</span>
                      <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...
                      </span>
                    </div>

                  </div>


                  <div className="attempts">
                    <span>02 attempts</span>
                    <span>01 rewrite</span>
                    <span>04:32</span>
                  </div>

                </div>


                {/* RIGHT */}

                <div className="thinking">

                  <div className="thinking-header">

                    <div className="ai-symbol">
                      <Sparkles size={20} />
                    </div>

                    <div>
                      <small>THINKFLOW ENGINE</small>
                      <h2>Thinking profile</h2>
                    </div>

                  </div>


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


        {/* ===================================================
            FEATURES
        ==================================================== */}

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
              <span>behind the answer.</span>
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

{/* ================= ABOUT ================= */}
<section id="about" className="about-section">

  <div className="about-glow about-glow-left"></div>
  <div className="about-glow about-glow-right"></div>

  <div className="about-inner">

    {/* TOP LABEL */}
    <div className="about-top">
      <div className="about-number">03</div>

      <div className="about-heading-line"></div>

      <div className="about-top-label">
        ABOUT THINKFLOW
      </div>
    </div>


    {/* MAIN INTRO */}
    <div className="about-main">

      <div className="about-title">
        <span>Built around</span>
        <span className="about-gradient">how you think.</span>
      </div>

      <div className="about-copy">
        <p>
          ThinkFlow explores the journey behind every solution —
          helping you understand your problem-solving process,
          not just the final answer.
        </p>

        <div className="about-status">
          <span className="status-dot"></span>
          <span>Problem-solving intelligence</span>
        </div>
      </div>

    </div>


    {/* CONTACT AREA */}
    <div className="about-contact">

      <div className="contact-title">
        <span>LET'S CONNECT</span>
        <div></div>
      </div>


      <div className="contact-grid">

        {/* GITHUB */}
        <a
          href="https://github.com/sarannnnnnnnn/"
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
            <small>GITHUB</small>
            <strong>sarannnnnnnnn</strong>
          </div>

          <span className="contact-arrow">↗</span>

        </a>


        {/* LINKEDIN */}
        <a
          href="https://www.linkedin.com/in/sarannnn"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-item"
        >

          <div className="contact-symbol linkedin-symbol">
            <span>in</span>
          </div>

          <div className="contact-text">
            <small>LINKEDIN</small>
            <strong>sarannnn</strong>
          </div>

          <span className="contact-arrow">↗</span>

        </a>


        {/* EMAIL */}
        <a
          href="mailto:saran16062007@gmail.com"
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
            <small>EMAIL</small>
            <strong>saran16062007@gmail.com</strong>
          </div>

          <span className="contact-arrow">↗</span>

        </a>


        {/* PHONE */}
        <a
          href="tel:+919597428933"
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
            <small>PHONE</small>
            <strong>+91 95974 28933</strong>
          </div>

          <span className="contact-arrow">↗</span>

        </a>

      </div>

    </div>


    {/* BOTTOM */}
    <div className="about-footer">

      <span>THINKFLOW AI</span>

      <span className="footer-center">
        BUILT TO UNDERSTAND THE PROCESS
      </span>

      <span>2026</span>

    </div>

  </div>

</section>

      </main>


      <footer className="simple-footer">
  <span>Designed &amp; Developed by Saran</span>
  <span className="footer-dot">•</span>
  <span>ThinkFlow AI </span>
</footer>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/dashboard" element={<Dashboard />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;