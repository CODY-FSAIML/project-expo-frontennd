import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const TEAL = "#20b29b";
const BLUE = "#388ab4";
const AMBER = "#d98c3c";
const BG = "#050e12";

/* ── Fonts ── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Lexend:wght@300;400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${BG}; }
    ::placeholder { color: rgba(80,140,132,0.35) !important; font-family: Lexend, sans-serif; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${BG}; }
    ::-webkit-scrollbar-thumb { background: rgba(32,178,155,0.3); border-radius: 99px; }
    .lex { font-family: 'Lexend', sans-serif; }
    .pf  { font-family: 'Playfair Display', Georgia, serif; }
  `}</style>
);

/* ── FadeIn ── */
function FadeIn({ children, delay = 0, y = 24 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

/* ── Aurora BG ── */
function Aurora() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: BG }} />
      {[
        { top: "-20%", left: "-15%", size: "70vw", color: "rgba(32,178,155,0.15)", dur: 7, delay: 0 },
        { bottom: "0", right: "-15%", size: "55vw", color: "rgba(217,140,60,0.1)", dur: 9, delay: 2 },
        { top: "35%", left: "25%", size: "40vw", color: "rgba(56,138,180,0.09)", dur: 11, delay: 4 },
      ].map((o, i) => (
        <motion.div key={i}
          style={{ position: "absolute", top: o.top, bottom: o.bottom, left: o.left, right: o.right,
            width: o.size, height: o.size, borderRadius: "50%",
            background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: o.dur, repeat: Infinity, ease: "easeInOut", delay: o.delay }} />
      ))}
      <div style={{ position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(32,178,155,0.06) 1px, transparent 1px)",
        backgroundSize: "40px 40px" }} />
      <div style={{ position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(5,14,18,0.7) 100%)" }} />
    </div>
  );
}

/* ── Live Dot ── */
function LiveDot() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <motion.div style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL, flexShrink: 0 }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.5, 1, 0.5],
          boxShadow: ["0 0 0px #20b29b", "0 0 14px #20b29b", "0 0 0px #20b29b"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
      <span className="lex" style={{ fontSize: 10, letterSpacing: "0.2em", color: TEAL,
        fontWeight: 600, textTransform: "uppercase" }}>System Active · Real-time Analysis</span>
    </div>
  );
}

/* ── Ring Progress ── */
function Ring({ value, color, label, size = 100 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const [v, setV] = useState(0);
  useEffect(() => { const t = setTimeout(() => setV(value), 300); return () => clearTimeout(t); }, [value]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
            strokeWidth="6" strokeLinecap="round" strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (v / 100) * circ }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: `drop-shadow(0 0 8px ${color}88)` }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="lex" style={{ fontSize: "1.2rem", fontWeight: 800, color: "#e8f8f5" }}>{v}%</span>
        </div>
      </div>
      <span className="lex" style={{ fontSize: 10, fontWeight: 600, color,
        letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

/* ── Risk Badge ── */
function RiskBadge({ level }) {
  const map = {
    Low:    { bg: "rgba(32,178,120,0.13)", border: "#20b278", color: "#4ade80", icon: "✓", msg: "Likely Safe" },
    Medium: { bg: "rgba(217,140,60,0.13)",  border: "#d98c3c", color: "#fbbf24", icon: "⚠", msg: "Be Cautious" },
    High:   { bg: "rgba(220,60,60,0.16)",   border: "#dc3c3c", color: "#f87171", icon: "✕", msg: "High Danger" },
  };
  const s = map[level] || map.Medium;
  return (
    <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 14 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        padding: "12px 18px", borderRadius: 16, background: s.bg,
        border: `1.5px solid ${s.border}45`, boxShadow: `0 0 24px ${s.border}28` }}>
      <span style={{ fontSize: "1.4rem" }}>{s.icon}</span>
      <span className="lex" style={{ color: s.color, fontWeight: 800, fontSize: 11,
        letterSpacing: "0.12em", textTransform: "uppercase" }}>{level} Risk</span>
      <span className="lex" style={{ color: s.color, fontSize: 10, opacity: 0.75, fontWeight: 300 }}>{s.msg}</span>
    </motion.div>
  );
}

/* ── File Drop Zone ── */
function FileDropZone({ tab, onFile, hasError }) {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const accept = tab === "video"
    ? "video/mp4,video/quicktime,.mp4,.mov,.avi,.webm"
    : "audio/mpeg,audio/wav,.mp3,.wav,.m4a,.ogg";

  const pick = f => { if (!f) return; setFile(f); onFile(f); };
  const remove = e => { e.stopPropagation(); setFile(null); onFile(null); if (ref.current) ref.current.value = ""; };

  return (
    <>
      <input ref={ref} type="file" accept={accept} style={{ display: "none" }}
        onChange={e => pick(e.target.files?.[0])} />
      <motion.div
        onClick={() => !file && ref.current?.click()}
        onDrop={e => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files?.[0]); }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        animate={{
          borderColor: dragging ? "rgba(32,178,155,0.85)" : file ? "rgba(32,178,155,0.5)" : hasError ? "rgba(220,60,60,0.5)" : "rgba(32,178,155,0.2)",
          background: dragging ? "rgba(32,178,155,0.1)" : file ? "rgba(32,178,155,0.05)" : "rgba(32,178,155,0.02)",
          scale: dragging ? 1.01 : 1,
        }}
        style={{ height: 150, borderRadius: 14, cursor: file ? "default" : "pointer",
          border: "2px dashed rgba(32,178,155,0.2)",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: 8, userSelect: "none" }}>

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "0 16px", width: "100%" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(32,178,155,0.15)",
                border: "2px solid rgba(32,178,155,0.5)", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "1.2rem", color: TEAL }}>✓</div>
              <p className="lex" style={{ fontSize: 12, fontWeight: 500, color: "#4ecfc0",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 280 }}>{file.name}</p>
              <p className="lex" style={{ fontSize: 10, fontWeight: 300, color: "rgba(130,195,185,0.5)" }}>
                {(file.size/1024/1024).toFixed(2)} MB</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={e => { e.stopPropagation(); ref.current?.click(); }}
                  className="lex" style={{ padding: "5px 14px", borderRadius: 8, cursor: "pointer",
                    border: "1px solid rgba(32,178,155,0.3)", background: "rgba(32,178,155,0.08)",
                    fontSize: 11, fontWeight: 500, color: TEAL }}>Replace</button>
                <button onClick={remove} className="lex"
                  style={{ padding: "5px 14px", borderRadius: 8, cursor: "pointer",
                    border: "1px solid rgba(220,60,60,0.25)", background: "rgba(220,60,60,0.06)",
                    fontSize: 11, fontWeight: 500, color: "#f87171" }}>Remove</button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, textAlign: "center", padding: "0 20px" }}>
              <span style={{ fontSize: "2.2rem" }}>{dragging ? "📂" : tab === "video" ? "🎥" : "🎙️"}</span>
              <p className="lex" style={{ fontSize: 13, fontWeight: 400,
                color: dragging ? "#4ecfc0" : "rgba(150,205,195,0.65)" }}>
                {dragging ? "Drop to upload" : "Click to choose or drag & drop"}</p>
              <p className="lex" style={{ fontSize: 10, fontWeight: 300, color: "rgba(100,160,150,0.4)" }}>
                {tab === "video" ? "MP4, MOV, AVI, WEBM" : "MP3, WAV, M4A, OGG"}</p>
              <span className="lex" style={{ marginTop: 2, padding: "4px 12px", borderRadius: 8,
                background: "rgba(32,178,155,0.1)", border: "1px solid rgba(32,178,155,0.22)",
                fontSize: 11, fontWeight: 500, color: TEAL }}>Browse files</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

/* ── Simulated backend — swap with real fetch() when Django is running ── */
async function runAnalysis(tab, text) {
  await new Promise(r => setTimeout(r, 3200));
  const keys = ["lottery","won","prize","urgent","click","verify","internship","earn",
    "otp","account","suspend","bank","password","free","act now","kyc","congratulations","whatsapp"];
  const hits = tab === "text"
    ? keys.filter(k => (text || "").toLowerCase().includes(k)).length
    : Math.floor(Math.random() * 5) + 2;
  const fake = Math.min(96, 14 + hits * 12 + Math.floor(Math.random() * 15));
  const real = 100 - fake;
  const risk = fake > 60 ? "High" : fake > 33 ? "Medium" : "Low";
  const exps = {
    High: ["⚠ Urgency manipulation detected — designed to make you panic","⚠ Matches known scam/phishing templates with high confidence","⚠ Requests sensitive personal data under false legitimacy","⚠ AI verdict: high probability fraudulent — do not respond","💡 Legitimate banks never ask for OTPs or passwords via message"],
    Medium: ["⚠ Some phrases used in social engineering attacks found","⚠ Mild urgency triggers present — verify before responding","⚠ Source credibility cannot be confirmed from this message alone","💡 Call the organization on their official number to confirm"],
    Low: ["✓ No strong fraud indicators detected","✓ Language pattern appears natural and coherent","✓ No suspicious links or data-harvesting attempts found","💡 Content appears legitimate — good instinct checking anyway"],
  };
  return { fakeScore: fake, realScore: real, risk, explanations: exps[risk] };
}

/* ── Analyzer ── */
function Analyzer({ analyzerRef }) {
  const [text, setText] = useState("");
  const [tab, setTab] = useState("text");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [results, setResults] = useState(null);
  const [file, setFile] = useState(null);
  const [warn, setWarn] = useState("");
  const [err, setErr] = useState("");

  const STEPS = ["Sending to analysis server...","Cross-referencing fraud database...","Running AI pattern analysis...","Generating risk report..."];

  const reset = () => { setResults(null); setText(""); setFile(null); setWarn(""); setErr(""); };
  const switchTab = id => { setTab(id); reset(); };

  const validate = () => {
    if (tab === "text" && !text.trim()) { setWarn("Please paste or type a message before analyzing."); return false; }
    if (tab !== "text" && !file) { setWarn(`Please upload a ${tab} file before analyzing.`); return false; }
    setWarn(""); return true;
  };

  const analyze = async () => {
    if (!validate()) return;
    setLoading(true); setResults(null); setErr(""); setStep(0);
    const timer = setInterval(() => setStep(p => p < STEPS.length - 1 ? p + 1 : p), 750);
    try {
      const data = await runAnalysis(tab, text);
      clearInterval(timer); setStep(STEPS.length); setResults(data);
    } catch (e) {
      clearInterval(timer);
      setErr(e.message?.includes("fetch") ? "Cannot reach server. Is Django running on localhost:8000?" : e.message);
    } finally { setLoading(false); }
  };

  const riskBorder = results ? (results.risk === "High" ? "rgba(220,60,60,0.3)" : results.risk === "Medium" ? "rgba(217,140,60,0.3)" : "rgba(32,178,155,0.3)") : "";

  return (
    <section ref={analyzerRef} style={{ padding: "50px 20px 80px", position: "relative" }}>
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div className="lex" style={{ display: "inline-block", padding: "5px 16px", borderRadius: 99,
            marginBottom: 16, background: "rgba(32,178,155,0.07)", border: "1px solid rgba(32,178,155,0.18)",
            fontSize: 10, fontWeight: 600, color: TEAL, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            AI Analysis Engine
          </div>
          <h2 className="pf" style={{ fontSize: "clamp(1.7rem,4vw,2.8rem)", fontWeight: 700,
            color: "#e8f8f5", marginBottom: 10, lineHeight: 1.2 }}>
            Paste It Here.<br />
            <em style={{ fontStyle: "italic", opacity: 0.6, fontSize: "0.68em" }}>We'll tell you the truth.</em>
          </h2>
          <p className="lex" style={{ color: "rgba(150,205,195,0.6)", fontSize: "0.9rem",
            fontWeight: 300, maxWidth: 420, margin: "0 auto", lineHeight: 1.9 }}>
            No judgment. Nothing stored. Just clarity when you need it most.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ borderRadius: 26, padding: 2,
            background: "linear-gradient(135deg,rgba(32,178,155,0.38),rgba(56,138,180,0.28),rgba(217,140,60,0.18))",
            boxShadow: "0 0 60px rgba(32,178,155,0.08),0 28px 80px rgba(0,0,0,0.5)" }}>
            <div style={{ borderRadius: 24, padding: "28px 30px",
              background: "rgba(5,13,20,0.97)", backdropFilter: "blur(30px)" }}>

              {/* Tabs */}
              <div style={{ display: "flex", gap: 7, marginBottom: 18 }}>
                {[{id:"text",label:"📝 Text / SMS"},{id:"video",label:"🎥 Video"},{id:"audio",label:"🎙️ Audio"}].map(t => (
                  <motion.button key={t.id} onClick={() => switchTab(t.id)}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="lex"
                    style={{ padding: "8px 14px", borderRadius: 10, cursor: "pointer",
                      fontWeight: tab === t.id ? 600 : 400, fontSize: 12,
                      background: tab === t.id ? `linear-gradient(135deg,${TEAL},${BLUE})` : "rgba(32,178,155,0.06)",
                      color: tab === t.id ? "#fff" : "rgba(130,190,180,0.55)",
                      border: tab !== t.id ? "1px solid rgba(32,178,155,0.12)" : "none",
                      transition: "all 0.25s" }}>{t.label}</motion.button>
                ))}
              </div>

              {/* Input */}
              <AnimatePresence mode="wait">
                {tab === "text" ? (
                  <motion.div key="txt" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
                    <textarea value={text}
                      onChange={e => { setText(e.target.value); setWarn(""); setErr(""); }}
                      placeholder="Paste the suspicious SMS, email, link or internship offer here... You are safe. This is just between you and the AI."
                      className="lex"
                      style={{ width: "100%", height: 140, borderRadius: 12, padding: "13px 15px",
                        background: "rgba(32,178,155,0.04)",
                        border: warn ? "1.5px solid rgba(220,60,60,0.5)" : "1.5px solid rgba(32,178,155,0.13)",
                        color: "#cceee8", fontSize: 13.5, fontWeight: 300, lineHeight: 1.8,
                        resize: "none", outline: "none", caretColor: TEAL, boxSizing: "border-box" }}
                      onFocus={e => e.target.style.borderColor = "rgba(32,178,155,0.45)"}
                      onBlur={e => e.target.style.borderColor = warn ? "rgba(220,60,60,0.5)" : "rgba(32,178,155,0.13)"} />
                  </motion.div>
                ) : (
                  <motion.div key={tab} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
                    <FileDropZone tab={tab} hasError={!!warn}
                      onFile={f => { setFile(f); setWarn(""); setErr(""); }} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Warning */}
              <AnimatePresence>
                {warn && (
                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
                    exit={{ opacity:0, height:0 }} style={{ overflow:"hidden" }}>
                    <div className="lex" style={{ marginTop: 9, padding: "9px 13px", borderRadius: 10,
                      background: "rgba(220,60,60,0.08)", border: "1px solid rgba(220,60,60,0.3)",
                      display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#fca5a5" }}>
                      ⚠️ {warn}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* API Error */}
              <AnimatePresence>
                {err && (
                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
                    exit={{ opacity:0, height:0 }} style={{ overflow:"hidden" }}>
                    <div style={{ marginTop: 9, padding: "11px 14px", borderRadius: 10,
                      background: "rgba(220,60,60,0.07)", border: "1px solid rgba(220,60,60,0.25)" }}>
                      <p className="lex" style={{ fontSize: 12, fontWeight: 600, color: "#f87171", marginBottom: 3 }}>Analysis Failed</p>
                      <p className="lex" style={{ fontSize: 11, fontWeight: 300, color: "rgba(250,180,180,0.7)", lineHeight: 1.6 }}>{err}</p>
                      <button onClick={() => setErr("")} className="lex"
                        style={{ marginTop: 7, padding: "3px 11px", borderRadius: 6, cursor: "pointer",
                          border: "1px solid rgba(220,60,60,0.3)", background: "rgba(220,60,60,0.07)",
                          fontSize: 10, color: "#f87171" }}>Dismiss</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Analyze Button */}
              <motion.button onClick={analyze} disabled={loading}
                whileHover={!loading ? { scale:1.02, boxShadow:"0 0 50px rgba(32,178,155,0.35)" } : {}}
                whileTap={!loading ? { scale:0.98 } : {}}
                className="lex"
                style={{ width: "100%", marginTop: 14, padding: "13px", borderRadius: 13, border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  background: loading ? "rgba(32,178,155,0.2)" : `linear-gradient(135deg,${TEAL},${BLUE})`,
                  color: "#fff", fontWeight: 600, fontSize: "0.9rem",
                  letterSpacing: "0.03em", position: "relative", overflow: "hidden" }}>
                {loading && (
                  <motion.span style={{ position:"absolute", inset:0,
                    background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)" }}
                    animate={{ x:["-100%","100%"] }} transition={{ duration:1.3, repeat:Infinity }} />
                )}
                <span style={{ position:"relative", zIndex:1 }}>
                  {loading ? "🧠  AI is analyzing..." : "⚡  Analyze This Now"}
                </span>
              </motion.button>

              {/* Loading Steps */}
              <AnimatePresence>
                {loading && (
                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
                    exit={{ opacity:0, height:0 }} style={{ marginTop: 22, overflow:"hidden" }}>
                    {STEPS.map((s, i) => (
                      <motion.div key={s} initial={{ opacity:0, x:-8 }}
                        animate={{ opacity: step >= i ? 1 : 0.25, x:0 }}
                        transition={{ delay: i*0.05 }}
                        style={{ marginBottom: 11 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:5 }}>
                          <motion.div animate={step >= i ? { scale:[1,1.5,1], opacity:[0.5,1,0.5] } : {}}
                            transition={{ duration:1.5, repeat:Infinity }}
                            style={{ width:6, height:6, borderRadius:"50%", flexShrink:0,
                              background: step >= i ? TEAL : "rgba(32,178,155,0.18)" }} />
                          <span className="lex" style={{ fontSize:12, fontWeight:300,
                            color: step >= i ? "#9ed8d0" : "rgba(90,140,135,0.35)" }}>{s}</span>
                        </div>
                        <div style={{ height:2, borderRadius:99, background:"rgba(32,178,155,0.08)",
                          overflow:"hidden", marginLeft:15 }}>
                          <motion.div style={{ height:"100%", borderRadius:99,
                            background:`linear-gradient(90deg,${TEAL},${BLUE})` }}
                            initial={{ width:0 }}
                            animate={{ width: step > i ? "100%" : step === i ? "55%" : "0%" }}
                            transition={{ duration:0.6 }} />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results */}
              <AnimatePresence>
                {results && (
                  <motion.div initial={{ opacity:0, y:16, scale:0.97 }}
                    animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0 }}
                    transition={{ duration:0.6, ease:[0.22,1,0.36,1] }} style={{ marginTop:24 }}>
                    <div style={{ borderRadius:18, padding:22, background:"rgba(32,178,155,0.03)",
                      border:`1.5px solid ${riskBorder}` }}>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:18, alignItems:"center",
                        justifyContent:"center", marginBottom:20 }}>
                        <Ring value={results.fakeScore} color="#f87171" label="Fake Score" />
                        <Ring value={results.realScore} color="#34d399" label="Real Score" />
                        <RiskBadge level={results.risk} />
                      </div>
                      <p className="lex" style={{ fontSize:10, fontWeight:600,
                        color:"rgba(120,180,170,0.45)", letterSpacing:"0.16em",
                        textTransform:"uppercase", marginBottom:10 }}>What the AI Found</p>
                      <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                        {results.explanations.map((exp, i) => (
                          <motion.div key={i} className="lex"
                            initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                            transition={{ delay: i*0.08 }}
                            style={{ fontSize:12.5, fontWeight:300,
                              color:"rgba(190,230,225,0.82)", lineHeight:1.75,
                              padding:"8px 12px", borderRadius:9,
                              background:"rgba(32,178,155,0.04)",
                              borderLeft:`2.5px solid rgba(32,178,155,0.28)` }}>{exp}</motion.div>
                        ))}
                      </div>
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}
                        className="lex"
                        style={{ marginTop:14, padding:"11px 14px", borderRadius:11,
                          background:"rgba(56,138,180,0.07)", border:"1px solid rgba(56,138,180,0.14)",
                          fontSize:12, fontWeight:300, color:"rgba(150,210,220,0.72)",
                          textAlign:"center", lineHeight:1.7 }}>
                        {results.risk === "High"
                          ? "🛑 Do not respond or click any links. You checked before acting — that was the right move."
                          : results.risk === "Medium"
                          ? "🟡 Proceed carefully. Verify through an official channel before sharing any information."
                          : "✅ This content appears safe. Good instinct checking — you are in control."}
                      </motion.div>
                      <div style={{ textAlign:"center", marginTop:13 }}>
                        <motion.button onClick={reset} className="lex"
                          whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                          style={{ padding:"7px 18px", borderRadius:9, cursor:"pointer",
                            border:"1px solid rgba(32,178,155,0.25)", background:"rgba(32,178,155,0.07)",
                            fontSize:12, fontWeight:500, color:TEAL }}>
                          ↩ Analyze Something Else
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

/* ── Navbar ── */
function Navbar({ onCTA }) {
  return (
    <motion.nav initial={{ y:-20, opacity:0 }} animate={{ y:0, opacity:1 }}
      transition={{ duration:0.8, ease:[0.22,1,0.36,1] }}
      style={{ position:"sticky", top:0, zIndex:100, padding:"14px 28px",
        background:"rgba(5,14,18,0.88)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(32,178,155,0.1)",
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <span className="pf" style={{ fontWeight:700, fontSize:"1.05rem", color:"#e8f8f5" }}>
        TruthGuard<span style={{ color:TEAL }}> AI</span>
      </span>
      <motion.button onClick={onCTA} className="lex"
        whileHover={{ scale:1.06, boxShadow:"0 0 28px rgba(32,178,155,0.5)" }} whileTap={{ scale:0.95 }}
        style={{ padding:"8px 18px", borderRadius:10, border:"none", cursor:"pointer",
          background:`linear-gradient(135deg,${TEAL},${BLUE})`,
          color:"#fff", fontWeight:600, fontSize:12 }}>Analyze Free</motion.button>
    </motion.nav>
  );
}

/* ── Hero ── */
function Hero({ onCTA }) {
  return (
    <section style={{ minHeight:"80vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", textAlign:"center",
      padding:"60px 20px 40px", position:"relative" }}>
      <motion.div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-52%)",
        width:"500px", height:"320px", borderRadius:"50%", pointerEvents:"none",
        background:`radial-gradient(ellipse, rgba(32,178,155,0.12) 0%, rgba(56,138,180,0.07) 40%, transparent 68%)` }}
        animate={{ scale:[1,1.07,1], opacity:[0.7,1,0.7] }}
        transition={{ duration:5.5, repeat:Infinity, ease:"easeInOut" }} />

      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.9, delay:0.1 }} style={{ marginBottom:24 }}>
        <LiveDot />
      </motion.div>

      <motion.h1 className="pf" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:1, delay:0.2, ease:[0.22,1,0.36,1] }}
        style={{ fontSize:"clamp(2.2rem,5.5vw,4.5rem)", fontWeight:800,
          lineHeight:1.1, color:"#e8f8f5", marginBottom:8 }}>
        Know What's{" "}
        <span style={{ background:`linear-gradient(128deg,${TEAL} 0%,#4ecfc0 40%,${AMBER} 100%)`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Real.</span>
        <br /><em style={{ fontSize:"0.62em", opacity:0.75 }}>Instantly. Calmly. Clearly.</em>
      </motion.h1>

      <motion.p className="lex" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.9, delay:0.4 }}
        style={{ fontSize:"clamp(0.9rem,1.8vw,1.1rem)", fontWeight:300, lineHeight:1.85,
          color:"rgba(160,215,205,0.72)", maxWidth:520, marginBottom:40 }}>
        Got a suspicious message? Unsure if that call was real?{" "}
        <span style={{ color:"#4ecfc0", fontWeight:500 }}>Take a breath.</span>{" "}
        Paste it below — our AI will tell you the truth in seconds.
      </motion.p>

      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.8, delay:0.6 }}
        style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
        <motion.button onClick={onCTA} className="lex"
          whileHover={{ scale:1.06, boxShadow:"0 0 50px rgba(32,178,155,0.4)" }} whileTap={{ scale:0.96 }}
          style={{ padding:"13px 32px", borderRadius:13, border:"none", cursor:"pointer",
            background:`linear-gradient(135deg,${TEAL},${BLUE})`,
            color:"#fff", fontWeight:600, fontSize:"0.95rem",
            position:"relative", overflow:"hidden" }}>
          <motion.span style={{ position:"absolute", inset:0,
            background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)" }}
            animate={{ x:["-100%","100%"] }}
            transition={{ duration:2.8, repeat:Infinity, ease:"easeInOut", repeatDelay:1 }} />
          <span style={{ position:"relative", zIndex:1 }}>⚡ Check It Now — Free</span>
        </motion.button>
      </motion.div>

      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1, duration:1 }}
        style={{ display:"flex", gap:36, marginTop:52, flexWrap:"wrap", justifyContent:"center" }}>
        {[["98.7%","Accuracy"],["2.4M+","Threats Blocked"],["< 3s","Analysis"],["100%","Free"]].map(([v,l]) => (
          <div key={l} style={{ textAlign:"center" }}>
            <div className="pf" style={{ fontSize:"1.7rem", fontWeight:700, color:"#e8f8f5", marginBottom:3 }}>{v}</div>
            <div className="lex" style={{ fontSize:10, color:"rgba(130,180,175,0.5)", fontWeight:300,
              letterSpacing:"0.1em", textTransform:"uppercase" }}>{l}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

/* ── Features ── */
function Features() {
  const feats = [
    {icon:"🔍",title:"Text & SMS Detection",desc:"Identifies lottery scams, fake job offers, OTP phishing with 98.7% accuracy.",color:TEAL},
    {icon:"🎭",title:"Deepfake Video Analysis",desc:"Frame-by-frame detection of synthetic faces and GAN artifacts.",color:BLUE},
    {icon:"🎙️",title:"Voice Clone Detection",desc:"Spectral fingerprinting to expose AI-synthesized speech.",color:AMBER},
    {icon:"🔗",title:"Phishing Link Scanner",desc:"Domain age, SSL and redirect chain analysis before you click.",color:TEAL},
    {icon:"📊",title:"Risk Scoring",desc:"0–100 confidence score with full explainability.",color:BLUE},
    {icon:"🧠",title:"Plain-English Reports",desc:"Clear findings that tell you exactly what to do next.",color:AMBER},
  ];
  return (
    <section style={{ padding:"50px 20px" }}>
      <FadeIn>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <h2 className="pf" style={{ fontSize:"clamp(1.6rem,3.5vw,2.6rem)", fontWeight:700, color:"#e8f8f5", marginBottom:8 }}>
            Six Ways We Protect You</h2>
          <p className="lex" style={{ color:"rgba(150,205,195,0.55)", fontSize:"0.88rem", fontWeight:300, maxWidth:400, margin:"0 auto" }}>
            Specialized detection modules working in parallel.</p>
        </div>
      </FadeIn>
      <div style={{ maxWidth:900, margin:"0 auto", display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>
        {feats.map((f,i) => (
          <FadeIn key={f.title} delay={i*0.07}>
            <motion.div whileHover={{ y:-4, boxShadow:`0 18px 48px ${f.color}14,0 0 0 1.5px ${f.color}30` }}
              style={{ borderRadius:18, padding:"22px 24px 26px",
                background:"rgba(32,178,155,0.025)", border:"1px solid rgba(32,178,155,0.09)", cursor:"default" }}>
              <div style={{ width:40, height:40, borderRadius:11, marginBottom:14,
                background:`${f.color}12`, border:`1px solid ${f.color}22`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem" }}>{f.icon}</div>
              <h3 className="pf" style={{ fontSize:"1rem", fontWeight:700, color:"#cce8e3", marginBottom:7 }}>{f.title}</h3>
              <p className="lex" style={{ fontSize:12.5, fontWeight:300, color:"rgba(140,195,185,0.6)", lineHeight:1.8 }}>{f.desc}</p>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ── App ── */
export default function App() {
  const analyzerRef = useRef(null);
  const scrollToAnalyzer = () => analyzerRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });

  return (
    <div style={{ minHeight:"100vh", background:BG, color:"#e8f8f5", overflowX:"hidden" }}>
      <FontLoader />
      <Aurora />
      <div style={{ position:"relative", zIndex:10 }}>
        <Navbar onCTA={scrollToAnalyzer} />
        <Hero onCTA={scrollToAnalyzer} />
        <Analyzer analyzerRef={analyzerRef} />
        <Features />
        <footer style={{ padding:"32px 20px", borderTop:"1px solid rgba(32,178,155,0.08)", textAlign:"center" }}>
          <p className="lex" style={{ fontSize:12, fontWeight:300, color:"rgba(90,140,135,0.4)" }}>
            © 2025 TruthGuard AI · Free for everyone · No data stored · No ads</p>
        </footer>
      </div>
    </div>
  );
}


