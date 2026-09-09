import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Code2, RotateCcw, Sparkles } from "lucide-react";

function ProblemInput({ onAnalysis }) {
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("thinkflow_theme") !== "light";
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const dashboard = document.querySelector(".dashboard-page");

    const syncTheme = () => {
      const dark =
        dashboard?.classList.contains("dark-mode") ??
        (localStorage.getItem("thinkflow_theme") !== "light");

      setIsDarkMode(dark);
    };

    syncTheme();

    const observer = dashboard
      ? new MutationObserver(syncTheme)
      : null;

    observer?.observe(dashboard, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const handleStorage = (event) => {
      if (event.key === "thinkflow_theme") {
        syncTheme();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      observer?.disconnect();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);



  const languageMap = {
    javascript: "javascript",
    typescript: "typescript",
    python: "python",
    c: "c",
    cpp: "cpp",
    java: "java",
  };

  const handleEditorMount = (editor) => {
    editor.focus();
  };

  const handleAnalyze = async () => {
    if (!problem.trim()) {
      setError("Please enter the problem statement.");
      return;
    }

    if (!solution.trim()) {
      setError("Please enter your solution/code.");
      return;
    }

    const token = sessionStorage.getItem("thinkflow_token");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    if (!apiUrl) {
      setError("API URL is not configured.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          problem: problem.trim(),
          solution,
          language,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        sessionStorage.removeItem("thinkflow_token");
        sessionStorage.removeItem("thinkflow_user");
        setError("Your session has expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze the solution.");
      }

      onAnalysis?.(data);
    } catch (err) {
      console.error("AI analysis error:", err);
      setError(err.message || "Failed to analyze the solution.");
    } finally {
      setLoading(false);
    }
  };

  const resetEditor = () => {
    setProblem("");
    setSolution("");
    setError("");
  };

  return (
    <section className="problem-input-card">
      <div className="problem-input-header">
        <div>
          <span className="dashboard-eyebrow">THINKFLOW / ANALYZE</span>
          <h2>Analyze your thinking</h2>
          <p>
            Enter the problem and your solution. ThinkFlow will analyze the
            reasoning behind it.
          </p>
        </div>

        <div className="problem-input-icon">
          <Code2 size={20} />
        </div>
      </div>

      <div className="problem-question">
        <label htmlFor="problem-statement">Problem statement</label>
        <input
          id="problem-statement"
          type="text"
          value={problem}
          onChange={(event) => setProblem(event.target.value)}
          placeholder="e.g. Find the two numbers that add up to a target..."
        />
      </div>

      <div className="code-editor-label-row">
        <div className="code-editor-label">
          <label>Your solution</label>
        </div>

        <select
          className="language-selector"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          aria-label="Programming language"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
      </div>

      <div className="thinkflow-editor-outer">
        <div className="thinkflow-code-editor">
          <Editor
            height="420px"
            language={languageMap[language] || "python"}
            value={solution}
            onChange={(value) => {
              setSolution(value ?? "");
              setError("");
            }}
            onMount={handleEditorMount}
            theme={isDarkMode ? "vs-dark" : "vs"}
            options={{
              readOnly: false,
              domReadOnly: false,
              automaticLayout: true,

              // Real Monaco line numbers.
              lineNumbers: "on",
              lineNumbersMinChars: 3,
              glyphMargin: false,

              // Real code indentation.
              autoIndent: "full",
              tabSize: 4,
              insertSpaces: true,
              detectIndentation: false,
              formatOnType: true,

              // Syntax highlighting.
              semanticHighlighting: { enabled: true },

              minimap: { enabled: false },
              folding: true,
              foldingHighlight: true,
              renderLineHighlight: "line",
              renderWhitespace: "selection",
              scrollBeyondLastLine: false,
              wordWrap: "off",

              fontSize: 14,
              lineHeight: 22,
              fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
              padding: { top: 14, bottom: 14 },

              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",

              // IMPORTANT: Enter stays Monaco's native Enter command.
              // This preserves newline + automatic indentation.
              acceptSuggestionOnEnter: "off",

              scrollbar: {
                vertical: "auto",
                horizontal: "auto",
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
                alwaysConsumeMouseWheel: true,
                useShadows: false,
              },

              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              stickyScroll: { enabled: false },
              contextmenu: true,
              quickSuggestions: true,
              suggestOnTriggerCharacters: true,
            }}
          />
        </div>
      </div>

      {error && <div className="analysis-error">{error}</div>}

      <div className="problem-input-actions">
        <button
          type="button"
          className="reset-button"
          onClick={resetEditor}
          disabled={loading}
        >
          <RotateCcw size={15} />
          Reset
        </button>

        <button
          type="button"
          className="analyze-button"
          onClick={handleAnalyze}
          disabled={loading}
        >
          <Sparkles size={16} />
          {loading ? "Analyzing..." : "Analyze with AI"}
        </button>
      </div>

      <style>{`
        /* =========================================
           EDITOR OUTER PADDING
           ========================================= */

        .thinkflow-editor-outer {
          width: 100% !important;
          box-sizing: border-box !important;
          padding: 0 14px !important;
          margin: 0 !important;
        }

        .thinkflow-code-editor {
          position: relative !important;
          width: 100% !important;
          height: 420px !important;
          min-height: 420px !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
          border: 1px solid #202743 !important;
          border-radius: 14px !important;
          background: #050816 !important;
          isolation: isolate;
        }

        /* =========================================
           MONACO — DO NOT USE GLOBAL .line-numbers
           ========================================= */

        .thinkflow-code-editor .monaco-editor,
        .thinkflow-code-editor .monaco-editor-background,
        .thinkflow-code-editor .monaco-scrollable-element,
        .thinkflow-code-editor .margin,
        .thinkflow-code-editor .margin-view-overlays,
        .thinkflow-code-editor .lines-content,
        .thinkflow-code-editor .view-overlays {
          background: #050816 !important;
        }

        .thinkflow-code-editor .monaco-editor .line-numbers {
          background: transparent !important;
          color: #68738F !important;
          font-weight: 600 !important;
        }

        .thinkflow-code-editor .monaco-editor .active-line-number {
          color: #A78BFA !important;
        }

        .thinkflow-code-editor .monaco-editor .current-line {
          background: #0B1024 !important;
          border: 0 !important;
        }

        .thinkflow-code-editor .monaco-editor textarea,
        .thinkflow-code-editor .monaco-editor .inputarea {
          caret-color: #A78BFA !important;
        }

        .thinkflow-code-editor .monaco-scrollable-element > .scrollbar > .slider {
          border-radius: 999px !important;
        }

        .thinkflow-code-editor .monaco-editor .scroll-decoration {
          box-shadow: none !important;
        }

        /* =========================================
           LABEL + LANGUAGE DROPDOWN
           ========================================= */

        .code-editor-label-row {
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) auto !important;
          align-items: center !important;
          width: 100% !important;
          gap: 16px !important;
          margin: 22px 0 10px !important;
          box-sizing: border-box !important;
        }

        .code-editor-label-row .code-editor-label {
          min-width: 0 !important;
          margin: 0 !important;
        }

        .code-editor-label-row .code-editor-label label {
          display: block !important;
          margin: 0 !important;
        }

        .code-editor-label-row .language-selector {
          grid-column: 2 !important;
          grid-row: 1 !important;
          width: 156px !important;
          min-width: 156px !important;
          height: 44px !important;
          margin: 0 !important;
          box-sizing: border-box !important;
        }

        /* =========================================
           LIGHT MODE
           ========================================= */

        .dashboard-page.light-mode .thinkflow-code-editor {
          background: #ffffff !important;
          border-color: #dfe3ea !important;
        }

        .dashboard-page.light-mode .thinkflow-code-editor .monaco-editor,
        .dashboard-page.light-mode .thinkflow-code-editor .monaco-editor-background,
        .dashboard-page.light-mode .thinkflow-code-editor .monaco-scrollable-element,
        .dashboard-page.light-mode .thinkflow-code-editor .margin,
        .dashboard-page.light-mode .thinkflow-code-editor .margin-view-overlays,
        .dashboard-page.light-mode .thinkflow-code-editor .lines-content,
        .dashboard-page.light-mode .thinkflow-code-editor .view-overlays {
          background: #ffffff !important;
        }

        .dashboard-page.light-mode .thinkflow-code-editor .monaco-editor .line-numbers {
          color: #8B93A7 !important;
        }

        .dashboard-page.light-mode .thinkflow-code-editor .monaco-editor .active-line-number {
          color: #6366F1 !important;
        }

        @media (max-width: 700px) {
          .thinkflow-editor-outer {
            padding: 0 8px !important;
          }

          .thinkflow-code-editor {
            height: 360px !important;
            min-height: 360px !important;
          }

          .code-editor-label-row {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }

          .code-editor-label-row .language-selector {
            grid-column: 1 !important;
            grid-row: 2 !important;
            width: 100% !important;
            min-width: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}

export default ProblemInput;
