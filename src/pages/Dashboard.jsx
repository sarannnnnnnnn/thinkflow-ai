import { useEffect, useMemo, useState } from "react";
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
  Target,
  Bug,
  Layers3,
  Zap,
  TrendingUp,
  Award,
  Focus,
  Activity,
  Loader2,
  ChevronRight,
} from "lucide-react";

import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [clearingHistory, setClearingHistory] = useState(false);

  const [activeSection, setActiveSection] = useState("dashboard");

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("thinkflow_theme") === "dark";
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem("thinkflow_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  /* ==================================================
     AUTH CHECK
     ================================================== */

  useEffect(() => {
    const token = sessionStorage.getItem("thinkflow_token");

    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  /* ==================================================
     LOAD USER
     ================================================== */

  useEffect(() => {
    try {
      const savedUser = sessionStorage.getItem("thinkflow_user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      setUser(null);
    }
  }, []);

  /* ==================================================
     LOAD HISTORY FROM DATABASE
     ================================================== */

  useEffect(() => {
    const loadHistory = async () => {
      const token = sessionStorage.getItem("thinkflow_token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        if (!apiUrl) {
          throw new Error("API URL is not configured.");
        }

        const response = await fetch(
          `${apiUrl}/api/analyses`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          sessionStorage.removeItem("thinkflow_token");
          sessionStorage.removeItem("thinkflow_user");

          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load history."
          );
        }

        const databaseHistory = Array.isArray(data)
          ? data
          : [];

        setHistory(databaseHistory);

        /*
         * Show the latest analysis when dashboard opens.
         */
        if (databaseHistory.length > 0) {
          setAnalysis(databaseHistory[0]);
        }

        /*
         * Keep localStorage as a lightweight cache.
         */
        localStorage.setItem(
          "thinkflow_history",
          JSON.stringify(databaseHistory)
        );
      } catch (error) {
        console.error("History loading error:", error);

        /*
         * Fallback to localStorage if API temporarily fails.
         */
        try {
          const savedHistory =
            localStorage.getItem("thinkflow_history");

          if (savedHistory) {
            const parsed = JSON.parse(savedHistory);

            if (Array.isArray(parsed)) {
              setHistory(parsed);

              if (parsed.length > 0) {
                setAnalysis(parsed[0]);
              }
            }
          }
        } catch {
          setHistory([]);
        }
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
  }, [apiUrl, navigate]);

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
     ANALYSIS RESULT
     ================================================== */

  const handleAnalysis = (result) => {
    setSelectedHistory(null);
    setAnalysis(result);

    const newItem = {
      ...result,
      id: result.id || Date.now(),
      createdAt:
        result.createdAt || new Date().toISOString(),
    };

    setHistory((previousHistory) => {
      const updatedHistory = [
        newItem,
        ...previousHistory.filter(
          (item) => item.id !== newItem.id
        ),
      ];

      localStorage.setItem(
        "thinkflow_history",
        JSON.stringify(updatedHistory)
      );

      return updatedHistory;
    });

    setActiveSection("analyze");

    setTimeout(() => {
      document
        .getElementById("ai-analysis")
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
    setSelectedHistory(item);
    setAnalysis(item);
    setActiveSection("analyze");

    setTimeout(() => {
      document
        .getElementById("ai-analysis")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  /* ==================================================
     CLEAR HISTORY
     ================================================== */

  const clearHistory = async () => {
    if (clearingHistory) return;

    const token = sessionStorage.getItem("thinkflow_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setClearingHistory(true);

    try {
      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }

      const response = await fetch(
        `${apiUrl}/api/analyses`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        sessionStorage.removeItem("thinkflow_token");
        sessionStorage.removeItem("thinkflow_user");

        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to clear history."
        );
      }

      setHistory([]);
      setAnalysis(null);
      setSelectedHistory(null);

      localStorage.removeItem("thinkflow_history");
    } catch (error) {
      console.error("Clear history error:", error);
    } finally {
      setClearingHistory(false);
    }
  };

  /* ==================================================
     NAVIGATION
     ================================================== */

  const scrollToSection = (id) => {
    setActiveSection(id);

    if (id === "dashboard") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const section = document.getElementById(id);

    if (!section) return;

    // History is the final section, so scrolling it to the absolute bottom
    // gives the correct final-page state and keeps History selected.
    if (id === "history") {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: Math.max(0, maxScroll),
        behavior: "smooth",
      });
      return;
    }

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    setActiveSection("dashboard");

    return () => {
      window.history.scrollRestoration = "auto";
    };
  }, []);

  /* ==================================================
     ACTIVE NAVIGATION WHILE SCROLLING
     ================================================== */

  useEffect(() => {
    const sectionIds = [
      "dashboard",
      "analyze",
      "ai-analysis",
      "history",
    ];

    let ticking = false;

    const updateActiveSection = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.offsetHeight
      );
      const scrollBottom = scrollY + viewportHeight;
      const navbarOffset = 96;
      const scrollPosition = scrollY + navbarOffset;

      // Treat the final ~80px as the page bottom. This is intentionally
      // generous so History becomes active even when the browser scrollbar
      // has a small rounding/layout difference.
      const isAtPageBottom =
        documentHeight - scrollBottom <= 80 ||
        window.scrollY >= documentHeight - viewportHeight - 80;

      // At the very top, Dashboard is always active.
      if (scrollY <= 70) {
        setActiveSection("dashboard");
        ticking = false;
        return;
      }

      // IMPORTANT: when the user reaches the actual bottom of the page,
      // History is the final section, so History must be active even if
      // the History heading itself is above the viewport.
      if (isAtPageBottom) {
        setActiveSection("history");
        ticking = false;
        return;
      }

      let currentSection = "dashboard";
      let closestDistance = Number.POSITIVE_INFINITY;

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;

        const sectionTop = section.getBoundingClientRect().top + scrollY;
        const distance = Math.abs(scrollPosition - sectionTop);

        // Select the latest section whose top has passed the navbar.
        if (scrollPosition >= sectionTop) {
          currentSection = id;
          closestDistance = distance;
        } else if (currentSection === "dashboard" && distance < closestDistance) {
          closestDistance = distance;
        }
      });

      setActiveSection(currentSection);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

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
    sessionStorage.removeItem("thinkflow_token");
    sessionStorage.removeItem("thinkflow_user");

    setShowLogoutPopup(false);

    navigate("/login", {
      replace: true,
    });
  };

  /* ==================================================
     METRIC HELPERS
     ================================================== */

  const getMetric = (item, key) => {
    return Number(
      item?.metrics?.[key] || 0
    );
  };

  /* ==================================================
     INSIGHTS CALCULATIONS
     ================================================== */

  const insights = useMemo(() => {
    if (!history.length) {
      return {
        overall: 0,
        algorithmSelection: 0,
        debugging: 0,
        decomposition: 0,
        optimization: 0,
        strongest: {
          name: "Not enough data",
          value: 0,
        },
        focus: {
          name: "Not enough data",
          value: 0,
        },
        previousOverall: 0,
        change: 0,
      };
    }

    const totals = {
      algorithmSelection: 0,
      debugging: 0,
      decomposition: 0,
      optimization: 0,
    };

    history.forEach((item) => {
      totals.algorithmSelection += getMetric(
        item,
        "algorithmSelection"
      );

      totals.debugging += getMetric(
        item,
        "debugging"
      );

      totals.decomposition += getMetric(
        item,
        "decomposition"
      );

      totals.optimization += getMetric(
        item,
        "optimization"
      );
    });

    const count = history.length;

    const averages = {
      algorithmSelection: Math.round(
        totals.algorithmSelection / count
      ),

      debugging: Math.round(
        totals.debugging / count
      ),

      decomposition: Math.round(
        totals.decomposition / count
      ),

      optimization: Math.round(
        totals.optimization / count
      ),
    };

    const overall = Math.round(
      (
        averages.algorithmSelection +
        averages.debugging +
        averages.decomposition +
        averages.optimization
      ) / 4
    );

    const metricList = [
      {
        name: "Algorithm Selection",
        value: averages.algorithmSelection,
      },
      {
        name: "Debugging",
        value: averages.debugging,
      },
      {
        name: "Decomposition",
        value: averages.decomposition,
      },
      {
        name: "Optimization",
        value: averages.optimization,
      },
    ];

    const sortedMetrics = [...metricList].sort(
      (a, b) => b.value - a.value
    );

    /*
     * Compare latest analysis with previous analysis.
     */
    let change = 0;
    let previousOverall = 0;

    if (history.length >= 2) {
      const previous = history[1];

      previousOverall = Math.round(
        (
          getMetric(previous, "algorithmSelection") +
          getMetric(previous, "debugging") +
          getMetric(previous, "decomposition") +
          getMetric(previous, "optimization")
        ) / 4
      );

      change = overall - previousOverall;
    }

    return {
      ...averages,

      overall,

      strongest: sortedMetrics[0],

      focus: sortedMetrics[
        sortedMetrics.length - 1
      ],

      previousOverall,

      change,
    };
  }, [history]);

  /* ==================================================
     USER DISPLAY
     ================================================== */

  const displayName =
    user?.name?.trim() || "Developer";

  const avatarLetter =
    displayName.charAt(0).toUpperCase();

  /* ==================================================
     EMPTY INSIGHTS
     ================================================== */

  const hasInsights = history.length > 0;

  return (
    <>
      {/* ==================================================
          PAGE-SPECIFIC STYLES
          ================================================== */}

      <style>{`

        /* ==============================================
           INSIGHTS OVERVIEW
           ============================================== */

        .thinkflow-insights-overview {
          margin-top: 28px;
          margin-bottom: 30px;
        }

        .thinkflow-insights-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
        }

        .thinkflow-insights-header h2 {
          margin: 5px 0 0;
          font-size: 24px;
          line-height: 1.25;
        }

        .thinkflow-insights-header p {
          margin: 6px 0 0;
          color: #8993ad;
          font-size: 13px;
        }

        .thinkflow-insights-count {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 9px;
          border: 1px solid #252b46;
          color: #94a3b8;
          font-size: 12px;
          white-space: nowrap;
        }

        .light-mode .thinkflow-insights-count {
          border-color: #e5e7eb;
          color: #6b7280;
          background: #ffffff;
        }

        .thinkflow-overview-grid {
          display: grid;
          grid-template-columns: 1.25fr 1fr 1fr;
          gap: 14px;
        }

        .thinkflow-overview-card {
          min-height: 145px;
          padding: 20px;
          border: 1px solid #202743;
          border-radius: 15px;
          background: #0c1022;
          box-sizing: border-box;
        }

        .light-mode .thinkflow-overview-card {
          background: #ffffff;
          border-color: #e5e7eb;
          box-shadow:
            0 10px 30px rgba(15, 23, 42, 0.04);
        }

        .thinkflow-overview-card.large {
          grid-row: span 2;
          min-height: 304px;
        }

        .thinkflow-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .thinkflow-card-title {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 500;
        }

        .light-mode .thinkflow-card-title {
          color: #6b7280;
        }

        .thinkflow-card-title svg {
          color: #818cf8;
        }

        .thinkflow-overall-number {
          margin-top: 12px;
          font-size: 45px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: -1.5px;
        }

        .thinkflow-overall-number span {
          font-size: 20px;
          color: #818cf8;
          margin-left: 2px;
        }

        .thinkflow-overall-label {
          margin-top: 10px;
          color: #64748b;
          font-size: 11px;
        }

        .thinkflow-overall-bar {
          height: 7px;
          margin-top: 22px;
          border-radius: 99px;
          overflow: hidden;
          background: #1a2140;
        }

        .light-mode .thinkflow-overall-bar {
          background: #eef0f6;
        }

        .thinkflow-overall-bar div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #6366f1,
            #a855f7
          );
        }

        .thinkflow-change {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 15px;
          color: #818cf8;
          font-size: 11px;
        }

        .thinkflow-change.negative {
          color: #f59e0b;
        }

        .thinkflow-skill-value {
          margin-top: 14px;
          font-size: 25px;
          font-weight: 700;
        }

        .thinkflow-skill-name {
          margin-top: 4px;
          color: #94a3b8;
          font-size: 12px;
        }

        .light-mode .thinkflow-skill-name {
          color: #6b7280;
        }

        .thinkflow-mini-bar {
          height: 5px;
          margin-top: 16px;
          border-radius: 99px;
          background: #1a2140;
          overflow: hidden;
        }

        .light-mode .thinkflow-mini-bar {
          background: #eef0f6;
        }

        .thinkflow-mini-bar div {
          height: 100%;
          border-radius: inherit;
          background: #6366f1;
        }

        .thinkflow-metrics-card {
          grid-column: 2 / 4;
          padding: 20px;
          border: 1px solid #202743;
          border-radius: 15px;
          background: #0c1022;
        }

        .light-mode .thinkflow-metrics-card {
          background: #ffffff;
          border-color: #e5e7eb;
          box-shadow:
            0 10px 30px rgba(15, 23, 42, 0.04);
        }

        .thinkflow-metrics-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px 25px;
          margin-top: 18px;
        }

        .thinkflow-metric-row {
          min-width: 0;
        }

        .thinkflow-metric-row-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 7px;
        }

        .thinkflow-metric-name {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #94a3b8;
          font-size: 11px;
        }

        .light-mode .thinkflow-metric-name {
          color: #6b7280;
        }

        .thinkflow-metric-name svg {
          color: #818cf8;
        }

        .thinkflow-metric-percent {
          font-size: 11px;
          font-weight: 700;
        }

        .thinkflow-metric-track {
          height: 5px;
          overflow: hidden;
          border-radius: 99px;
          background: #1a2140;
        }

        .light-mode .thinkflow-metric-track {
          background: #eef0f6;
        }

        .thinkflow-metric-track div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #6366f1,
            #8b5cf6
          );
        }

        .thinkflow-insights-empty {
          padding: 42px 25px;
          text-align: center;
          border: 1px dashed #252b46;
          border-radius: 15px;
          background: #0c1022;
        }

        .light-mode .thinkflow-insights-empty {
          background: #ffffff;
          border-color: #dfe3ea;
        }

        .thinkflow-insights-empty svg {
          color: #6366f1;
          margin-bottom: 12px;
        }

        .thinkflow-insights-empty h3 {
          margin: 0 0 7px;
          font-size: 16px;
        }

        .thinkflow-insights-empty p {
          margin: 0;
          color: #64748b;
          font-size: 12px;
        }

        /* ==============================================
           LOADING
           ============================================== */

        .thinkflow-history-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 120px;
          color: #64748b;
          font-size: 13px;
        }

        .thinkflow-spin {
          animation: thinkflowSpin 1s linear infinite;
        }

        @keyframes thinkflowSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ==============================================
           REPORT SEPARATOR
           ============================================== */

        .thinkflow-latest-label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 30px 0 14px;
        }

        .thinkflow-latest-label span {
          color: #818cf8;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        .thinkflow-latest-line {
          flex: 1;
          height: 1px;
          background: #202743;
        }

        .light-mode .thinkflow-latest-line {
          background: #e5e7eb;
        }

        /* ==============================================
           RESPONSIVE
           ============================================== */

        @media (max-width: 900px) {
          .thinkflow-overview-grid {
            grid-template-columns: 1fr 1fr;
          }

          .thinkflow-overview-card.large {
            grid-row: auto;
          }

          .thinkflow-metrics-card {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 620px) {
          .thinkflow-insights-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .thinkflow-overview-grid {
            grid-template-columns: 1fr;
          }

          .thinkflow-metrics-card {
            grid-column: auto;
          }

          .thinkflow-metrics-list {
            grid-template-columns: 1fr;
          }
        }



        /* ==================================================
           THINKFLOW DASHBOARD NAVBAR — REFERENCE DESIGN
           ================================================== */
        .dashboard-page {
          --tf-nav-bg: rgba(12, 16, 35, 0.78);
          --tf-nav-border: rgba(148, 163, 184, 0.20);
          --tf-nav-text: #f8fafc;
          --tf-nav-muted: #9aa4bd;
          --tf-nav-hover: rgba(255, 255, 255, 0.055);
          --tf-nav-active: rgba(99, 102, 241, 0.16);
          --tf-nav-accent: #a5b4fc;
          min-height: 100vh !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          display: block !important;
          background: #080b18 !important;
          color: var(--tf-nav-text) !important;
          overflow-x: hidden !important;
        }

        .dashboard-page.light-mode {
          --tf-nav-bg: rgba(255, 255, 255, 0.78);
          --tf-nav-border: rgba(100, 116, 139, 0.20);
          --tf-nav-text: #111827;
          --tf-nav-muted: #667085;
          --tf-nav-hover: rgba(15, 23, 42, 0.045);
          --tf-nav-active: rgba(99, 102, 241, 0.09);
          --tf-nav-accent: #4f46e5;
          background: #f6f7fb !important;
          color: #111827 !important;
        }

        /* Fixed outer glass panel — intentionally matches the reference navbar */
        .dashboard-page .dashboard-top-navbar {
          position: fixed !important;
          top: 18px !important;
          left: 30px !important;
          right: 30px !important;
          width: auto !important;
          height: 78px !important;
          min-height: 78px !important;
          box-sizing: border-box !important;
          display: grid !important;
          grid-template-columns: minmax(220px, 1fr) auto minmax(220px, 1fr) !important;
          align-items: center !important;
          gap: 24px !important;
          padding: 0 24px !important;
          border: 1px solid var(--tf-nav-border) !important;
          border-radius: 22px !important;
          background:
            linear-gradient(135deg, rgba(255,255,255,.055), rgba(255,255,255,.012) 48%, rgba(99,102,241,.035)) ,
            var(--tf-nav-bg) !important;
          backdrop-filter: blur(24px) saturate(150%) !important;
          -webkit-backdrop-filter: blur(24px) saturate(150%) !important;
          box-shadow:
            0 14px 40px rgba(0,0,0,.24),
            inset 0 1px 0 rgba(255,255,255,.09),
            inset 0 -1px 0 rgba(255,255,255,.025) !important;
          z-index: 1000 !important;
          overflow: hidden !important;
        }

        .dashboard-page .dashboard-top-navbar::before {
          content: "" !important;
          position: absolute !important;
          left: 7% !important;
          right: 7% !important;
          top: 0 !important;
          height: 1px !important;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.32), transparent) !important;
          pointer-events: none !important;
        }

        .dashboard-page .dashboard-top-navbar::after {
          content: "" !important;
          position: absolute !important;
          width: 280px !important;
          height: 90px !important;
          left: 18% !important;
          top: -58px !important;
          background: rgba(99,102,241,.15) !important;
          filter: blur(35px) !important;
          border-radius: 50% !important;
          pointer-events: none !important;
        }

        .dashboard-page.light-mode .dashboard-top-navbar {
          box-shadow:
            0 18px 50px rgba(15,23,42,.10),
            inset 0 1px 0 rgba(255,255,255,.95),
            inset 0 -1px 0 rgba(15,23,42,.035) !important;
        }

        /* Brand */
        .dashboard-page .dashboard-top-navbar .dashboard-logo {
          justify-self: start !important;
          width: max-content !important;
          height: 44px !important;
          min-width: 0 !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 11px !important;
          margin: 0 !important;
          padding: 0 !important;
          text-decoration: none !important;
          color: var(--tf-nav-text) !important;
          font-size: 21px !important;
          font-weight: 750 !important;
          letter-spacing: -0.8px !important;
          position: relative !important;
          z-index: 2 !important;
        }

        .dashboard-page .dashboard-top-navbar .dashboard-logo-mark {
          width: 44px !important;
          height: 44px !important;
          min-width: 44px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 11px !important;
          background: linear-gradient(145deg, #6366f1, #7c3aed) !important;
          color: #fff !important;
          box-shadow:
            0 10px 28px rgba(99,102,241,.32),
            inset 0 1px 0 rgba(255,255,255,.28) !important;
        }

        .dashboard-page .dashboard-top-navbar .dashboard-logo > span > span {
          color: #818cf8 !important;
        }

        /* Center navigation */
        .dashboard-page .dashboard-top-nav {
          justify-self: center !important;
          min-width: 0 !important;
          height: 44px !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 5px !important;
          position: relative !important;
          z-index: 2 !important;
        }

        .dashboard-page .dashboard-top-nav-item {
          appearance: none !important;
          -webkit-appearance: none !important;
          height: 38px !important;
          min-height: 38px !important;
          min-width: 94px !important;
          width: auto !important;
          box-sizing: border-box !important;
          display: inline-flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0 !important;
          margin: 0 !important;
          padding: 0 14px !important;
          border: 1px solid transparent !important;
          border-radius: 11px !important;
          background: transparent !important;
          color: var(--tf-nav-muted) !important;
          font-family: inherit !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          line-height: 1 !important;
          white-space: nowrap !important;
          cursor: pointer !important;
          transition: transform .18s ease, background .18s ease, color .18s ease, box-shadow .18s ease !important;
        }

        .dashboard-page .dashboard-top-nav-item svg {
          display: none !important;
        }

        .dashboard-page .dashboard-top-nav-item:hover {
          background: var(--tf-nav-hover) !important;
          color: var(--tf-nav-text) !important;
          transform: translateY(-1px) !important;
        }

        .dashboard-page .dashboard-top-nav-item.active {
          background: var(--tf-nav-active) !important;
          border-color: rgba(129,140,248,.20) !important;
          color: var(--tf-nav-accent) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.055),
            0 5px 20px rgba(99,102,241,.08) !important;
        }

        .dashboard-page.light-mode .dashboard-top-nav-item.active {
          background: #eef2ff !important;
          border-color: #c7d2fe !important;
          color: #4338ca !important;
          box-shadow: 0 5px 18px rgba(79,70,229,.10) !important;
        }

        /* Right actions */
        .dashboard-page .dashboard-top-actions {
          justify-self: end !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: flex-end !important;
          gap: 9px !important;
          height: 56px !important;
          position: relative !important;
          z-index: 2 !important;
        }

        .dashboard-page .dashboard-top-actions .thinkflow-theme-button,
        .dashboard-page .dashboard-top-actions .dashboard-logout-button {
          appearance: none !important;
          -webkit-appearance: none !important;
          height: 44px !important;
          min-height: 44px !important;
          box-sizing: border-box !important;
          display: inline-flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 9px !important;
          margin: 0 !important;
          border-radius: 13px !important;
          font-family: inherit !important;
          font-size: 13px !important;
          font-weight: 650 !important;
          line-height: 1 !important;
          cursor: pointer !important;
          white-space: nowrap !important;
          transition: transform .18s ease, background .18s ease, border-color .18s ease, box-shadow .18s ease !important;
        }

        .dashboard-page .dashboard-top-actions .thinkflow-theme-button {
          width: 44px !important;
          min-width: 44px !important;
          padding: 0 !important;
          border: 1px solid var(--tf-nav-border) !important;
          background: rgba(255,255,255,.035) !important;
          color: var(--tf-nav-text) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.07) !important;
        }

        .dashboard-page .dashboard-top-actions .thinkflow-theme-button span {
          display: none !important;
        }

        .dashboard-page .dashboard-top-actions .dashboard-logout-button {
          width: 96px !important;
          min-width: 96px !important;
          padding: 0 14px !important;
          border: 1px solid var(--tf-nav-border) !important;
          background: rgba(255,255,255,.025) !important;
          color: var(--tf-nav-text) !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.06) !important;
        }

        .dashboard-page .dashboard-top-actions button:hover {
          transform: translateY(-1px) !important;
          background: rgba(255,255,255,.075) !important;
          border-color: rgba(148,163,184,.32) !important;
        }

        .dashboard-page .dashboard-top-actions .dashboard-logout-button svg {
          display: none !important;
        }

        .dashboard-page.light-mode .dashboard-top-actions .thinkflow-theme-button,
        .dashboard-page.light-mode .dashboard-top-actions .dashboard-logout-button {
          background: rgba(255,255,255,.72) !important;
          border-color: #d9deea !important;
          color: #344054 !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 5px 18px rgba(15,23,42,.05) !important;
        }

        /* Content must start below the fixed navbar */
        .dashboard-page .dashboard-main {
          width: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding: 124px 42px 70px !important;
          box-sizing: border-box !important;
          background: transparent !important;
        }

        .dashboard-page .dashboard-main > * {
          max-width: 1180px !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        #dashboard,
        #analyze,
        #ai-analysis,
        #history {
          scroll-margin-top: 108px !important;
        }

        .dashboard-page #ai-analysis {
          display: block !important;
          width: 100% !important;
        }

        @media (max-width: 1100px) {
          .dashboard-page .dashboard-top-navbar {
            left: 20px !important;
            right: 20px !important;
            grid-template-columns: auto minmax(0,1fr) auto !important;
            gap: 16px !important;
            padding: 0 20px !important;
          }
          .dashboard-page .dashboard-top-nav-item {
            min-width: 88px !important;
            padding: 0 12px !important;
          }
          .dashboard-page .dashboard-main {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
        }

        @media (max-width: 820px) {
          .dashboard-page .dashboard-top-navbar {
            top: 14px !important;
            left: 14px !important;
            right: 14px !important;
            height: auto !important;
            min-height: 76px !important;
            grid-template-columns: auto 1fr auto !important;
            padding: 10px 14px !important;
            border-radius: 22px !important;
          }
          .dashboard-page .dashboard-top-navbar .dashboard-logo {
            font-size: 20px !important;
            gap: 10px !important;
          }
          .dashboard-page .dashboard-logo-mark {
            width: 46px !important;
            height: 46px !important;
            min-width: 46px !important;
          }
          .dashboard-page .dashboard-top-nav {
            justify-content: flex-start !important;
            overflow-x: auto !important;
            scrollbar-width: none !important;
          }
          .dashboard-page .dashboard-top-nav::-webkit-scrollbar {
            display: none !important;
          }
          .dashboard-page .dashboard-top-nav-item {
            min-width: 82px !important;
            height: 40px !important;
            min-height: 40px !important;
            padding: 0 11px !important;
            font-size: 13px !important;
          }
          .dashboard-page .dashboard-top-actions {
            gap: 7px !important;
          }
          .dashboard-page .dashboard-top-actions .thinkflow-theme-button {
            width: 46px !important;
            min-width: 46px !important;
            height: 46px !important;
            min-height: 46px !important;
          }
          .dashboard-page .dashboard-top-actions .dashboard-logout-button {
            width: 46px !important;
            min-width: 46px !important;
            height: 46px !important;
            min-height: 46px !important;
            padding: 0 !important;
          }
          .dashboard-page .dashboard-top-actions .dashboard-logout-button span {
            display: none !important;
          }
          .dashboard-page .dashboard-top-actions .dashboard-logout-button svg {
            display: block !important;
          }
          .dashboard-page .dashboard-main {
            padding-top: 122px !important;
          }
        }

        @media (max-width: 560px) {
          .dashboard-page .dashboard-top-navbar {
            grid-template-columns: auto 1fr auto !important;
            gap: 8px !important;
          }
          .dashboard-page .dashboard-top-navbar .dashboard-logo > span {
            display: none !important;
          }
          .dashboard-page .dashboard-top-nav {
            justify-content: center !important;
          }
          .dashboard-page .dashboard-top-nav-item {
            min-width: 74px !important;
            padding: 0 8px !important;
          }
          .dashboard-page .dashboard-top-nav-item span {
            font-size: 12px !important;
          }
        }

        /* ==================================================
           DASHBOARD DARK/LIGHT THEME FOR CHILD COMPONENTS
           ================================================== */

        /* ---------- DARK MODE ---------- */
        .dashboard-page.dark-mode .problem-input-card,
        .dashboard-page.dark-mode .ai-report-card,
        .dashboard-page.dark-mode .history-section {
          background: #0c1022 !important;
          border-color: #202743 !important;
          color: #f8fafc !important;
          box-shadow: none !important;
        }

        .dashboard-page.dark-mode .problem-input-header,
        .dashboard-page.dark-mode .ai-report-header,
        .dashboard-page.dark-mode .history-header {
          color: #f8fafc !important;
        }

        .dashboard-page.dark-mode .problem-input-card h1,
        .dashboard-page.dark-mode .problem-input-card h2,
        .dashboard-page.dark-mode .problem-input-card h3,
        .dashboard-page.dark-mode .ai-report-card h1,
        .dashboard-page.dark-mode .ai-report-card h2,
        .dashboard-page.dark-mode .ai-report-card h3,
        .dashboard-page.dark-mode .history-header h2 {
          color: #f8fafc !important;
        }

        .dashboard-page.dark-mode .problem-input-card p,
        .dashboard-page.dark-mode .problem-input-card label,
        .dashboard-page.dark-mode .ai-report-card p,
        .dashboard-page.dark-mode .report-label,
        .dashboard-page.dark-mode .metric-title,
        .dashboard-page.dark-mode .observation-content,
        .dashboard-page.dark-mode .pattern-content,
        .dashboard-page.dark-mode .report-item,
        .dashboard-page.dark-mode .history-item p,
        .dashboard-page.dark-mode .history-item small {
          color: #94a3b8 !important;
        }

        .dashboard-page.dark-mode .problem-textarea,
        .dashboard-page.dark-mode .language-selector,
        .dashboard-page.dark-mode .monaco-wrapper,
        .dashboard-page.dark-mode .code-editor,
        .dashboard-page.dark-mode .code-area {
          background: #070a18 !important;
          border-color: #252b46 !important;
          color: #f8fafc !important;
        }

        .dashboard-page.dark-mode .problem-textarea::placeholder {
          color: #64748b !important;
        }

        .dashboard-page.dark-mode .language-selector {
          color: #f8fafc !important;
        }

        .dashboard-page.dark-mode .language-selector option {
          background: #0c1022 !important;
          color: #f8fafc !important;
        }

        .dashboard-page.dark-mode .problem-input-actions {
          border-color: #202743 !important;
        }

        .dashboard-page.dark-mode .reset-button {
          background: #151a2e !important;
          border-color: #2a314b !important;
          color: #a0a9bf !important;
        }

        .dashboard-page.dark-mode .reset-button:hover {
          background: #1b2138 !important;
          color: #ffffff !important;
        }

        .dashboard-page.dark-mode .analysis-error {
          background: #2a1420 !important;
          border-color: #6b263d !important;
          color: #fda4af !important;
        }

        .dashboard-page.dark-mode .ai-report-card .ai-status,
        .dashboard-page.dark-mode .ai-status.analyzed {
          background: #171c38 !important;
          border-color: #303866 !important;
          color: #a5b4fc !important;
        }

        .dashboard-page.dark-mode .ai-empty {
          background: #0c1022 !important;
          border-color: #252b46 !important;
          color: #94a3b8 !important;
        }

        .dashboard-page.dark-mode .ai-pattern,
        .dashboard-page.dark-mode .metric-card,
        .dashboard-page.dark-mode .observation,
        .dashboard-page.dark-mode .report-column {
          background: #10152b !important;
          border-color: #252b46 !important;
        }

        .dashboard-page.dark-mode .metric-progress {
          background: #1a2140 !important;
        }

        .dashboard-page.dark-mode .pattern-row,
        .dashboard-page.dark-mode .report-bottom {
          border-color: #252b46 !important;
        }

        .dashboard-page.dark-mode .history-item {
          background: #10152b !important;
          border-color: #252b46 !important;
          color: #f8fafc !important;
        }

        .dashboard-page.dark-mode .history-item:hover {
          background: #171c38 !important;
          border-color: #3b4380 !important;
        }

        .dashboard-page.dark-mode .history-item strong {
          color: #f8fafc !important;
        }

        .dashboard-page.dark-mode .history-item-icon {
          background: #171c38 !important;
          color: #a5b4fc !important;
        }

        .dashboard-page.dark-mode .clear-history-button {
          background: #151a2e !important;
          border-color: #2a314b !important;
          color: #cbd5e1 !important;
        }

        .dashboard-page.dark-mode .clear-history-button:hover {
          background: #1b2138 !important;
          border-color: #3b4380 !important;
          color: #ffffff !important;
        }

        /* ---------- LIGHT MODE ---------- */
        .dashboard-page.light-mode .problem-input-card,
        .dashboard-page.light-mode .ai-report-card,
        .dashboard-page.light-mode .history-section {
          background: #ffffff !important;
          border-color: #e5e7eb !important;
          color: #111827 !important;
        }

        .dashboard-page.light-mode .problem-textarea,
        .dashboard-page.light-mode .language-selector,
        .dashboard-page.light-mode .monaco-wrapper,
        .dashboard-page.light-mode .code-editor,
        .dashboard-page.light-mode .code-area {
          background: #ffffff !important;
          border-color: #dfe3ea !important;
          color: #111827 !important;
        }

        .dashboard-page.light-mode .history-item {
          background: #f9fafb !important;
          border-color: #e5e7eb !important;
          color: #111827 !important;
        }

        .dashboard-page.light-mode .history-item strong,
        .dashboard-page.light-mode .problem-input-card h1,
        .dashboard-page.light-mode .problem-input-card h2,
        .dashboard-page.light-mode .problem-input-card h3,
        .dashboard-page.light-mode .ai-report-card h1,
        .dashboard-page.light-mode .ai-report-card h2,
        .dashboard-page.light-mode .ai-report-card h3,
        .dashboard-page.light-mode .history-header h2 {
          color: #111827 !important;
        }

        /* ==================================================
   DARK MODE — TEXT VISIBILITY FIX
   ================================================== */

.dashboard-page.dark-mode {
  color: #f8fafc !important;
}

/* Main dashboard heading */
.dashboard-page.dark-mode .simple-dashboard-header h1 {
  color: #f8fafc !important;
}

/* Workspace / section labels */
.dashboard-page.dark-mode .dashboard-eyebrow {
  color: #94a3b8 !important;
}

.dashboard-page.dark-mode .thinkflow-section-label,
.dashboard-page.dark-mode .thinkflow-insights-label {
  color: #94a3b8 !important;
}

/* Profile */
.dashboard-page.dark-mode .dashboard-profile strong {
  color: #f8fafc !important;
}

.dashboard-page.dark-mode .dashboard-profile small {
  color: #94a3b8 !important;
}

/* General headings */
.dashboard-page.dark-mode h1,
.dashboard-page.dark-mode h2,
.dashboard-page.dark-mode h3,
.dashboard-page.dark-mode h4 {
  color: #f8fafc !important;
}

/* General paragraph text */
.dashboard-page.dark-mode p {
  color: #94a3b8 !important;
}


/* Keep important purple/blue accent text visible */
.dashboard-page.dark-mode .thinkflow-insights-count {
  color: #a5b4fc !important;
}



        /* ==================================================
           HISTORY DETAIL — ORIGINAL PROBLEM + CODE
           ================================================== */
        .dashboard-page .history-detail-card {
          width: 100%;
          margin: 0 0 22px;
          padding: 22px;
          box-sizing: border-box;
          border: 1px solid #202743;
          border-radius: 18px;
          background: #0c1022;
          box-shadow: 0 16px 45px rgba(0,0,0,.16);
        }

        .dashboard-page.light-mode .history-detail-card {
          background: #ffffff;
          border-color: #e5e7eb;
          box-shadow: 0 12px 35px rgba(15,23,42,.06);
        }

        .history-detail-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }

        .history-detail-title {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #f8fafc;
          font-size: 16px;
          font-weight: 700;
        }

        .dashboard-page.light-mode .history-detail-title {
          color: #111827;
        }

        .history-detail-badge {
          display: inline-flex;
          align-items: center;
          height: 30px;
          padding: 0 10px;
          border-radius: 8px;
          border: 1px solid #303866;
          background: #171c38;
          color: #a5b4fc;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        .dashboard-page.light-mode .history-detail-badge {
          border-color: #c7d2fe;
          background: #eef2ff;
          color: #4338ca;
        }

        .history-detail-label {
          display: block;
          margin-bottom: 8px;
          color: #94a3b8;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .dashboard-page.light-mode .history-detail-label {
          color: #6b7280;
        }

        .history-detail-problem {
          margin-bottom: 18px;
          padding: 14px 16px;
          border: 1px solid #252b46;
          border-radius: 12px;
          background: #070a18;
          color: #e2e8f0;
          font-size: 14px;
          line-height: 1.65;
          white-space: pre-wrap;
        }

        .dashboard-page.light-mode .history-detail-problem {
          background: #f8fafc;
          border-color: #e5e7eb;
          color: #111827;
        }

        .history-detail-code {
          margin: 0;
          padding: 18px;
          max-height: 430px;
          overflow: auto;
          box-sizing: border-box;
          border: 1px solid #252b46;
          border-radius: 12px;
          background: #050712;
          color: #e2e8f0;
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
          font-size: 13px;
          line-height: 1.7;
          white-space: pre;
          tab-size: 2;
        }

        .dashboard-page.light-mode .history-detail-code {
          background: #f8fafc;
          border-color: #dfe3ea;
          color: #111827;
        }

        @media (max-width: 720px) {
          .dashboard-page .history-detail-card {
            padding: 16px;
            border-radius: 14px;
          }

          .history-detail-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .history-detail-code {
            font-size: 12px;
          }
        }

        /* Light mode - selected/current line */
.dashboard-page.light-mode
.thinkflow-code-editor
.monaco-editor
.current-line {
  background: #eef2ff !important;
}

.dashboard-page.light-mode
.thinkflow-code-editor
.monaco-editor
.current-line-margin {
  background: #eef2ff !important;
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

        <header className="dashboard-top-navbar">

          <Link to="/" className="dashboard-logo">
            <div className="dashboard-logo-mark">
              <Brain size={20} />
            </div>
            <span>Think<span>Flow</span></span>
          </Link>

          <nav className="dashboard-top-nav" aria-label="Dashboard navigation">
            <button
              type="button"
              className={`dashboard-top-nav-item ${activeSection === "dashboard" ? "active" : ""}`}
              onClick={() => scrollToSection("dashboard")}
            >
              <Brain size={16} />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              className={`dashboard-top-nav-item ${activeSection === "analyze" ? "active" : ""}`}
              onClick={() => scrollToSection("analyze")}
            >
              <Code2 size={16} />
              <span>Analyze</span>
            </button>

            <button
              type="button"
              className={`dashboard-top-nav-item ${activeSection === "ai-analysis" ? "active" : ""}`}
              onClick={() => scrollToSection("ai-analysis")}
            >
              <BarChart3 size={16} />
              <span>Insights</span>
            </button>

            <button
              type="button"
              className={`dashboard-top-nav-item ${activeSection === "history" ? "active" : ""}`}
              onClick={() => scrollToSection("history")}
            >
              <History size={16} />
              <span>History</span>
            </button>
          </nav>

          <div className="dashboard-top-actions">
            <button
              type="button"
              className="thinkflow-theme-button"
              onClick={toggleTheme}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              <span>{darkMode ? "Light mode" : "Dark mode"}</span>
            </button>

            <button
              type="button"
              className="dashboard-logout-button"
              onClick={openLogoutPopup}
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>

        </header>

        <main className="dashboard-main">

          {/* ==================================================
              HEADER
              ================================================== */}

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
                {avatarLetter}
              </div>

              <div>

                <strong>
                  {displayName}
                </strong>

                <small>
                  Developer
                </small>

              </div>

            </div>

          </header>

          {/* ==================================================
              INSIGHTS OVERVIEW
              ================================================== */}

          <section
            id="dashboard"
            className="thinkflow-insights-overview"
          >

            <div className="thinkflow-insights-header">

              <div>

                <span className="dashboard-eyebrow">
                  THINKFLOW / INSIGHTS
                </span>

                <h2>
                  Your thinking profile
                </h2>

                <p>
                  A summary of your problem-solving
                  patterns across completed analyses.
                </p>

              </div>

              <div className="thinkflow-insights-count">
                <Activity size={14} />

                {history.length}{" "}
                {history.length === 1
                  ? "analysis"
                  : "analyses"}
              </div>

            </div>

            {!hasInsights ? (

              loadingHistory ? (

                <div className="thinkflow-insights-empty">

                  <Loader2
                    size={30}
                    className="thinkflow-spin"
                  />

                  <h3>
                    Loading your insights
                  </h3>

                  <p>
                    Fetching your analysis history.
                  </p>

                </div>

              ) : (

                <div className="thinkflow-insights-empty">

                  <BarChart3 size={30} />

                  <h3>
                    Your insights will appear here
                  </h3>

                  <p>
                    Complete your first AI analysis
                    to build your thinking profile.
                  </p>

                </div>

              )

            ) : (

              <div className="thinkflow-overview-grid">

                {/* OVERALL */}

                <div className="thinkflow-overview-card large">

                  <div className="thinkflow-card-top">

                    <div className="thinkflow-card-title">
                      <Target size={15} />
                      Overall Thinking Score
                    </div>

                    <Award size={18} color="#818cf8" />

                  </div>

                  <div className="thinkflow-overall-number">
                    {insights.overall}
                    <span>%</span>
                  </div>

                  <div className="thinkflow-overall-label">
                    Average across all thinking metrics
                  </div>

                  <div className="thinkflow-overall-bar">
                    <div
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            insights.overall
                          )
                        )}%`,
                      }}
                    />
                  </div>

                  {history.length >= 2 && (
                    <div
                      className={`thinkflow-change ${
                        insights.change < 0
                          ? "negative"
                          : ""
                      }`}
                    >
                      <TrendingUp size={13} />

                      {insights.change >= 0
                        ? `+${insights.change}`
                        : insights.change}{" "}
                      points vs previous analysis
                    </div>
                  )}

                </div>

                {/* STRONGEST */}

                <div className="thinkflow-overview-card">

                  <div className="thinkflow-card-title">
                    <Zap size={15} />
                    Strongest Skill
                  </div>

                  <div className="thinkflow-skill-value">
                    {insights.strongest.value}%
                  </div>

                  <div className="thinkflow-skill-name">
                    {insights.strongest.name}
                  </div>

                  <div className="thinkflow-mini-bar">
                    <div
                      style={{
                        width: `${insights.strongest.value}%`,
                      }}
                    />
                  </div>

                </div>

                {/* FOCUS AREA */}

                <div className="thinkflow-overview-card">

                  <div className="thinkflow-card-title">
                    <Focus size={15} />
                    Focus Area
                  </div>

                  <div className="thinkflow-skill-value">
                    {insights.focus.value}%
                  </div>

                  <div className="thinkflow-skill-name">
                    {insights.focus.name}
                  </div>

                  <div className="thinkflow-mini-bar">
                    <div
                      style={{
                        width: `${insights.focus.value}%`,
                      }}
                    />
                  </div>

                </div>

                {/* METRICS */}

                <div className="thinkflow-metrics-card">

                  <div className="thinkflow-card-title">
                    <BarChart3 size={15} />
                    Average Thinking Metrics
                  </div>

                  <div className="thinkflow-metrics-list">

                    {/* ALGORITHM */}

                    <div className="thinkflow-metric-row">

                      <div className="thinkflow-metric-row-top">

                        <div className="thinkflow-metric-name">
                          <Target size={14} />
                          Algorithm Selection
                        </div>

                        <span className="thinkflow-metric-percent">
                          {insights.algorithmSelection}%
                        </span>

                      </div>

                      <div className="thinkflow-metric-track">
                        <div
                          style={{
                            width: `${insights.algorithmSelection}%`,
                          }}
                        />
                      </div>

                    </div>

                    {/* DEBUGGING */}

                    <div className="thinkflow-metric-row">

                      <div className="thinkflow-metric-row-top">

                        <div className="thinkflow-metric-name">
                          <Bug size={14} />
                          Debugging
                        </div>

                        <span className="thinkflow-metric-percent">
                          {insights.debugging}%
                        </span>

                      </div>

                      <div className="thinkflow-metric-track">
                        <div
                          style={{
                            width: `${insights.debugging}%`,
                          }}
                        />
                      </div>

                    </div>

                    {/* DECOMPOSITION */}

                    <div className="thinkflow-metric-row">

                      <div className="thinkflow-metric-row-top">

                        <div className="thinkflow-metric-name">
                          <Layers3 size={14} />
                          Decomposition
                        </div>

                        <span className="thinkflow-metric-percent">
                          {insights.decomposition}%
                        </span>

                      </div>

                      <div className="thinkflow-metric-track">
                        <div
                          style={{
                            width: `${insights.decomposition}%`,
                          }}
                        />
                      </div>

                    </div>

                    {/* OPTIMIZATION */}

                    <div className="thinkflow-metric-row">

                      <div className="thinkflow-metric-row-top">

                        <div className="thinkflow-metric-name">
                          <Zap size={14} />
                          Optimization
                        </div>

                        <span className="thinkflow-metric-percent">
                          {insights.optimization}%
                        </span>

                      </div>

                      <div className="thinkflow-metric-track">
                        <div
                          style={{
                            width: `${insights.optimization}%`,
                          }}
                        />
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            )}

          </section>

          {/* ==================================================
              ANALYZE
              ================================================== */}

          <section
            id="analyze"
            className="dashboard-workspace"
          >

            {selectedHistory && (
              <div className="history-detail-card">
                <div className="history-detail-head">
                  <div className="history-detail-title">
                    <Code2 size={18} />
                    Previous Analysis
                  </div>
                  <span className="history-detail-badge">
                    {selectedHistory.language || "Code"}
                  </span>
                </div>

                <span className="history-detail-label">Problem</span>
                <div className="history-detail-problem">
                  {selectedHistory.problem || "No problem statement saved."}
                </div>

                <span className="history-detail-label">Submitted Code</span>
                <pre className="history-detail-code">
                  {selectedHistory.solution || "No code saved for this analysis."}
                </pre>
              </div>
            )}

            <ProblemInput
              onAnalysis={handleAnalysis}
              darkMode={darkMode}
            />

            {/* LATEST REPORT LABEL */}

            <div
              id="ai-analysis"
              className="thinkflow-latest-label"
            >
              <span>
                AI ANALYSIS
              </span>

              <div className="thinkflow-latest-line" />
            </div>

            <AIInsight
              analysis={analysis}
            />

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
                  disabled={clearingHistory}
                >

                  {clearingHistory ? (
                    <Loader2
                      size={14}
                      className="thinkflow-spin"
                    />
                  ) : (
                    <Trash2 size={14} />
                  )}

                  {clearingHistory
                    ? "Clearing..."
                    : "Clear history"}

                </button>

              )}

            </div>

            {/* LOADING */}

            {loadingHistory ? (

              <div className="thinkflow-history-loading">

                <Loader2
                  size={18}
                  className="thinkflow-spin"
                />

                Loading analysis history...

              </div>

            ) : history.length === 0 ? (

              /* EMPTY */

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
                    Math.round(
                      (
                        getMetric(
                          item,
                          "algorithmSelection"
                        ) +
                        getMetric(
                          item,
                          "debugging"
                        ) +
                        getMetric(
                          item,
                          "decomposition"
                        ) +
                        getMetric(
                          item,
                          "optimization"
                        )
                      ) / 4
                    );

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
                          {item.thinkingPattern ||
                            "Thinking Analysis"}
                        </strong>

                        <p>
                          {item.summary ||
                            "AI analysis completed."}
                        </p>

                        <small>
                          {item.createdAt
                            ? new Date(
                                item.createdAt
                              ).toLocaleString()
                            : "Recently analyzed"}

                          {item.language
                            ? ` • ${item.language}`
                            : ""}
                        </small>

                      </div>

                      <div className="history-score">
                        {averageScore}%
                      </div>

                      <ChevronRight
                        size={16}
                        style={{
                          opacity: 0.45,
                          flexShrink: 0,
                        }}
                      />

                    </button>

                  );
                })}

              </div>

            )}

          </section>

        </main>

      </div>

      {/* ==================================================
          LOGOUT CONFIRMATION
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