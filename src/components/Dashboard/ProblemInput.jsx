import { useState } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Sparkles,
  Play,
  RotateCcw,
  Loader2,
} from "lucide-react";

function ProblemInput({ onAnalysis }) {
  const [language, setLanguage] = useState("Python");
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
      setError("Please enter both the problem and your solution.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
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
    } catch (error) {
      console.error(error);
      setError(
        error.message || "Unable to connect to the AI engine."
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
      <div className="problem-input-header">
        <div className="problem-input-title">
          <div className="problem-input-icon">
            <Sparkles size={19} />
          </div>

          <div>
            <span>THINKFLOW ENGINE</span>
            <h2>Analyze your thinking</h2>
          </div>
        </div>

        <div className="language-select">
          <Code2 size={15} />

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>Python</option>
            <option>JavaScript</option>
            <option>Java</option>
            <option>C++</option>
          </select>
        </div>
      </div>

      <form onSubmit={handleAnalyze}>
        <div className="problem-input-grid">
          <div className="input-block">
            <label>PROBLEM</label>

            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe the coding problem you're solving..."
              rows={8}
            />
          </div>

          <div className="input-block">
            <label>YOUR SOLUTION</label>

            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Paste or write your solution here..."
              rows={8}
              className="code-input"
            />
          </div>
        </div>

        {error && (
          <div className="analysis-error">
            {error}
          </div>
        )}

        <div className="problem-input-footer">
          <button
            type="button"
            className="reset-button"
            onClick={handleReset}
            disabled={loading}
          >
            <RotateCcw size={15} />
            Reset
          </button>

          <button
            type="submit"
            className="analyze-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={15} className="spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play size={15} />
                Analyze thinking
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default ProblemInput;