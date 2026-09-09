import { useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Sparkles,
  Play,
  RotateCcw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Editor from "@monaco-editor/react";

function ProblemInput({ onAnalysis, darkMode = true }) {
  const [language, setLanguage] = useState("python");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReset = () => {
    setProblem("");
    setSolution("");
    setError("");
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!problem.trim() || !solution.trim()) {
      setError("Please enter the problem and your solution.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problem,
          solution,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      onAnalysis(data);
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Something went wrong while analyzing your solution."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="problem-input-card glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* HEADER */}
      <div className="problem-input-header">
        <div>
          <span className="dashboard-eyebrow">
            THINKFLOW / ANALYZE
          </span>

          <h2>Submit your solution</h2>

          <p>
            Give ThinkFlow a problem and your approach. AI will analyze how
            you think.
          </p>
        </div>

        {/* LANGUAGE */}
        <div className="language-selector">
          <Code2 size={16} />

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </div>

      <form onSubmit={handleAnalyze}>
        {/* PROBLEM */}
        <div className="input-group problem-group">
          <label>Problem</label>

          <textarea
            className="problem-textarea"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Example: Find the largest number in an array."
            rows={3}
          />
        </div>

        {/* CODE */}
        <div className="input-group code-group">
          <div className="code-editor-label">
            <label>Your solution</label>

            <span className="editor-language">
              {language === "cpp" ? "C++" : language.toUpperCase()}
            </span>
          </div>

          <div className="monaco-wrapper">
            <Editor
  height="430px"
  language={language}
  theme={darkMode ? "vs-dark" : "vs"}
              value={solution}
              onChange={(value) => setSolution(value || "")}
              options={{
                fontSize: 15,

                fontFamily:
                  "JetBrains Mono, Fira Code, Consolas, monospace",

                lineHeight: 23,

                minimap: {
                  enabled: false,
                },

                automaticLayout: true,

                wordWrap: "on",

                scrollBeyondLastLine: false,

                smoothScrolling: true,

                cursorBlinking: "smooth",

                cursorSmoothCaretAnimation: "on",

                padding: {
                  top: 18,
                  bottom: 18,
                },

                tabSize: 4,

                insertSpaces: true,

                autoIndent: "full",

                bracketPairColorization: {
                  enabled: true,
                },

                guides: {
                  indentation: true,
                  bracketPairs: true,
                },

                quickSuggestions: true,

                lineNumbers: "on",

                renderLineHighlight: "line",

                overviewRulerBorder: false,

                hideCursorInOverviewRuler: true,

                folding: true,

                mouseWheelZoom: true,

                suggestOnTriggerCharacters: true,
              }}
            />
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="analysis-error">
            <AlertCircle size={17} />
            <span>{error}</span>
          </div>
        )}

        {/* BUTTONS */}
        <div className="problem-input-actions">
          <button
            type="button"
            className="reset-button"
            onClick={handleReset}
            disabled={loading}
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            type="submit"
            className="analyze-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="spin"
                />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={17} />
                Analyze Thinking
                <Play size={14} />
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default ProblemInput;