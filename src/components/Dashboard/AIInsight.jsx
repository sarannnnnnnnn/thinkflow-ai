import { motion } from "framer-motion";
import {
  Sparkles,
  Brain,
  Target,
  Bug,
  Layers3,
  Zap,
  Check,
  ArrowRight,
} from "lucide-react";

function AIInsight({ analysis }) {
  if (!analysis) {
    return (
      <section className="ai-report-card">
        <div className="ai-report-header">
          <div className="ai-report-title">
            <div className="ai-report-icon">
              <Sparkles size={20} />
            </div>

            <div>
              <span>AI ANALYSIS</span>
              <h2>Thinking Insight</h2>
            </div>
          </div>

          <div className="ai-status waiting">
            <span />
            WAITING
          </div>
        </div>

        <div className="ai-empty">
          <Brain size={42} />

          <h3>No analysis yet</h3>

          <p>
            Submit a problem and your solution to
            generate your AI analysis.
          </p>
        </div>
      </section>
    );
  }

  const metrics = [
    {
      icon: Target,
      name: "Algorithm Selection",
      value: Number(
        analysis.metrics?.algorithmSelection || 0
      ),
    },
    {
      icon: Bug,
      name: "Debugging",
      value: Number(
        analysis.metrics?.debugging || 0
      ),
    },
    {
      icon: Layers3,
      name: "Decomposition",
      value: Number(
        analysis.metrics?.decomposition || 0
      ),
    },
    {
      icon: Zap,
      name: "Optimization",
      value: Number(
        analysis.metrics?.optimization || 0
      ),
    },
  ];

  return (
    <motion.section
      className="ai-report-card"
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
    >

      {/* ================= HEADER ================= */}

      <div className="ai-report-header">

        <div className="ai-report-title">

          <div className="ai-report-icon">
            <Sparkles size={20} />
          </div>

          <div>
            <span>AI ANALYSIS</span>

            <h2>
              Thinking Insight
            </h2>
          </div>

        </div>

        <div className="ai-status analyzed">
          <span />
          ANALYZED
        </div>

      </div>


      {/* ================= PATTERN ================= */}

      <div className="ai-pattern">



        <div className="pattern-row">

          <div className="pattern-icon">
            <Brain size={25} />
          </div>

          <div className="pattern-content">

            <h3>
              {analysis.thinkingPattern}
            </h3>

            <p>
              {analysis.summary}
            </p>

          </div>

        </div>

      </div>


      {/* ================= METRICS ================= */}

      <div className="metrics-wrapper">

        <div className="report-label">
          THINKING METRICS
        </div>

        <div className="metrics-grid">

          {metrics.map((metric, index) => {

            const Icon = metric.icon;

            return (
              <motion.div
                className="metric-card"
                key={metric.name}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.06,
                }}
              >

                <div className="metric-top">

                  <div className="metric-title">

                    <Icon size={17} />

                    <span>
                      {metric.name}
                    </span>

                  </div>

                  <strong>
                    {metric.value}%
                  </strong>

                </div>

                <div className="metric-progress">

                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${metric.value}%`,
                    }}
                    transition={{
                      duration: 0.7,
                      delay:
                        0.15 +
                        index * 0.06,
                    }}
                  />

                </div>

              </motion.div>
            );
          })}

        </div>

      </div>


      {/* ================= OBSERVATION ================= */}

      <div className="observation">

        <div className="report-label">
          KEY OBSERVATION
        </div>

        <div className="observation-content">

          <Sparkles size={18} />

          <p>
            {analysis.observation}
          </p>

        </div>

      </div>


      {/* ================= BOTTOM ================= */}

      <div className="report-bottom">

        {/* STRENGTHS */}

        <div className="report-column">

          <div className="report-label">
            STRENGTHS
          </div>

          <div className="report-items">

            {(analysis.strengths || []).map(
              (item, index) => (
                <div
                  className="report-item"
                  key={index}
                >

                  <div className="check-icon">
                    <Check size={13} />
                  </div>

                  <p>
                    {item}
                  </p>

                </div>
              )
            )}

          </div>

        </div>


        {/* IMPROVEMENTS */}

        <div className="report-column">

          <div className="report-label">
            AREAS TO IMPROVE
          </div>

          <div className="report-items">

            {(analysis.improvements || []).map(
              (item, index) => (
                <div
                  className="report-item"
                  key={index}
                >

                  <div className="arrow-icon">
                    <ArrowRight size={13} />
                  </div>

                  <p>
                    {item}
                  </p>

                </div>
              )
            )}

          </div>

        </div>

      </div>

    </motion.section>
  );
}

export default AIInsight;