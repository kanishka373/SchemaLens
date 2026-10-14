import { useEffect, useState } from "react";

const steps = [
  "Connecting to database",
  "Discovering schema",
  "Analyzing relationships",
  "Preparing schema graph",
];

const CYAN = "#00d4ff";
const mono = { fontSize: "11px", color: CYAN, fontFamily: "monospace" };

const styles = {
  screen: {
    position: "fixed", inset: 0, zIndex: 9999, background: "radial-gradient(circle at center, rgba(0,212,255,0.06), transparent 45%), #020509",
    display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, system-ui, sans-serif", color: "#fff",
  },
  box: { width: "440px", maxWidth: "90%" },
  spinner: {
    width: "52px", height: "52px", margin: "0 auto 20px", borderRadius: "50%", border: "2px solid rgba(0,212,255,0.25)", borderTopColor: CYAN,
    animation: "spin 1.2s linear infinite", boxShadow: "0 0 30px rgba(0,212,255,0.18)",
  },
  title: { margin: 0, fontSize: "13px", letterSpacing: "4px", fontWeight: 700, color: CYAN },
  subtitle: { margin: "10px 0 0", fontSize: "12px", color: "#64748b" },
  line: { position: "absolute", left: "8px", top: "10px", bottom: "10px", width: "1px", background: "rgba(255,255,255,0.08)" },
  enter: {
    marginTop: "20px", height: "42px", display: "flex",
    alignItems: "center", justifyContent: "center", transition: "all 0.6s ease",
  },
  enterText: { fontSize: "12px", letterSpacing: "3px", color: "#00ffcc", fontWeight: 700, textShadow: "0 0 15px rgba(0,255,204,0.7)" },
};

function LoadingScreen({onDone}) {
  const [activeStep, setActiveStep] = useState(0);
  const [showEnter, setShowEnter] = useState(false);

    useEffect(() => {
    const timer = setInterval(
      () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1)),
      1000
    );
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeStep < steps.length - 1) return;
    const t1 = setTimeout(() => setShowEnter(true), 500);
    const t2 = setTimeout(onDone, 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [activeStep, onDone]);
  
  return (
    <div style={styles.screen}>
      <div style={styles.box}>
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "42px" }}>
          <div style={styles.spinner} />
          <h2 style={styles.title}>CONNECTING...</h2>
          <p style={styles.subtitle}>Preparing your database schema</p>
        </div>

        {/* Steps */}
        <div style={{ position: "relative", paddingLeft: "34px" }}>
          <div style={styles.line} />

          {steps.map((step, index) => {
            const completed = index < activeStep;
            const active = index === activeStep;
            const reached = completed || active;

            return (
              <div
                key={step}
                style={{
                  position: "relative", minHeight: "58px",
                  opacity: index <= activeStep ? 1 : 0.25,
                  transform: index <= activeStep ? "translateX(0)" : "translateX(8px)",
                  transition: "all 0.5s ease",
                }}
              >
                {/* Status dot */}
                <div
                  style={{
                    position: "absolute", left: "-30px", top: "4px",
                    width: "16px", height: "16px", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: completed ? CYAN : active ? "#020509" : "#111827",
                    border: reached ? `2px solid ${CYAN}` : "1px solid rgba(255,255,255,0.12)",
                    boxShadow: active
                      ? "0 0 18px rgba(0,212,255,0.8)"
                      : completed ? "0 0 12px rgba(0,212,255,0.4)" : "none",
                    transition: "all 0.4s ease",
                  }}
                >
                  {completed && (
                    <span style={{ color: "#020509", fontSize: "9px", fontWeight: 900 }}>✓</span>
                  )}
                  {active && (
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: CYAN, animation: "pulse 1s ease-in-out infinite" }} />
                  )}
                </div>

                {/* Text */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "24px" }}>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: reached ? 600 : 400,
                      color: active ? "#ffffff" : completed ? "#cbd5e1" : "#475569",
                    }}
                  >
                    {step}
                  </span>
                  {completed && <span style={mono}>COMPLETE</span>}
                  {active && <span style={{ ...mono, animation: "blink 1s infinite" }}>WORKING</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enter Schema */}
        <div
          style={{
            ...styles.enter,
            opacity: showEnter ? 1 : 0,
            transform: showEnter ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <span style={styles.enterText}>ENTERING SCHEMA...</span>
        </div>
      </div>

      <style>{`
        @keyframes spin  { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.65); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}

export default LoadingScreen;