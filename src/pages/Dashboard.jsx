import { useEffect, useState } from "react";

import ProblemInput from "../components/Dashboard/ProblemInput";
import AIInsight from "../components/Dashboard/AIInsight";

import {
  Brain,
  Code2,
  BarChart3,
  History,
  LogOut,
  Trash2,
  Sun,
  Moon,
} from "lucide-react";

import { Link } from "react-router-dom";

function Dashboard() {
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme =
      localStorage.getItem("thinkflow_theme");

    return savedTheme === "dark";
  });

  /* ==================================================
     LOAD HISTORY
     ================================================== */

  useEffect(() => {
    const savedHistory =
      localStorage.getItem("thinkflow_history");

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  /* ==================================================
     SAVE THEME
     ================================================== */

  useEffect(() => {
    localStorage.setItem(
      "thinkflow_theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  /* ==================================================
     ANALYSIS
     ================================================== */

  const handleAnalysis = (result) => {
    setAnalysis(result);

    const newItem = {
      id: Date.now(),

      thinkingPattern:
        result.thinkingPattern,

      summary:
        result.summary,

      observation:
        result.observation,

      metrics:
        result.metrics,

      strengths:
        result.strengths,

      improvements:
        result.improvements,

      createdAt:
        new Date().toLocaleString(),
    };

    const updatedHistory = [
      newItem,
      ...history,
    ];

    setHistory(updatedHistory);

    localStorage.setItem(
      "thinkflow_history",
      JSON.stringify(updatedHistory)
    );

    setTimeout(() => {
      document
        .getElementById("insights")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 200);
  };

  /* ==================================================
     LOAD OLD ANALYSIS
     ================================================== */

  const loadAnalysis = (item) => {
    setAnalysis(item);

    setTimeout(() => {
      document
        .getElementById("insights")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  /* ==================================================
     CLEAR HISTORY
     ================================================== */

  const clearHistory = () => {
    setHistory([]);

    localStorage.removeItem(
      "thinkflow_history"
    );

    setAnalysis(null);
  };

  /* ==================================================
     NAVIGATION
     ================================================== */

  const scrollToSection = (id) => {
  const section = document.getElementById(id);

  if (!section) return;

  const offset = -10;

  const sectionPosition =
    section.getBoundingClientRect().top +
    window.scrollY -
    offset;

  window.scrollTo({
    top: sectionPosition,
    behavior: "smooth",
  });
};

  /* ==================================================
     THEME
     ================================================== */

  const toggleTheme = () => {
    setDarkMode((previous) => !previous);
  };

  /* ==================================================
     LOGOUT
     ================================================== */

  const openLogoutPopup = () => {
    setShowLogoutPopup(true);
  };

  const closeLogoutPopup = () => {
    setShowLogoutPopup(false);
  };

  const confirmLogout = () => {
    setShowLogoutPopup(false);

    localStorage.removeItem("thinkflow_theme");

    window.location.href = "/";
  };

  return (
    <>
      {/* ==================================================
          THEME STYLES
          ================================================== */}

      <style>{`

        /* ==============================
           LIGHT MODE
           ============================== */

        .dashboard-page.light-mode {
          background: #f7f8fc !important;
          color: #111827 !important;
        }

        .dashboard-page.light-mode
        .dashboard-sidebar {
          background: #ffffff !important;
          border-color: #e5e7eb !important;
          box-shadow:
            0 10px 40px rgba(15, 23, 42, 0.05);
        }

        .dashboard-page.light-mode
        .dashboard-main {
          background: transparent !important;
        }

        .dashboard-page.light-mode
        .dashboard-logo {
          color: #111827 !important;
        }

        .dashboard-page.light-mode
        .sidebar-label {
          color: #9ca3af !important;
        }

        .dashboard-page.light-mode
        .sidebar-item {
          color: #6b7280 !important;
        }

        .dashboard-page.light-mode
        .sidebar-item:hover {
          background: #f3f4f6 !important;
          color: #111827 !important;
        }

        .dashboard-page.light-mode
        .sidebar-item.active {
          background: #eef2ff !important;
          color: #4338ca !important;
          border-color: #c7d2fe !important;
        }

        .dashboard-page.light-mode
        .dashboard-eyebrow {
          color: #6366f1 !important;
        }

        .dashboard-page.light-mode
        .simple-dashboard-header h1 {
          color: #111827 !important;
        }

        .dashboard-page.light-mode
        .dashboard-profile strong {
          color: #111827 !important;
        }

        .dashboard-page.light-mode
        .dashboard-profile small {
          color: #6b7280 !important;
        }

        .dashboard-page.light-mode
        .problem-input-card,
        .dashboard-page.light-mode
        .ai-insight-card,
        .dashboard-page.light-mode
        .history-section {
          background: #ffffff !important;
          border-color: #e5e7eb !important;
          box-shadow:
            0 10px 35px rgba(15, 23, 42, 0.04);
        }

        .dashboard-page.light-mode
        .problem-editor-title h2,
        .dashboard-page.light-mode
        .ai-insight-title h2,
        .dashboard-page.light-mode
        .history-header h2 {
          color: #111827 !important;
        }

        .dashboard-page.light-mode
        .problem-editor-title span,
        .dashboard-page.light-mode
        .ai-insight-title span {
          color: #9ca3af !important;
        }

        .dashboard-page.light-mode
        .problem-question label,
        .dashboard-page.light-mode
        .code-editor-label label {
          color: #6b7280 !important;
        }

        .dashboard-page.light-mode
        .problem-question input {
          background: #f9fafb !important;
          border-color: #e5e7eb !important;
          color: #111827 !important;
        }

        .dashboard-page.light-mode
        .problem-question input:focus {
          border-color: #6366f1 !important;
          background: #ffffff !important;
        }

        .dashboard-page.light-mode
        .problem-question input::placeholder {
          color: #9ca3af !important;
        }

        .dashboard-page.light-mode
        .code-editor {
          background: #ffffff !important;
          border-color: #dfe3ea !important;
        }

        .dashboard-page.light-mode
        .line-numbers {
          background: #f6f8fa !important;
          border-color: #e1e4e8 !important;
          color: #8c959f !important;
        }

        .dashboard-page.light-mode
        .code-area {
          background: #ffffff !important;
        }

        .dashboard-page.light-mode
        .code-highlight {
          color: #24292f !important;
        }

        .dashboard-page.light-mode
        .ai-insight-card {
          color: #111827 !important;
        }

        .dashboard-page.light-mode
        .history-item {
          background: #f9fafb !important;
          border-color: #e5e7eb !important;
        }

        .dashboard-page.light-mode
        .history-item:hover {
          background: #f3f4f6 !important;
          border-color: #c7d2fe !important;
        }

        .dashboard-page.light-mode
        .history-item strong {
          color: #111827 !important;
        }

        .dashboard-page.light-mode
        .history-item p {
          color: #6b7280 !important;
        }

        .dashboard-page.light-mode
        .history-item small {
          color: #9ca3af !important;
        }

        .dashboard-page.light-mode
        .history-empty {
          background: #ffffff !important;
          border-color: #e5e7eb !important;
        }


        /* ==============================
           DARK MODE
           ============================== */

        .dashboard-page.dark-mode {
          background: #070a18 !important;
          color: #f8fafc !important;
        }

        .dashboard-page.dark-mode
        .dashboard-sidebar {
          background: #0c1022 !important;
          border-color: #202743 !important;
        }

        .dashboard-page.dark-mode
        .dashboard-logo {
          color: #f8fafc !important;
        }

        .dashboard-page.dark-mode
        .sidebar-label {
          color: #64748b !important;
        }

        .dashboard-page.dark-mode
        .sidebar-item {
          color: #94a3b8 !important;
        }

        .dashboard-page.dark-mode
        .sidebar-item:hover {
          background: #151a35 !important;
          color: #ffffff !important;
        }

        .dashboard-page.dark-mode
        .sidebar-item.active {
          background: #181d45 !important;
          color: #ffffff !important;
          border-color: #343a82 !important;
        }

        .dashboard-page.dark-mode
        .dashboard-eyebrow {
          color: #818cf8 !important;
        }

        .dashboard-page.dark-mode
        .simple-dashboard-header h1 {
          color: #f8fafc !important;
        }

        .dashboard-page.dark-mode
        .dashboard-profile strong {
          color: #f8fafc !important;
        }

        .dashboard-page.dark-mode
        .dashboard-profile small {
          color: #64748b !important;
        }

        .dashboard-page.dark-mode
        .problem-input-card,
        .dashboard-page.dark-mode
        .ai-insight-card,
        .dashboard-page.dark-mode
        .history-section {
          background: #0c1022 !important;
          border-color: #202743 !important;
          box-shadow: none !important;
        }

        .dashboard-page.dark-mode
        .problem-editor-title h2,
        .dashboard-page.dark-mode
        .ai-insight-title h2,
        .dashboard-page.dark-mode
        .history-header h2 {
          color: #f8fafc !important;
        }

        .dashboard-page.dark-mode
        .problem-editor-title span,
        .dashboard-page.dark-mode
        .ai-insight-title span {
          color: #64748b !important;
        }

        .dashboard-page.dark-mode
        .problem-question label,
        .dashboard-page.dark-mode
        .code-editor-label label {
          color: #64748b !important;
        }

        .dashboard-page.dark-mode
        .problem-question input {
          background: #070a18 !important;
          border-color: #252b46 !important;
          color: #f8fafc !important;
        }

        .dashboard-page.dark-mode
        .problem-question input:focus {
          border-color: #6366f1 !important;
        }

        .dashboard-page.dark-mode
        .problem-question input::placeholder {
          color: #64748b !important;
        }

        .dashboard-page.dark-mode
        .code-editor {
          background: #070a18 !important;
          border-color: #252b46 !important;
        }

        .dashboard-page.dark-mode
        .line-numbers {
          background: #0c1022 !important;
          border-color: #252b46 !important;
          color: #64748b !important;
        }

        .dashboard-page.dark-mode
        .code-area {
          background: #070a18 !important;
        }

        .dashboard-page.dark-mode
        .code-highlight {
          color: #f8fafc !important;
        }

        .dashboard-page.dark-mode
        .history-item {
          background: #10152b !important;
          border-color: #252b46 !important;
        }

        .dashboard-page.dark-mode
        .history-item:hover {
          background: #171c38 !important;
          border-color: #3b4380 !important;
        }

        .dashboard-page.dark-mode
        .history-item strong {
          color: #f8fafc !important;
        }

        .dashboard-page.dark-mode
        .history-item p {
          color: #94a3b8 !important;
        }

        .dashboard-page.dark-mode
        .history-item small {
          color: #64748b !important;
        }

        .dashboard-page.dark-mode
        .history-empty {
          background: #0c1022 !important;
          border-color: #252b46 !important;
        }


        /* ==============================
           THEME BUTTON
           ============================== */

        .thinkflow-theme-button {
          width: 100%;

          display: flex;
          align-items: center;
          gap: 12px;

          padding: 12px 14px;

          margin-bottom: 8px;

          border-radius: 10px;

          border: 1px solid transparent;

          font-family: "Poppins", sans-serif;

          font-size: 13px;

          font-weight: 500;

          cursor: pointer;

          transition:
            background 0.25s ease,
            color 0.25s ease,
            border 0.25s ease;

          background: transparent;

          text-align: left;
        }

        .thinkflow-theme-button:hover {
          transform: none;
        }

        .light-mode
        .thinkflow-theme-button {
          color: #6b7280;
          border-color: #e5e7eb;
          background: #ffffff;
        }

        .light-mode
        .thinkflow-theme-button:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .dark-mode
        .thinkflow-theme-button {
          color: #94a3b8;
          border-color: #252b46;
          background: #10152b;
        }

        .dark-mode
        .thinkflow-theme-button:hover {
          background: #181e38;
          color: #ffffff;
        }

        .thinkflow-theme-button svg {
          color: #6366f1;
          flex-shrink: 0;
        }


        /* ==============================
           LOGOUT POPUP
           ============================== */

        .logout-overlay {
          position: fixed;
          inset: 0;

          z-index: 9999;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 20px;

          background: rgba(3, 6, 18, 0.72);

          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .logout-popup {
          width: 100%;
          max-width: 390px;

          padding: 30px;

          box-sizing: border-box;

          border: 1px solid #282f4b;
          border-radius: 18px;

          background: #0d1225;

          box-shadow:
            0 25px 80px rgba(0, 0, 0, 0.45);

          text-align: center;

          animation: logoutPopupIn 0.2s ease;
        }

        @keyframes logoutPopupIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .logout-popup-icon {
          width: 46px;
          height: 46px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin: 0 auto 18px;

          border-radius: 12px;

          background: #211827;

          color: #a78bfa;
        }

        .logout-popup h3 {
          margin: 0 0 8px;

          color: #f8fafc;

          font-size: 20px;
          font-weight: 700;
        }

        .logout-popup p {
          margin: 0 auto 25px;

          color: #8993ad;

          font-size: 13px;
          line-height: 1.6;
        }

        .logout-popup-actions {
          display: flex;
          gap: 10px;
        }

        .logout-popup-actions button {
          flex: 1;

          height: 42px;

          border-radius: 9px;

          font-family: inherit;
          font-size: 12px;
          font-weight: 600;

          cursor: pointer;
        }

        .logout-cancel-button {
          border: 1px solid #2a314b;

          background: #151a2e;

          color: #a0a9bf;
        }

        .logout-cancel-button:hover {
          background: #1b2138;
          color: #ffffff;
        }

        .logout-confirm-button {
          border: 0;

          background: #635bdf;

          color: #ffffff;
        }

        .logout-confirm-button:hover {
          background: #7169ee;
        }


        /* ==============================
           LIGHT MODE LOGOUT
           ============================== */

        .dashboard-page.light-mode
        .logout-overlay {
          background: rgba(15, 23, 42, 0.35);
        }

        .dashboard-page.light-mode
        .logout-popup {
          background: #ffffff;

          border-color: #e5e7eb;

          box-shadow:
            0 25px 70px rgba(15, 23, 42, 0.18);
        }

        .dashboard-page.light-mode
        .logout-popup-icon {
          background: #f0efff;
          color: #5b54d6;
        }

        .dashboard-page.light-mode
        .logout-popup h3 {
          color: #111827;
        }

        .dashboard-page.light-mode
        .logout-popup p {
          color: #6b7280;
        }

        .dashboard-page.light-mode
        .logout-cancel-button {
          background: #f9fafb;
          border-color: #e5e7eb;
          color: #6b7280;
        }

        .dashboard-page.light-mode
        .logout-cancel-button:hover {
          background: #f3f4f6;
          color: #111827;
        }


        /* ==============================
           SMOOTH TRANSITION
           ============================== */

        .dashboard-page,
        .dashboard-page * {
          transition:
            background-color 0.25s ease,
            border-color 0.25s ease,
            color 0.25s ease;
        }

        .analyze-button,
        .reset-button,
        .sidebar-item,
        .history-item,
        .thinkflow-theme-button {
          transition: all 0.25s ease !important;
        }

      `}</style>


      {/* ==================================================
          DASHBOARD
          ================================================== */}

      <div
        className={`dashboard-page ${
          darkMode
            ? "dark-mode"
            : "light-mode"
        }`}
      >

        {/* ==================================================
            SIDEBAR
            ================================================== */}

        <aside className="dashboard-sidebar">

          {/* LOGO */}

          <Link
            to="/"
            className="dashboard-logo"
          >
            <div className="dashboard-logo-mark">
              <Brain size={20} />
            </div>

            <span>
              Think<span>Flow</span>
            </span>
          </Link>


          {/* WORKSPACE */}

          <div className="sidebar-section">

            <span className="sidebar-label">
              WORKSPACE
            </span>


            {/* ANALYZE */}

            <button
              className="sidebar-item active"
              onClick={() =>
                scrollToSection("analyze")
              }
            >
              <Code2 size={17} />

              Analyze
            </button>


            {/* INSIGHTS */}

            <button
              className="sidebar-item"
              onClick={() =>
                scrollToSection("insights")
              }
            >
              <BarChart3 size={17} />

              Insights
            </button>


            {/* HISTORY */}

            <button
              className="sidebar-item"
              onClick={() =>
                scrollToSection("history")
              }
            >
              <History size={17} />

              History
            </button>

          </div>


          {/* SIDEBAR BOTTOM */}

          <div className="sidebar-bottom">

            {/* THEME */}

            <button
              className="thinkflow-theme-button"
              onClick={toggleTheme}
              title={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >

              {darkMode ? (
                <Sun size={17} />
              ) : (
                <Moon size={17} />
              )}

              <span>
                {darkMode
                  ? "Light mode"
                  : "Dark mode"}
              </span>

            </button>


            {/* LOGOUT */}

            <button
              className="sidebar-item"
              onClick={openLogoutPopup}
            >
              <LogOut size={17} />

              Log out
            </button>

          </div>

        </aside>


        {/* ==================================================
            MAIN
            ================================================== */}

        <main className="dashboard-main">

          {/* HEADER */}

          <header className="simple-dashboard-header">

            <div>

              <span className="dashboard-eyebrow">
                THINKFLOW / WORKSPACE
              </span>

              <h1>
                Analyze your thinking.
              </h1>

            </div>


            {/* PROFILE */}

            <div className="dashboard-profile">

              <div className="profile-avatar">
                S
              </div>

              <div>

                <strong>
                  Saran
                </strong>

                <small>
                  Developer
                </small>

              </div>

            </div>

          </header>


          {/* ==================================================
              ANALYSIS
              ================================================== */}

          <section
            id="analyze"
            className="dashboard-workspace"
          >

            <ProblemInput
  onAnalysis={handleAnalysis}
  darkMode={darkMode}
/>


            <div id="insights">

              <AIInsight
                analysis={analysis}
              />

            </div>

          </section>


          {/* ==================================================
              HISTORY
              ================================================== */}

          <section
            id="history"
            className="history-section"
          >

            {/* HISTORY HEADER */}

            <div className="history-header">

              <div>

                <span className="dashboard-eyebrow">
                  THINKFLOW / HISTORY
                </span>

                <h2>
                  Recent analyses
                </h2>

              </div>


              {history.length > 0 && (

                <button
                  className="clear-history-button"
                  onClick={clearHistory}
                >

                  <Trash2 size={14} />

                  Clear history

                </button>

              )}

            </div>


            {/* EMPTY */}

            {history.length === 0 ? (

              <div className="history-empty">

                <History size={28} />

                <h3>
                  No analyses yet
                </h3>

                <p>
                  Your completed AI analyses
                  will appear here.
                </p>

              </div>

            ) : (

              /* HISTORY LIST */

              <div className="history-list">

                {history.map((item) => {

                  const averageScore =
                    item.metrics
                      ? Math.round(
                          (
                            Number(
                              item.metrics
                                .algorithmSelection || 0
                            ) +

                            Number(
                              item.metrics
                                .debugging || 0
                            ) +

                            Number(
                              item.metrics
                                .decomposition || 0
                            ) +

                            Number(
                              item.metrics
                                .optimization || 0
                            )
                          ) / 4
                        )
                      : 0;

                  return (

                    <button
                      key={item.id}
                      className="history-item"
                      onClick={() =>
                        loadAnalysis(item)
                      }
                    >

                      <div className="history-item-icon">

                        <Brain size={17} />

                      </div>


                      <div className="history-item-content">

                        <strong>
                          {item.thinkingPattern}
                        </strong>

                        <p>
                          {item.summary}
                        </p>

                        <small>
                          {item.createdAt}
                        </small>

                      </div>


                      <div className="history-score">

                        {averageScore}%

                      </div>

                    </button>

                  );

                })}

              </div>

            )}

          </section>

        </main>

      </div>


      {/* ==================================================
          LOGOUT CONFIRMATION POPUP
          ================================================== */}

      {showLogoutPopup && (

        <div
          className="logout-overlay"
          onClick={closeLogoutPopup}
        >

          <div
            className="logout-popup"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="logout-popup-icon">

              <LogOut size={20} />

            </div>


            <h3>
              Log out?
            </h3>


            <p>
              Are you sure you want to log out
              of ThinkFlow?
            </p>


            <div className="logout-popup-actions">

              <button
                className="logout-cancel-button"
                onClick={closeLogoutPopup}
              >
                Cancel
              </button>


              <button
                className="logout-confirm-button"
                onClick={confirmLogout}
              >
                Yes, log out
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}

export default Dashboard;