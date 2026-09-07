import { motion } from "framer-motion";
import {
  Sparkles,
  Brain,
  Target,
  Bug,
  Layers3,
  Zap,
  ArrowUpRight,
} from "lucide-react";

function AIInsight({ analysis }) {
  const metrics = analysis
    ? [
        {
          icon: Target,
          name: "Algorithm Selection",
          value: analysis.metrics.algorithmSelection,
        },
        {
          icon: Bug,
          name: "Debugging",
          value: analysis.metrics.debugging,
        },
        {
          icon: Layers3,
          name: "Decomposition",
          value: analysis.metrics.decomposition,
        },
        {
          icon: Zap,
          name: "Optimization",
          value: analysis.metrics.optimization,
        },
      ]
    : [
        {
          icon: Target,
          name: "Algorithm Selection",
          value: 82,
        },
        {
          icon: Bug,
          name: "Debugging",
          value: 91,
        },
        {
          icon: Layers3,
          name: "Decomposition",
          value: 74,
        },
        {
          icon: Zap,
          name: "Optimization",
          value: 61,
        },
      ];

  return (
    <motion.div
      className="ai-insight-card glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="ai-insight-header">
        <div className="ai-insight-title">
          <div className="ai-insight-icon">
            <Sparkles size={18} />
          </div>

          <div>
            <span>THINKFLOW ENGINE</span>
            <h2>AI Insight</h2>
          </div>
        </div>

        <div className="ai-live">
          <span />
          {analysis ? "ANALYZED" : "READY"}
        </div>
      </div>

      <div className="ai-pattern">
        <div className="ai-pattern-icon">
          <Brain size={22} />
        </div>

        <div>
          <span>PRIMARY THINKING PATTERN</span>

          <h3>
            {analysis
              ? analysis.thinkingPattern
              : "Awaiting analysis"}
          </h3>
        </div>
      </div>

      <div className="ai-metrics">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;

          return (
            <motion.div
              className="ai-metric"
              key={metric.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
              }}
            >
              <div className="ai-metric-top">
                <div className="ai-metric-name">
                  <Icon size={14} />
                  <span>{metric.name}</span>
                </div>

                <strong>{metric.value}%</strong>
              </div>

              <div className="ai-metric-track">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${metric.value}%`,
                  }}
                  transition={{
                    duration: 0.9,
                    delay: 0.2 + index * 0.08,
                    ease: "easeOut",
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="ai-observation">
        <div className="ai-observation-label">
          <Sparkles size={13} />
          KEY OBSERVATION
        </div>

        <p>
          {analysis
            ? analysis.observation
            : "Submit a problem and your solution to generate a personalized AI observation."}
        </p>
      </div>

      {analysis && (
        <div className="ai-summary">
          <div className="ai-observation-label">
            <Brain size={13} />
            AI SUMMARY
          </div>

          <p>{analysis.summary}</p>
        </div>
      )}

      <button className="ai-insight-action">
        View detailed analysis
        <ArrowUpRight size={16} />
      </button>
    </motion.div>
  );
}

export default AIInsight;