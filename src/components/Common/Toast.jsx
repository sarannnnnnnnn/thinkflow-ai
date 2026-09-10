import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

/*
 * Toast
 *
 * Props:
 *   type      "success" | "error"
 *   title     string
 *   message   string
 *   darkMode  boolean
 *   onClose   () => void   called after exit animation
 *   duration  number (ms)  default 3000
 */
function Toast({
  type = "success",
  title,
  message,
  darkMode,
  onClose,
  duration = 3000,
}) {
  const [visible, setVisible] = useState(false);

  /* Trigger entrance on mount */
  useEffect(() => {
    const enterFrame = requestAnimationFrame(() => setVisible(true));

    const exitTimer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      cancelAnimationFrame(enterFrame);
      clearTimeout(exitTimer);
    };
  }, [duration]);

  /* After exit animation, call onClose */
  const handleTransitionEnd = () => {
    if (!visible) {
      onClose?.();
    }
  };

  const isSuccess = type === "success";

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 99999,
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "16px 18px",
        borderRadius: "14px",
        minWidth: "280px",
        maxWidth: "360px",
        boxShadow: darkMode
          ? "0 8px 32px rgba(0,0,0,0.45)"
          : "0 8px 32px rgba(15,23,42,0.14)",
        background: darkMode ? "#0E0F0C" : "#ffffff",
        border: darkMode
          ? `1px solid ${isSuccess ? "#163300" : "#3b1919"}`
          : `1px solid ${isSuccess ? "#E2F6D5" : "#fee2e2"}`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-12px)",
        transition: "opacity 0.28s ease, transform 0.28s ease",
        fontFamily:
          "Poppins, -apple-system, BlinkMacSystemFont, sans-serif",
        pointerEvents: "all",
      }}
    >
      {/* Icon */}
      <div
        style={{
          flexShrink: 0,
          marginTop: "1px",
          color: isSuccess ? "#9FE870" : "#f87171",
        }}
      >
        {isSuccess ? (
          <CheckCircle size={20} />
        ) : (
          <AlertCircle size={20} />
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: darkMode ? "#F4F6F1" : "#0E0F0C",
              marginBottom: message ? "3px" : 0,
              lineHeight: 1.3,
            }}
          >
            {title}
          </div>
        )}
        {message && (
          <div
            style={{
              fontSize: "12px",
              color: darkMode ? "#454745" : "#454745",
              lineHeight: 1.45,
            }}
          >
            {message}
          </div>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss"
        style={{
          flexShrink: 0,
          background: "none",
          border: "none",
          padding: "2px",
          cursor: "pointer",
          color: darkMode ? "#454745" : "#454745",
          display: "flex",
          alignItems: "center",
          borderRadius: "6px",
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default Toast;
