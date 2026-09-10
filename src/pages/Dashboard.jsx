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
         * Keep localStorage as a lightweight cache.
         * NOTE: We intentionally do NOT call setAnalysis here.
         * On mount/refresh the Insights panel must start empty.
         * The user must either run a new analysis or click a
         * history item to populate it.
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
              // Do NOT auto-load analysis from cache on mount.
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

    setActiveSection("ai-analysis");

    setTimeout(() => {
      const target = document.getElementById("ai-analysis");
      if (!target) return;
      const navbarHeight = 108;
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }, 200);
  };

  /* ==================================================
     LOAD OLD ANALYSIS
     ================================================== */

  const loadAnalysis = (item) => {
    setSelectedHistory(item);
    setAnalysis(item);
    setActiveSection("ai-analysis");

    setTimeout(() => {
      const target = document.getElementById("ai-analysis");
      if (!target) return;
      const navbarHeight = 108;
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
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
          color: #454745;
          font-size: 13px;
        }

        .thinkflow-insights-count {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 9px;
          border: 1px solid rgba(159,232,112,0.12);
          color: #454745;
          font-size: 12px;
          white-space: nowrap;
        }

        .light-mode .thinkflow-insights-count {
          border-color: #D9DED5;
          color: #454745;
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
          border: 1px solid #163300;
          border-radius: 15px;
          background: #0E0F0C;
          box-sizing: border-box;
        }

        .light-mode .thinkflow-overview-card {
          background: #ffffff;
          border-color: #D9DED5;
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
          color: #454745;
          font-size: 12px;
          font-weight: 500;
        }

        .light-mode .thinkflow-card-title {
          color: #454745;
        }

        .thinkflow-card-title svg {
          color: #9FE870;
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
          color: #9FE870;
          margin-left: 2px;
        }

        .thinkflow-overall-label {
          margin-top: 10px;
          color: #454745;
          font-size: 11px;
        }

        .thinkflow-overall-bar {
          height: 7px;
          margin-top: 22px;
          border-radius: 99px;
          overflow: hidden;
          background: #163300;
        }

        .light-mode .thinkflow-overall-bar {
          background: #F4F6F1;
        }

        .thinkflow-overall-bar div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #9FE870,
            #9FE870
          );
        }

        .thinkflow-change {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 15px;
          color: #9FE870;
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
          color: #454745;
          font-size: 12px;
        }

        .light-mode .thinkflow-skill-name {
          color: #454745;
        }

        .thinkflow-mini-bar {
          height: 5px;
          margin-top: 16px;
          border-radius: 99px;
          background: #163300;
          overflow: hidden;
        }

        .light-mode .thinkflow-mini-bar {
          background: #F4F6F1;
        }

        .thinkflow-mini-bar div {
          height: 100%;
          border-radius: inherit;
          background: #9FE870;
        }

        .thinkflow-metrics-card {
          grid-column: 2 / 4;
          padding: 20px;
          border: 1px solid #163300;
          border-radius: 15px;
          background: #0E0F0C;
        }

        .light-mode .thinkflow-metrics-card {
          background: #ffffff;
          border-color: #D9DED5;
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
          color: #454745;
          font-size: 11px;
        }

        .light-mode .thinkflow-metric-name {
          color: #454745;
        }

        .thinkflow-metric-name svg {
          color: #9FE870;
        }

        .thinkflow-metric-percent {
          font-size: 11px;
          font-weight: 700;
        }

        .thinkflow-metric-track {
          height: 5px;
          overflow: hidden;
          border-radius: 99px;
          background: #163300;
        }

        .light-mode .thinkflow-metric-track {
          background: #F4F6F1;
        }

        .thinkflow-metric-track div {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #9FE870,
            #9FE870
          );
        }

        .thinkflow-insights-empty {
          padding: 42px 25px;
          text-align: center;
          border: 1px dashed rgba(159,232,112,0.12);
          border-radius: 15px;
          background: #0E0F0C;
        }

        .light-mode .thinkflow-insights-empty {
          background: #ffffff;
          border-color: #D9DED5;
        }

        .thinkflow-insights-empty svg {
          color: #9FE870;
          margin-bottom: 12px;
        }

        .thinkflow-insights-empty h3 {
          margin: 0 0 7px;
          font-size: 16px;
        }

        .thinkflow-insights-empty p {
          margin: 0;
          color: #454745;
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
          color: #454745;
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
          color: #9FE870;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        .thinkflow-latest-line {
          flex: 1;
          height: 1px;
          background: #163300;
        }

        .light-mode .thinkflow-latest-line {
          background: #D9DED5;
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
           THINKFLOW DASHBOARD NAVBAR â€” REFERENCE DESIGN
           ================================================== */
        .dashboard-page {
          --tf-nav-bg: rgba(12, 16, 35, 0.78);
          --tf-nav-border: rgba(148, 163, 184, 0.20);
          --tf-nav-text: #f0f5eb;
          --tf-nav-muted: #454745;
          --tf-nav-hover: rgba(255, 255, 255, 0.055);
          --tf-nav-active: rgba(159,232,112,0.15);
          --tf-nav-accent: #9FE870;
          min-height: 100vh !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          display: block !important;
          background: #0E0F0C !important;
          color: var(--tf-nav-text) !important;
          overflow-x: hidden !important;
        }

        .dashboard-page.light-mode {
          --tf-nav-bg: rgba(255, 255, 255, 0.78);
          --tf-nav-border: rgba(100, 116, 139, 0.20);
          --tf-nav-text: #0E0F0C;
          --tf-nav-muted: #454745;
          --tf-nav-hover: rgba(15, 23, 42, 0.045);
          --tf-nav-active: rgba(159,232,112,0.15);
          --tf-nav-accent: #163300;
          background: #F4F6F1 !important;
          color: #0E0F0C !important;
        }

        /* Fixed outer glass panel â€” intentionally matches the reference navbar */
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
            linear-gradient(135deg, rgba(255,255,255,.055), rgba(255,255,255,.012) 48%, rgba(159,232,112,0.05)) ,
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
          background: rgba(159,232,112,0.04) !important;
          pointer-events: none !important;
        }

        .dashboard-page .dashboard-top-navbar::after {
          content: "" !important;
          position: absolute !important;
          width: 280px !important;
          height: 90px !important;
          left: 18% !important;
          top: -58px !important;
          background: rgba(159,232,112,0.15) !important;
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
          background: #163300 !important;
          color: #fff !important;
          box-shadow:
            0 10px 28px rgba(159,232,112,0.15),
            inset 0 1px 0 rgba(255,255,255,.28) !important;
        }

        .dashboard-page .dashboard-top-navbar .dashboard-logo > span > span {
          color: #9FE870 !important;
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
          border-color: rgba(159,232,112,0.15) !important;
          color: var(--tf-nav-accent) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.055),
            0 5px 20px rgba(159,232,112,0.15) !important;
        }

        .dashboard-page.light-mode .dashboard-top-nav-item.active {
          background: #E2F6D5 !important;
          border-color: #c4e8b0 !important;
          color: #163300 !important;
          box-shadow: 0 5px 18px rgba(22,51,0,0.15) !important;
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
          border-color: rgba(217,222,213,0.5) !important;
        }

        .dashboard-page .dashboard-top-actions .dashboard-logout-button svg {
          display: none !important;
        }

        .dashboard-page.light-mode .dashboard-top-actions .thinkflow-theme-button,
        .dashboard-page.light-mode .dashboard-top-actions .dashboard-logout-button {
          background: rgba(255,255,255,.72) !important;
          border-color: #D9DED5 !important;
          color: #0E0F0C !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 5px 18px rgba(15,23,42,.05) !important;
        }

        /* Content must start below the fixed navbar */
        .dashboard-page .dashboard-main {
          width: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding: 124px 0 70px !important;
          box-sizing: border-box !important;
          background: transparent !important;
        }

        /* All direct children share the same centered container */
        .dashboard-page .dashboard-main > * {
          width: 100% !important;
          max-width: 1400px !important;
          margin-left: auto !important;
          margin-right: auto !important;
          padding-left: 36px !important;
          padding-right: 36px !important;
          box-sizing: border-box !important;
        }

        /* Override App.css simple-dashboard-header max-width constraint */
        .dashboard-page .simple-dashboard-header {
          max-width: 1400px !important;
          margin-left: auto !important;
          margin-right: auto !important;
          padding-left: 36px !important;
          padding-right: 36px !important;
          box-sizing: border-box !important;
        }

        /* Override App.css history-section own max-width/margin */
        .dashboard-page .history-section {
          max-width: 1400px !important;
          margin-left: auto !important;
          margin-right: auto !important;
          padding-left: 36px !important;
          padding-right: 36px !important;
          box-sizing: border-box !important;
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
          .dashboard-page .dashboard-main > *,
          .dashboard-page .simple-dashboard-header,
          .dashboard-page .history-section {
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

        @media (max-width: 700px) {
          .dashboard-page .dashboard-main > *,
          .dashboard-page .simple-dashboard-header,
          .dashboard-page .history-section {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }

        @media (max-width: 600px) {
          /* ── MOBILE NAVBAR: 2-row flex-wrap layout ─────────────────
             Row 1: Logo (left)  +  Actions (right)
             Row 2: Dashboard | Analyze | Insights | History (full width)
             ───────────────────────────────────────────────────────── */

          .dashboard-page .dashboard-top-navbar {
            top: 10px !important;
            left: 10px !important;
            right: 10px !important;
            height: auto !important;
            min-height: unset !important;
            /* flex-wrap so nav drops to row 2 */
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            align-items: center !important;
            gap: 0 !important;
            padding: 10px 14px !important;
            border-radius: 18px !important;
          }

          /* Logo — row 1, left */
          .dashboard-page .dashboard-top-navbar .dashboard-logo {
            order: 1 !important;
            flex: 1 1 auto !important;
            font-size: 16px !important;
            gap: 8px !important;
            display: inline-flex !important;
          }

          /* Show brand text */
          .dashboard-page .dashboard-top-navbar .dashboard-logo > span {
            display: inline !important;
          }

          .dashboard-page .dashboard-logo-mark {
            width: 32px !important;
            height: 32px !important;
            min-width: 32px !important;
            border-radius: 8px !important;
          }

          /* Actions — row 1, right */
          .dashboard-page .dashboard-top-actions {
            order: 2 !important;
            flex: 0 0 auto !important;
            gap: 6px !important;
          }

          .dashboard-page .dashboard-top-actions .thinkflow-theme-button {
            width: 34px !important;
            min-width: 34px !important;
            height: 34px !important;
            min-height: 34px !important;
          }

          .dashboard-page .dashboard-top-actions .dashboard-logout-button {
            width: 34px !important;
            min-width: 34px !important;
            height: 34px !important;
            min-height: 34px !important;
            padding: 0 !important;
          }

          .dashboard-page .dashboard-top-actions .dashboard-logout-button span {
            display: none !important;
          }

          .dashboard-page .dashboard-top-actions .dashboard-logout-button svg {
            display: block !important;
          }

          /* Nav — row 2, full width */
          .dashboard-page .dashboard-top-nav {
            order: 3 !important;
            width: 100% !important;
            flex: 0 0 100% !important;
            height: auto !important;
            min-height: unset !important;
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            align-items: center !important;
            justify-content: stretch !important;
            gap: 4px !important;
            margin-top: 8px !important;
            padding-top: 8px !important;
            overflow: visible !important;
            border-top: 1px solid var(--tf-nav-border) !important;
          }

          .dashboard-page .dashboard-top-nav-item {
            flex: 1 1 0 !important;
            min-width: 0 !important;
            width: auto !important;
            height: 34px !important;
            min-height: 34px !important;
            padding: 0 4px !important;
            font-size: 11.5px !important;
            gap: 4px !important;
            justify-content: center !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            border-radius: 10px !important;
          }

          .dashboard-page .dashboard-top-nav-item svg {
            width: 13px !important;
            height: 13px !important;
            flex-shrink: 0 !important;
          }

          /* Adjust main content padding for 2-row navbar height */
          .dashboard-page .dashboard-main {
            padding-top: 120px !important;
          }
        }



        /* ==================================================
           DASHBOARD DARK/LIGHT THEME FOR CHILD COMPONENTS
           ================================================== */

        /* ---------- DARK MODE ---------- */
        .dashboard-page.dark-mode .problem-input-card,
        .dashboard-page.dark-mode .ai-report-card,
        .dashboard-page.dark-mode .history-section {
          background: #0E0F0C !important;
          border-color: #163300 !important;
          color: #f0f5eb !important;
          box-shadow: none !important;
        }

        .dashboard-page.dark-mode .problem-input-header,
        .dashboard-page.dark-mode .ai-report-header,
        .dashboard-page.dark-mode .history-header {
          color: #f0f5eb !important;
        }

        .dashboard-page.dark-mode .problem-input-card h1,
        .dashboard-page.dark-mode .problem-input-card h2,
        .dashboard-page.dark-mode .problem-input-card h3,
        .dashboard-page.dark-mode .ai-report-card h1,
        .dashboard-page.dark-mode .ai-report-card h2,
        .dashboard-page.dark-mode .ai-report-card h3,
        .dashboard-page.dark-mode .history-header h2 {
          color: #f0f5eb !important;
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
          color: #454745 !important;
        }

        .dashboard-page.dark-mode .problem-textarea,
        .dashboard-page.dark-mode .language-selector,
        .dashboard-page.dark-mode .monaco-wrapper,
        .dashboard-page.dark-mode .code-editor,
        .dashboard-page.dark-mode .code-area {
          background: #0E0F0C !important;
          border-color: rgba(159,232,112,0.12) !important;
          color: #f0f5eb !important;
        }

        .dashboard-page.dark-mode .problem-textarea::placeholder {
          color: #454745 !important;
        }

        .dashboard-page.dark-mode .language-selector {
          color: #f0f5eb !important;
        }

        .dashboard-page.dark-mode .language-selector option {
          background: #0E0F0C !important;
          color: #f0f5eb !important;
        }

        .dashboard-page.dark-mode .problem-input-actions {
          border-color: #163300 !important;
        }

        .dashboard-page.dark-mode .reset-button {
          background: #0f1410 !important;
          border-color: #163300 !important;
          color: #454745 !important;
        }

        .dashboard-page.dark-mode .reset-button:hover {
          background: #0f1410 !important;
          color: #ffffff !important;
        }

        .dashboard-page.dark-mode .analysis-error {
          background: rgba(127,29,29,0.3) !important;
          border-color: rgba(248,113,113,0.3) !important;
          color: #fda4af !important;
        }

        .dashboard-page.dark-mode .ai-report-card .ai-status,
        .dashboard-page.dark-mode .ai-status.analyzed {
          background: #0f1410 !important;
          border-color: #163300 !important;
          color: #9FE870 !important;
        }

        .dashboard-page.dark-mode .ai-empty {
          background: #0E0F0C !important;
          border-color: rgba(159,232,112,0.12) !important;
          color: #454745 !important;
        }

        .dashboard-page.dark-mode .ai-pattern,
        .dashboard-page.dark-mode .metric-card,
        .dashboard-page.dark-mode .observation,
        .dashboard-page.dark-mode .report-column {
          background: #0E0F0C !important;
          border-color: rgba(159,232,112,0.12) !important;
        }

        .dashboard-page.dark-mode .metric-progress {
          background: #163300 !important;
        }

        .dashboard-page.dark-mode .pattern-row,
        .dashboard-page.dark-mode .report-bottom {
          border-color: rgba(159,232,112,0.12) !important;
        }

        .dashboard-page.dark-mode .history-item {
          background: #0E0F0C !important;
          border-color: rgba(159,232,112,0.12) !important;
          color: #f0f5eb !important;
        }

        .dashboard-page.dark-mode .history-item:hover {
          background: #0f1410 !important;
          border-color: #163300 !important;
        }

        .dashboard-page.dark-mode .history-item strong {
          color: #f0f5eb !important;
        }

        .dashboard-page.dark-mode .history-item-icon {
          background: #0f1410 !important;
          color: #9FE870 !important;
        }

        .dashboard-page.dark-mode .clear-history-button {
          background: #0f1410 !important;
          border-color: #163300 !important;
          color: #cbd5e1 !important;
        }

        .dashboard-page.dark-mode .clear-history-button:hover {
          background: #0f1410 !important;
          border-color: #163300 !important;
          color: #ffffff !important;
        }

        /* ---------- LIGHT MODE ---------- */
        .dashboard-page.light-mode .problem-input-card,
        .dashboard-page.light-mode .ai-report-card,
        .dashboard-page.light-mode .history-section {
          background: #ffffff !important;
          border-color: #D9DED5 !important;
          color: #0E0F0C !important;
        }

        .dashboard-page.light-mode .problem-textarea,
        .dashboard-page.light-mode .language-selector,
        .dashboard-page.light-mode .monaco-wrapper,
        .dashboard-page.light-mode .code-editor,
        .dashboard-page.light-mode .code-area {
          background: #ffffff !important;
          border-color: #D9DED5 !important;
          color: #0E0F0C !important;
        }

        .dashboard-page.light-mode .history-item {
          background: #f9fafb !important;
          border-color: #D9DED5 !important;
          color: #0E0F0C !important;
        }

        .dashboard-page.light-mode .history-item strong,
        .dashboard-page.light-mode .problem-input-card h1,
        .dashboard-page.light-mode .problem-input-card h2,
        .dashboard-page.light-mode .problem-input-card h3,
        .dashboard-page.light-mode .ai-report-card h1,
        .dashboard-page.light-mode .ai-report-card h2,
        .dashboard-page.light-mode .ai-report-card h3,
        .dashboard-page.light-mode .history-header h2 {
          color: #0E0F0C !important;
        }

        /* ==================================================
   DARK MODE â€” TEXT VISIBILITY FIX
   ================================================== */

.dashboard-page.dark-mode {
  color: #f0f5eb !important;
}

/* Main dashboard heading */
.dashboard-page.dark-mode .simple-dashboard-header h1 {
  color: #f0f5eb !important;
}

/* Workspace / section labels */
.dashboard-page.dark-mode .dashboard-eyebrow {
  color: #454745 !important;
}

.dashboard-page.dark-mode .thinkflow-section-label,
.dashboard-page.dark-mode .thinkflow-insights-label {
  color: #454745 !important;
}

/* Profile */
.dashboard-page.dark-mode .dashboard-profile strong {
  color: #f0f5eb !important;
}

.dashboard-page.dark-mode .dashboard-profile small {
  color: #454745 !important;
}

/* General headings */
.dashboard-page.dark-mode h1,
.dashboard-page.dark-mode h2,
.dashboard-page.dark-mode h3,
.dashboard-page.dark-mode h4 {
  color: #f0f5eb !important;
}

/* General paragraph text */
.dashboard-page.dark-mode p {
  color: #454745 !important;
}


/* Green accent text — dark mode */
.dashboard-page.dark-mode .thinkflow-insights-count {
  color: #9FE870 !important;
}



        /* ==================================================
           HISTORY DETAIL â€” ORIGINAL PROBLEM + CODE
           ================================================== */
        .dashboard-page .history-detail-card {
          width: 100%;
          margin: 0 0 22px;
          padding: 22px;
          box-sizing: border-box;
          border: 1px solid #163300;
          border-radius: 18px;
          background: #0E0F0C;
          box-shadow: 0 16px 45px rgba(0,0,0,.16);
        }

        .dashboard-page.light-mode .history-detail-card {
          background: #ffffff;
          border-color: #D9DED5;
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
          color: #f0f5eb;
          font-size: 16px;
          font-weight: 700;
        }

        .dashboard-page.light-mode .history-detail-title {
          color: #0E0F0C;
        }

        .history-detail-badge {
          display: inline-flex;
          align-items: center;
          height: 30px;
          padding: 0 10px;
          border-radius: 8px;
          border: 1px solid #163300;
          background: #0f1410;
          color: #9FE870;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        .dashboard-page.light-mode .history-detail-badge {
          border-color: #c4e8b0;
          background: #E2F6D5;
          color: #163300;
        }

        .history-detail-label {
          display: block;
          margin-bottom: 8px;
          color: #454745;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .dashboard-page.light-mode .history-detail-label {
          color: #454745;
        }

        .history-detail-problem {
          margin-bottom: 18px;
          padding: 14px 16px;
          border: 1px solid rgba(159,232,112,0.12);
          border-radius: 12px;
          background: #0E0F0C;
          color: #e2e8f0;
          font-size: 14px;
          line-height: 1.65;
          white-space: pre-wrap;
        }

        .dashboard-page.light-mode .history-detail-problem {
          background: #f0f5eb;
          border-color: #D9DED5;
          color: #0E0F0C;
        }

        .history-detail-code {
          margin: 0;
          padding: 18px;
          max-height: 430px;
          overflow: auto;
          box-sizing: border-box;
          border: 1px solid rgba(159,232,112,0.12);
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
          background: #f0f5eb;
          border-color: #D9DED5;
          color: #0E0F0C;
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
  background: #E2F6D5 !important;
}

.dashboard-page.light-mode
.thinkflow-code-editor
.monaco-editor
.current-line-margin {
  background: #E2F6D5 !important;
}


        /* ==================================================
           LOGOUT MODAL
           ================================================== */

        .logout-overlay {
          position: fixed !important;
          inset: 0 !important;
          z-index: 99998 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: rgba(0, 0, 0, 0.55) !important;
          backdrop-filter: blur(4px) !important;
          -webkit-backdrop-filter: blur(4px) !important;
          padding: 20px !important;
          box-sizing: border-box !important;
          animation: tfOverlayIn 0.18s ease !important;
        }

        @keyframes tfOverlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .logout-popup {
          position: relative !important;
          width: 100% !important;
          max-width: 400px !important;
          padding: 32px 28px 26px !important;
          border-radius: 20px !important;
          box-sizing: border-box !important;
          text-align: center !important;
          animation: tfModalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) !important;
          font-family: Poppins, -apple-system, BlinkMacSystemFont, sans-serif !important;
          /* default (dark) background â€” overridden by .dark-mode/.light-mode below */
          background: #0d1424 !important;
          border: 1px solid #163300 !important;
          box-shadow: 0 24px 60px rgba(0,0,0,0.55) !important;
          color: #f1f5f9 !important;
        }

        @keyframes tfModalIn {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }

        /* Dark mode card */
        .dark-mode .logout-popup {
          background: #0d1424 !important;
          border: 1px solid #163300 !important;
          box-shadow: 0 24px 60px rgba(0,0,0,0.55) !important;
          color: #f1f5f9 !important;
        }

        /* Light mode card */
        .light-mode .logout-popup {
          background: #ffffff !important;
          border: 1px solid #D9DED5 !important;
          box-shadow: 0 24px 60px rgba(15,23,42,0.14) !important;
          color: #0f172a !important;
        }

        .logout-popup-icon {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 48px !important;
          height: 48px !important;
          border-radius: 14px !important;
          margin: 0 auto 18px !important;
          color: #9FE870 !important;
        }

        .dark-mode .logout-popup-icon {
          background: #163300 !important;
          border: 1px solid rgba(159,232,112,0.10) !important;
        }

        .light-mode .logout-popup-icon {
          background: #E2F6D5 !important;
          border: 1px solid #E2F6D5 !important;
        }

        .logout-popup h3 {
          margin: 0 0 10px !important;
          font-size: 18px !important;
          font-weight: 600 !important;
          letter-spacing: -0.02em !important;
        }

        .dark-mode .logout-popup h3 {
          color: #f1f5f9 !important;
        }

        .light-mode .logout-popup h3 {
          color: #0f172a !important;
        }

        .logout-popup p {
          margin: 0 0 26px !important;
          font-size: 13.5px !important;
          line-height: 1.6 !important;
        }

        .dark-mode .logout-popup p {
          color: #454745 !important;
        }

        .light-mode .logout-popup p {
          color: #454745 !important;
        }

        .logout-popup-actions {
          display: flex !important;
          gap: 10px !important;
          justify-content: center !important;
        }

        .logout-cancel-button,
        .logout-confirm-button {
          flex: 1 !important;
          height: 42px !important;
          border-radius: 10px !important;
          border: none !important;
          font-size: 13.5px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          font-family: inherit !important;
          transition: opacity 0.15s ease, transform 0.15s ease !important;
        }

        .logout-cancel-button:hover,
        .logout-confirm-button:hover {
          opacity: 0.88 !important;
          transform: translateY(-1px) !important;
        }

        .logout-cancel-button:active,
        .logout-confirm-button:active {
          transform: translateY(0) !important;
        }

        .dark-mode .logout-cancel-button {
          background: #1e2740 !important;
          color: #454745 !important;
          border: 1px solid rgba(159,232,112,0.10) !important;
        }

        .light-mode .logout-cancel-button {
          background: #f1f5f9 !important;
          color: #454745 !important;
          border: 1px solid #e2e8f0 !important;
        }

        .logout-confirm-button {
          background: linear-gradient(135deg, #9FE870, #9FE870) !important;
          color: #ffffff !important;
          box-shadow: 0 4px 14px rgba(159,232,112,0.15) !important;
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

                    <Award size={18} color="#9FE870" />

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
                            ? ` â€¢ ${item.language}`
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
          className={`logout-overlay ${darkMode ? "dark-mode" : "light-mode"}`}
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