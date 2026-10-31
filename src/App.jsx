import React, { useEffect, useRef, useState, useCallback } from "react";
import { profile, stats, experience, projects, skills, achievements, education } from "./data.js";

const NAV = ["about", "pipeline", "experience", "projects", "skills", "contact"];
const hash = (s) => Array.from(s).reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 7).toString(16).replace("-", "").padStart(7, "0").slice(0, 7);

/* ---------- hooks ---------- */
function useInView() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, seen] = useInView();
  return <div ref={ref} className={`reveal ${seen ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function useTypewriter(words) {
  const [text, setText] = useState("");
  useEffect(() => {
    let w = 0, i = 0, del = false, t;
    const tick = () => {
      const word = words[w];
      i += del ? -1 : 1;
      setText(word.slice(0, i));
      let d = del ? 30 : 60;
      if (!del && i === word.length) { del = true; d = 1700; }
      else if (del && i === 0) { del = false; w = (w + 1) % words.length; d = 300; }
      t = setTimeout(tick, d);
    };
    t = setTimeout(tick, 500);
    return () => clearTimeout(t);
  }, [words]);
  return text;
}

function Counter({ value, suffix, decimals = 0 }) {
  const [ref, seen] = useInView();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const start = performance.now();
    let raf;
    const step = (now) => {
      const p = Math.min((now - start) / 1500, 1);
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, value]);
  return <span ref={ref}>{n.toFixed(decimals)}{suffix}</span>;
}

/* ---------- code rain (very subtle) ---------- */
function CodeRain() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const chars = "01{}[]<>/=;:$#ABCDEF";
    const size = 16;
    let cols, drops, raf, last = 0;
    const resize = () => {
      c.width = innerWidth; c.height = innerHeight;
      cols = Math.ceil(innerWidth / size);
      drops = Array.from({ length: cols }, () => Math.random() * -60);
    };
    const draw = (t) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 70) return;
      last = t;
      ctx.fillStyle = "rgba(5,8,12,.12)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.font = `${size - 2}px JetBrains Mono, monospace`;
      for (let i = 0; i < cols; i++) {
        if (i % 3) continue;
        ctx.fillStyle = Math.random() > 0.96 ? "rgba(120,255,200,.9)" : "rgba(40,200,150,.55)";
        ctx.fillText(chars[(Math.random() * chars.length) | 0], i * size, drops[i] * size);
        if (drops[i] * size > c.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    resize(); raf = requestAnimationFrame(draw);
    addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="rain" aria-hidden />;
}

/* ---------- glass panel with spotlight ---------- */
function Panel({ children, className = "", title, style }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} className={`panel ${className}`} style={style} onMouseMove={onMove}>
      {title && (
        <div className="panel-bar"><i /><i /><i /><span>{title}</span></div>
      )}
      {children}
    </div>
  );
}

const Heading = ({ n, title, cmd }) => (
  <Reveal className="heading">
    <span className="idx">{n}</span>
    <h2>{title}</h2>
    <code>{cmd}</code>
    <hr />
  </Reveal>
);

/* ---------- photo with graceful fallback ---------- */
function Photo() {
  const [ok, setOk] = useState(true);
  return (
    <div className="photo">
      <span className="br tl" /><span className="br tr" /><span className="br bl" /><span className="br bb" />
      <div className="photo-in">
        {ok ? (
          <img src={profile.photo} alt={profile.name} onError={() => setOk(false)} />
        ) : (
          <div className="mono-fallback">NK</div>
        )}
        <div className="scan" />
      </div>
      <div className="photo-tag"><i /> online · {profile.location}</div>
    </div>
  );
}

/* ---------- command palette ---------- */
function CommandPalette({ open, setOpen, actions }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef(null);
  const list = actions.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()));
  useEffect(() => { if (open) { setQ(""); setIdx(0); setTimeout(() => inputRef.current?.focus(), 30); } }, [open]);
  useEffect(() => setIdx(0), [q]);
  if (!open) return null;
  const run = (a) => { setOpen(false); a?.run(); };
  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, list.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter") run(list[idx]);
  };
  return (
    <div className="backdrop" onClick={() => setOpen(false)}>
      <div className="panel palette" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Command palette">
        <div className="prompt-line"><b>&gt;</b><input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="run command…" /></div>
        <ul>
          {list.map((a, i) => (
            <li key={a.label} className={i === idx ? "active" : ""} onMouseEnter={() => setIdx(i)} onClick={() => run(a)}>
              {a.label}<kbd>{a.hint}</kbd>
            </li>
          ))}
          {!list.length && <li className="empty">no matches</li>}
        </ul>
      </div>
    </div>
  );
}

/* ---------- architecture pipeline ---------- */
const PIPE = [
  { k: "Mobile Scan", s: "Experience Custom Card", t: "client" },
  { k: "API Gateway", s: "AuthN · routing", t: "aws" },
  { k: "Lambda", s: "validate · transform · log", t: "aws" },
  { k: "Ethos API", s: "Fixed Assets", t: "ellucian" },
  { k: "Banner ERP", s: "business APIs", t: "ellucian" },
  { k: "S3 Audit Log", s: "daily scan logs", t: "aws" },
];

/* ---------- app ---------- */
export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") return saved;
    } catch (error) {
      console.warn("Unable to read theme preference:", error);
    }
    return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.warn("Unable to save theme preference:", error);
    }
  }, [theme]);
  const toggleTheme = () => setTheme((current) => current === "dark" ? "light" : "dark");
  const role = useTypewriter(profile.roles);
  const [active, setActive] = useState("about");
  const [progress, setProgress] = useState(0);
  const [palette, setPalette] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const headerRef = useRef(null);
  const [skillTab, setSkillTab] = useState("All");
  const [openExp, setOpenExp] = useState(0);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [submission, setSubmission] = useState(null);
  const submittingRef = useRef(false);
  const [clock, setClock] = useState(new Date());
  const glowRef = useRef(null);

  const go = useCallback((id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const dismiss = (event) => {
      if (!headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [menuOpen]);

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      setProgress(max > 0 ? (scrollY / max) * 100 : 0);
      let cur = "about";
      for (const id of NAV) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < innerHeight * 0.4) cur = id;
      }
      setActive(cur);
    };
    const onMove = (e) => { if (glowRef.current) glowRef.current.style.transform = `translate(${e.clientX - 250}px, ${e.clientY - 250}px)`; };
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((p) => !p); }
      if (e.key === "Escape") setPalette(false);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("mousemove", onMove);
    addEventListener("keydown", onKey);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("mousemove", onMove); removeEventListener("keydown", onKey); };
  }, []);

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(profile.email); } catch { /* clipboard unavailable */ }
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };

  const actions = [
    ...NAV.map((id) => ({ label: `cd ~/${id}`, hint: "nav", run: () => go(id) })),
    { label: "toggle dark / light theme", hint: "theme", run: toggleTheme },
    { label: "copy email", hint: "copy", run: copyEmail },
    { label: "open github", hint: "link", run: () => open(profile.links.github, "_blank") },
    { label: "open linkedin", hint: "link", run: () => open(profile.links.linkedin, "_blank") },
    { label: "download resume", hint: "pdf", run: () => { const a = document.createElement("a"); a.href = "Naveenkumar Kalluri.pdf"; a.download = ""; a.click(); } },
  ];

  const send = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    if (!form.name.trim() || !form.message.trim()) {
      setSubmission({ type: "error", message: "Please enter your name and a message, not just spaces." });
      return;
    }
    submittingRef.current = true;
    setSending(true);
    setSubmission(null);
    const data = new FormData(e.currentTarget);
    data.set("name", form.name.trim());
    data.set("email", form.email.trim());
    data.set("message", form.message.trim());
    data.set("_subject", "New portfolio contact message");
    try {
      const response = await fetch("https://formspree.io/f/mzeejekv", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) {
        throw new Error(`Formspree rejected the submission (HTTP ${response.status}).`);
      }
      const result = await response.json();
      if (result.ok !== true) throw new Error("Formspree did not confirm the submission.");
      setSubmission({ type: "success", message: "Thanks! Your message was submitted successfully." });
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Contact submission failed:", error);
      setSubmission({
        type: "error",
        message: "Your message could not be confirmed. Please try again, or email me directly.",
      });
    } finally {
      submittingRef.current = false;
      setSending(false);
    }
  };

  const skillGroups = Object.entries(skills).filter(([k]) => skillTab === "All" || k === skillTab);
  const time = clock.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata" });

  return (
    <>
      <div className="bg" aria-hidden><div className="glow g1" /><div className="glow g2" /><div className="grid" /><div className="vignette" /></div>
      <CodeRain />
      <div className="cursor-glow" ref={glowRef} aria-hidden />
      <div className="progress" style={{ width: `${progress}%` }} />

      <header className="nav-wrap" ref={headerRef}>
        <nav className={`panel nav ${menuOpen ? "menu-open" : ""}`} aria-label="Main navigation">
          <a className="logo" href="#about" onClick={(e) => { e.preventDefault(); go("about"); }}>
            <span className="g">naveen</span><span className="d">@</span>portfolio<span className="d">:~$</span>
          </a>
          <ul id="section-navigation">
            {NAV.map((id, i) => (
              <li key={id}><a href={`#${id}`} className={active === id ? "on" : ""} onClick={(e) => { e.preventDefault(); go(id); }}><b>0{i + 1}</b> {id}</a></li>
            ))}
          </ul>
          <div className="nav-utilities">
            <button ref={menuButtonRef} className="utility-btn menu-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen} aria-controls="section-navigation"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                {menuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
            <button className="utility-btn" onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
              <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
              <span className="utility-label">{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
            <button className="kbtn" onClick={() => setPalette(true)} aria-label="Open command palette"><kbd>Ctrl</kbd><kbd>K</kbd></button>
          </div>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section id="about" className="hero">
          <div className="hero-copy">
            <Reveal><p className="cmd"><b>$</b> whoami</p></Reveal>
            <Reveal delay={80}><h1>{profile.name}</h1></Reveal>
            <Reveal delay={160}><p className="typed"><span className="g">&gt;</span> {role}<b className="caret" /></p></Reveal>
            <Reveal delay={240}><p className="lead">{profile.tagline}</p></Reveal>
            <Reveal delay={320}>
              <div className="cta">
                <a className="btn primary" href="#projects" onClick={(e) => { e.preventDefault(); go("projects"); }}>./view-projects</a>
                <a className="btn" href="Naveenkumar Kalluri.pdf" download>./resume.pdf</a>
                <a className="btn" href="#contact" onClick={(e) => { e.preventDefault(); go("contact"); }}>./contact</a>
              </div>
            </Reveal>
            <Reveal delay={400}>
              <div className="socials">
                <a href={profile.links.github} target="_blank" rel="noreferrer">github</a>
                <a href={profile.links.linkedin} target="_blank" rel="noreferrer">linkedin</a>
                <a href={profile.links.leetcode} target="_blank" rel="noreferrer">leetcode</a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={200} className="hero-side"><Photo /></Reveal>
        </section>

        {/* SYSTEM STRIP */}
        <section className="sys">
          <Reveal>
            <Panel title="system.status" className="sys-panel">
              <div className="sys-grid">
                {stats.map((s) => (
                  <div className="stat" key={s.label}>
                    <strong><Counter {...s} /></strong>
                    <span>{s.label}</span>
                  </div>
                ))}
                <div className="stat live">
                  <strong>{time}</strong>
                  <span>IST · currently @ Ellucian</span>
                </div>
              </div>
            </Panel>
          </Reveal>
        </section>

        {/* PIPELINE */}
        <section id="pipeline">
          <Heading n="01" title="Architecture I built" cmd="$ trace inventory-sync" />
          <Reveal>
            <Panel title="real-time-inventory.flow" className="pipe-panel">
              <div className="pipe">
                {PIPE.map((n, i) => (
                  <React.Fragment key={n.k}>
                    <div className={`node ${n.t}`} style={{ animationDelay: `${i * 0.35}s` }}>
                      <b>{n.k}</b><span>{n.s}</span>
                    </div>
                    {i < PIPE.length - 1 && <div className="wire"><i style={{ animationDelay: `${i * 0.35}s` }} /></div>}
                  </React.Fragment>
                ))}
              </div>
              <div className="legend"><span className="client">client</span><span className="aws">aws</span><span className="ellucian">ellucian</span>
                <em>// scan → validate → update Banner → archive audit log · 80% fewer manual corrections</em></div>
            </Panel>
          </Reveal>
        </section>

        {/* EXPERIENCE */}
        <section id="experience">
          <Heading n="02" title="Experience" cmd="$ git log --career" />
          <div className="log">
            {experience.map((e, i) => (
              <Reveal key={e.company} delay={i * 100}>
                <Panel className={`exp ${openExp === i ? "open" : ""}`}>
                  <button className="exp-head" onClick={() => setOpenExp(openExp === i ? -1 : i)} aria-expanded={openExp === i}>
                    <div>
                      <p className="commit"><span className="y">commit {hash(e.company)}</span> <span className="g">(HEAD{i === 0 ? " -> main" : ""})</span></p>
                      <h3>{e.role} <em>@ {e.company}</em></h3>
                      <p className="meta">{e.period} · {e.place} · {e.type}</p>
                    </div>
                    <span className="plus">{openExp === i ? "−" : "+"}</span>
                  </button>
                  <div className="exp-body"><div>
                    <ul>{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
                    <div className="tags">{e.tags.map((t) => <span key={t}>{t}</span>)}</div>
                  </div></div>
                </Panel>
              </Reveal>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects">
          <Heading n="03" title="Projects" cmd="$ ls ./projects" />
          <div className="projects">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={i * 110}>
                <Panel title={p.title.toLowerCase().replace(/[^a-z]+/g, "-") + "/README.md"} className="project" style={{ "--h": p.hue }}>
                  <div className="proj-body">
                    <p className="org">{p.org}</p>
                    <h3>{p.title}</h3>
                    <p className="desc">{p.desc}</p>
                    <ul className="metrics">{p.metrics.map((m) => <li key={m}>{m}</li>)}</ul>
                    <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
                    {p.link && <a className="proj-link" href={p.link} target="_blank" rel="noreferrer">$ git clone ↗</a>}
                  </div>
                </Panel>
              </Reveal>
            ))}
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills">
          <Heading n="04" title="Tech stack" cmd="$ cat stack.json" />
          <Reveal>
            <div className="tabs">
              {["All", ...Object.keys(skills)].map((t) => (
                <button key={t} className={skillTab === t ? "on" : ""} onClick={() => setSkillTab(t)}>{t}</button>
              ))}
            </div>
          </Reveal>
          <div className="skill-grid">
            {skillGroups.map(([group, items]) => (
              <Panel key={group} title={`${group.toLowerCase().replace(/[^a-z]+/g, "_")}.json`} className="skill-card">
                <div className="tags big">
                  {items.map((s, i) => <span key={s} style={{ animationDelay: `${i * 40}ms` }}>{s}</span>)}
                </div>
              </Panel>
            ))}
          </div>

          <div className="ach-edu">
            <Reveal>
              <Panel title="achievements.log" className="ach">
                <ul>
                  {achievements.map((a) => (
                    <li key={a.title}><b>[{a.icon}]</b><div><strong>{a.title}</strong><span>{a.text}</span></div></li>
                  ))}
                </ul>
              </Panel>
            </Reveal>
            <Reveal delay={100}>
              <Panel title="education.yml" className="edu">
                <pre>{`school: ${education.school}
degree: ${education.degree}
period: ${education.period}
gpa: ${education.gpa}`}</pre>
              </Panel>
            </Reveal>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <Heading n="05" title="Get in touch" cmd="$ ./connect --me" />
          <Reveal>
            <Panel title="contact.sh" className="contact">
              <div className="contact-info">
                <p>Hiring, collaborating, or have an integration problem to solve? Ping me.</p>
                <button className="copy" onClick={copyEmail}>{profile.email} <em>{copied ? "[copied]" : "[copy]"}</em></button>
                <a href={`tel:${profile.phone}`}>{profile.phone}</a>
                <span>{profile.location}</span>
              </div>
              <form onSubmit={send} aria-busy={sending}>
                <input required name="name" aria-label="Your name" autoComplete="name" disabled={sending}
                  placeholder="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input required name="email" aria-label="Your email" autoComplete="email" disabled={sending}
                  type="email" placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <textarea required name="message" aria-label="Your message" disabled={sending}
                  rows="4" placeholder="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                <p className="contact-notice">Your name, email, and message are sent through Formspree to deliver your inquiry.</p>
                <button className="btn primary" type="submit" disabled={sending}>
                  {sending ? "Sending..." : "./send-message"}
                </button>
                {submission && (
                  <p className={`form-feedback ${submission.type}`}
                    role={submission.type === "error" ? "alert" : "status"}>
                    {submission.message}
                    {submission.type === "error" && (
                      <> <a href={`mailto:${profile.email}`}>Email me directly</a>.</>
                    )}
                  </p>
                )}
              </form>
            </Panel>
          </Reveal>
        </section>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} {profile.name} · built with React · <kbd>Ctrl</kbd> <kbd>K</kbd> for command palette</p>
      </footer>

      <CommandPalette open={palette} setOpen={setPalette} actions={actions} />
    </>
  );
}
