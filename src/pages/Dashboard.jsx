import { useState } from "react";
import ProblemInput from "../components/Dashboard/ProblemInput";
import AIInsight from "../components/Dashboard/AIInsight";

import { motion } from "framer-motion";

import {
  Brain,
  LayoutDashboard,
  Code2,
  BarChart3,
  History,
  Settings,
  Sparkles,
  ArrowUpRight,
  LogOut,
} from "lucide-react";

import { Link } from "react-router-dom";

function Dashboard() {
  const [analysis, setAnalysis] = useState(null);

  return (
    <div className="dashboard-page">
      <div className="dashboard-background">
        <div className="dashboard-glow dashboard-glow-one" />
        <div className="dashboard-glow dashboard-glow-two" />
        <div className="dashboard-grid" />
      </div>

      <aside className="dashboard-sidebar glass">
        <Link to="/" className="dashboard-logo">
          <div className="dashboard-logo-mark">
            <Brain size={21} />
          </div>

          <span>
            Think<span>Flow</span>
          </span>
        </Link>

        <div className="sidebar-section">
          <span className="sidebar-label">WORKSPACE</span>

          <button className="sidebar-item active">
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button className="sidebar-item">
            <Code2 size={18} />
            Analyze
          </button>

          <button className="sidebar-item">
            <BarChart3 size={18} />
            Insights
          </button>

          <button className="sidebar-item">
            <History size={18} />
            History
          </button>
        </div>

        <div className="sidebar-bottom">
          <button className="sidebar-item">
            <Settings size={18} />
            Settings
          </button>

          <Link to="/" className="sidebar-item logout">
            <LogOut size={18} />
            Log out
          </Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <motion.header
          className="dashboard-header"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="dashboard-eyebrow">
              THINKFLOW / WORKSPACE
            </span>

            <h1>
              Understand how <span>you think.</span>
            </h1>
          </div>

          <div className="dashboard-profile">
            <div className="profile-avatar">S</div>

            <div>
              <strong>Saran</strong>
              <small>Developer</small>
            </div>
          </div>
        </motion.header>

        <motion.section
          className="dashboard-welcome glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="welcome-content">
            <div className="welcome-icon">
              <Sparkles size={22} />
            </div>

            <div>
              <span>AI THINKING ENGINE</span>

              <h2>
                Ready to analyze your
                <br />
                <strong>problem-solving process?</strong>
              </h2>

              <p>
                Submit a problem and your solution. ThinkFlow will
                analyze the reasoning patterns behind your answer.
              </p>
            </div>
          </div>

          <button className="dashboard-primary-button">
            Start analysis
            <ArrowUpRight size={18} />
          </button>
        </motion.section>

        <section className="dashboard-stats">
          <div className="stat-card glass">
            <span>PROBLEMS ANALYZED</span>
            <strong>{analysis ? "25" : "24"}</strong>
            <small>
              {analysis ? "+1 just now" : "+6 this month"}
            </small>
          </div>

          <div className="stat-card glass">
            <span>THINKING SCORE</span>
            <strong>
              {analysis
                ? Math.round(
                    (
                      analysis.metrics.algorithmSelection +
                      analysis.metrics.debugging +
                      analysis.metrics.decomposition +
                      analysis.metrics.optimization
                    ) / 4
                  )
                : 78}
              <span>%</span>
            </strong>

            <small>
              {analysis ? "AI generated" : "↑ 12% improvement"}
            </small>
          </div>

          <div className="stat-card glass">
            <span>AI INSIGHTS</span>
            <strong>{analysis ? "19" : "18"}</strong>
            <small>
              {analysis ? "1 new insight" : "3 new insights"}
            </small>
          </div>
        </section>

        <section className="dashboard-workspace">
          <ProblemInput onAnalysis={setAnalysis} />

          <AIInsight analysis={analysis} />
        </section>
      </main>
    </div>
  );
}

export default Dashboard;