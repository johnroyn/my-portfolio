import { useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import type * as ThreeTypes from "three";
import "../styles/gallery.css";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uRippleTime;
  uniform float uAspect;
  uniform vec2 uPointer;
  uniform vec2 uResolution;
  uniform vec3 uPaper;
  uniform vec3 uTeal;
  uniform vec3 uCoral;
  uniform vec3 uLime;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += noise(p) * amplitude;
      p = p * 2.02 + vec2(11.7, 8.3);
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 point = (vUv - 0.5) * vec2(uAspect, 1.0);
    vec2 pointer = (uPointer - 0.5) * vec2(uAspect, 1.0);
    float time = uTime * 0.12;
    float field = fbm(point * 1.25 + vec2(time * 0.45, -time * 0.32));
    field += fbm(point * 2.1 - vec2(time * 0.24, time * 0.36)) * 0.28;

    float teal = smoothstep(0.38, 0.78, field + 0.13 * sin(point.x * 2.8 + time));
    float coralMist = exp(-length((point - vec2(0.32, 0.2)) * vec2(0.72, 1.0)) * 2.8);
    float limeMist = exp(-length((point - vec2(-0.34, -0.22)) * vec2(0.9, 1.2)) * 3.2);
    vec3 color = mix(uPaper, uTeal, teal * 0.76);
    color = mix(color, uCoral, coralMist * smoothstep(0.38, 0.82, field) * 0.48);
    color = mix(color, uLime, limeMist * smoothstep(0.28, 0.76, field) * 0.46);

    float distanceToPointer = length(point - pointer);
    float age = max(uTime - uRippleTime, 0.0);
    float waveRadius = 0.035 + age * 0.28;
    float ripple = exp(-pow((distanceToPointer - waveRadius) * 24.0, 2.0)) * exp(-age * 1.4);
    float secondWave = exp(-pow((distanceToPointer - 0.075 - age * 0.21) * 19.0, 2.0)) * exp(-age * 1.65);
    color = mix(color, vec3(0.97, 0.95, 0.82), ripple * 0.72);
    color = mix(color, uCoral, secondWave * 0.28);

    float grain = hash(gl_FragCoord.xy + floor(uTime * 12.0)) - 0.5;
    color += grain * 0.018;
    gl_FragColor = vec4(color, 1.0);
  }
`;

function FluidCanvas(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let destroyed = false;
    let cleanup = () => {};
    const initialize = async () => {
      const THREE = await import("three");
      if (destroyed) return;

      let renderer: ThreeTypes.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "low-power" });
      } catch {
        canvas.dataset.webgl = "unavailable";
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      const scene = new THREE.Scene();
      const camera = new THREE.Camera();
      const uniforms = {
        uTime: { value: 0 },
        uRippleTime: { value: -10 },
        uAspect: { value: 1 },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uPaper: { value: new THREE.Color("#e8e1d4") },
        uTeal: { value: new THREE.Color("#155765") },
        uCoral: { value: new THREE.Color("#d6684e") },
        uLime: { value: new THREE.Color("#cad866") },
      };
      const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
      const geometry = new THREE.PlaneGeometry(2, 2);
      scene.add(new THREE.Mesh(geometry, material));
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let frame = 0;
      const startTime = performance.now();
      const draw = () => renderer.render(scene, camera);
      const render = (now: number) => {
        uniforms.uTime.value = (now - startTime) / 1000;
        draw();
        if (!reduceMotion) frame = requestAnimationFrame(render);
      };
      const renderRipple = (now: number) => {
        uniforms.uTime.value = (now - startTime) / 1000;
        draw();
        if (uniforms.uTime.value - uniforms.uRippleTime.value < 1.1) {
          frame = requestAnimationFrame(renderRipple);
        }
      };

      const resize = () => {
        const { clientWidth, clientHeight } = canvas;
        if (!clientWidth || !clientHeight) return;
        renderer.setSize(clientWidth, clientHeight, false);
        uniforms.uAspect.value = clientWidth / clientHeight;
        uniforms.uResolution.value.set(clientWidth, clientHeight);
        draw();
      };

      const updatePointer = (event: PointerEvent) => {
        const bounds = canvas.getBoundingClientRect();
        if (
          event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom
        ) return;
        uniforms.uPointer.value.set(
          (event.clientX - bounds.left) / bounds.width,
          1 - (event.clientY - bounds.top) / bounds.height,
        );
        uniforms.uRippleTime.value = uniforms.uTime.value;
        if (reduceMotion) {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(renderRipple);
        } else {
          draw();
        }
      };

      const observer = new ResizeObserver(resize);
      observer.observe(canvas);
      window.addEventListener("pointermove", updatePointer);
      resize();
      frame = requestAnimationFrame(render);

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        window.removeEventListener("pointermove", updatePointer);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    };

    void initialize().catch(() => {
      if (!destroyed) canvas.dataset.webgl = "unavailable";
    });
    return () => {
      destroyed = true;
      cleanup();
    };
  }, []);

  return <canvas aria-hidden="true" className="fluid-canvas" ref={canvasRef} />;
}

function ShadowFigure(): ReactElement {
  return (
    <svg className="shadow-figure" viewBox="0 0 520 700" role="img" aria-label="Original anime shadow character with silver hair and glasses">
      <defs>
        <linearGradient id="cloak" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#26313a" />
          <stop offset="0.58" stopColor="#080b10" />
          <stop offset="1" stopColor="#171b24" />
        </linearGradient>
        <linearGradient id="silver-hair" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.55" stopColor="#dbe6e8" />
          <stop offset="1" stopColor="#91a5aa" />
        </linearGradient>
        <radialGradient id="eye-glow">
          <stop stopColor="#e8f8ee" />
          <stop offset="1" stopColor="#6de6c4" />
        </radialGradient>
      </defs>
      <ellipse cx="265" cy="652" rx="190" ry="24" fill="#14252b" opacity="0.18" />
      <g className="figure-cloak">
        <path d="M100 665c12-157 60-221 147-250l14-43 100 16 14 29c68 34 106 115 123 248H100Z" fill="url(#cloak)" />
        <path d="m247 414 44 6 42 54-46 73-58-73 18-60Z" fill="#d8e0dd" />
        <path d="m268 441 25 6 20 59-33 43-32-43 20-59Z" fill="#b54c44" />
        <path d="M173 238c-7-83 32-147 94-154 78-8 126 49 113 151l-12 139c-5 55-49 91-99 89-54-2-88-47-91-101l-5-124Z" fill="#14191f" />
        <path d="M206 289c10-82 25-144 69-171 36 44 72 61 114 57l-15 144c-5 65-31 97-78 97-54 0-96-49-90-127Z" fill="#090c10" />
        <path className="figure-hair" d="M179 289c-31-74-17-168 26-216l-4-39 61 29 31-45 26 51 63-28-3 54c43 53 48 119 23 191l-34-55-15 79-35-67-39 39-24-67-42 67-8-81-28 67-12-60-24 47Z" fill="url(#silver-hair)" />
        <path d="M215 283c20-19 44-19 64 0M301 283c21-19 46-19 66 0" fill="none" stroke="#111a20" strokeWidth="11" strokeLinecap="round" />
        <g className="figure-glasses" fill="none" stroke="#c4d8d7" strokeWidth="8">
          <path d="M205 303c0-28 13-42 38-42h14c24 0 37 14 37 42s-13 42-37 42h-14c-25 0-38-14-38-42Z" />
          <path d="M300 303c0-28 13-42 37-42h14c25 0 38 14 38 42s-13 42-38 42h-14c-24 0-37-14-37-42Z" />
          <path d="M294 300h7M204 294l-20-7M390 294l18-8" />
        </g>
        <ellipse cx="256" cy="305" rx="7" ry="4" fill="url(#eye-glow)" className="figure-eye" />
        <ellipse cx="337" cy="305" rx="7" ry="4" fill="url(#eye-glow)" className="figure-eye" />
        <path d="M284 335c-7 25-6 41 7 46M267 389c17 9 36 9 52 0" fill="none" stroke="#9aa9a8" strokeWidth="5" strokeLinecap="round" opacity="0.62" />
        <path d="M182 324c-22 9-34 31-28 53M388 324c22 9 34 31 28 53" fill="none" stroke="#171d22" strokeWidth="20" strokeLinecap="round" />
      </g>
      <path d="M88 162c-28 110-28 233 3 330M434 164c29 111 29 223 0 328" fill="none" stroke="#f7f3e8" strokeWidth="1" opacity="0.25" />
    </svg>
  );
}

function ProjectArtwork({ kind }: { kind: "system" | "field" }): ReactElement {
  return (
    <div className={`project-artwork artwork-${kind}`} aria-hidden="true">
      <div className="art-grain" />
      <div className="art-topline"><span>JR / STUDY {kind === "system" ? "01" : "02"}</span><span>{kind === "system" ? "2025" : "2023"}</span></div>
      {kind === "system" ? (
        <div className="system-composition">
          <div className="system-window">
            <div className="system-window-top"><i /><i /><i /><span>EMPLOYEE / INDEX</span></div>
            <div className="system-row"><b>01</b><span /><em /></div>
            <div className="system-row"><b>02</b><span /><em /></div>
            <div className="system-row"><b>03</b><span /><em /></div>
            <div className="system-stamp">EPMS</div>
          </div>
          <div className="art-orbit" />
        </div>
      ) : (
        <div className="field-composition">
          <div className="field-sun" />
          <div className="field-horizon" />
          <div className="field-figure"><i /><b /></div>
          <div className="field-copy">LEARNING<br />IN THE<br />CLASSROOM</div>
        </div>
      )}
      <div className="art-bottomline"><span>{kind === "system" ? "INFORMATION / ORDER" : "OBSERVATION / CARE"}</span><span>CEBU, PH</span></div>
    </div>
  );
}

function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }): ReactElement {
  const cardRef = useRef<HTMLElement | null>(null);
  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch" || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    cardRef.current.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
    cardRef.current.style.setProperty("--tilt-y", `${(x - 0.5) * 7}deg`);
    cardRef.current.style.setProperty("--shine-x", `${x * 100}%`);
    cardRef.current.style.setProperty("--shine-y", `${y * 100}%`);
  };

  return (
    <article
      className={`project-card ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        cardRef.current?.style.setProperty("--tilt-x", "0deg");
        cardRef.current?.style.setProperty("--tilt-y", "0deg");
      }}
      ref={cardRef}
    >
      {children}
    </article>
  );
}

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function GalleryHome(): ReactElement {
  const [terminalMode, setTerminalMode] = useState(false);

  useEffect(() => {
    let typed = "";
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setTerminalMode(false);
        typed = "";
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey || event.key.length !== 1) return;
      typed = `${typed}${event.key.toLowerCase()}`.slice(-6);
      if (typed.endsWith("shadow")) {
        setTerminalMode((active) => !active);
        typed = "";
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    const revealTargets = document.querySelectorAll<HTMLElement>(".reveal-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.14 },
    );
    revealTargets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`gallery-site${terminalMode ? " terminal-mode" : ""}`}>
      <header className="gallery-header">
        <a className="gallery-mark" href="#top" aria-label="John Roy, home"><span>JR</span><i>VISUAL / SYSTEMS</i></a>
        <nav aria-label="Main navigation">
          {links.map((link) => <a href={link.href} key={link.label}>{link.label}</a>)}
        </nav>
        <a className="header-contact" href="mailto:johnroynengasca@gmail.com">LET'S TALK <span>↗</span></a>
      </header>

      {terminalMode && (
        <div className="terminal-status" role="status"><span className="terminal-led" /> SHADOW PROTOCOL // ACTIVE <span className="terminal-cursor">_</span></div>
      )}

      <main>
        <section className="gallery-hero" id="top">
          <FluidCanvas />
          <div className="hero-grain" />
          <div className="hero-frame">
            <div className="hero-copy">
              <p className="eyebrow reveal-on-scroll">INDEPENDENT DIGITAL PRACTICE <span>—</span> CEBU, PH</p>
              <h1 className="hero-title reveal-on-scroll">Building<br /><span>quietly</span><br />remarkable things.</h1>
              <p className="hero-description reveal-on-scroll">I’m John Roy, an IT student and developer drawn to the meeting point of useful systems and considered design.</p>
              <a className="text-link reveal-on-scroll" href="#work">EXPLORE SELECTED WORK <span>↓</span></a>
            </div>
            <div className="hero-art reveal-on-scroll">
              <div className="art-caption"><span>FIG. 01</span><span>THE QUIET BUILDER</span></div>
              <ShadowFigure />
              <div className="hero-side-note">A STUDY IN<br />LIGHT / SHADOW</div>
            </div>
            <div className="hero-foot"><span>PORTFOLIO / MMXXVI</span><span>MOVE THROUGH THE CANVAS</span><span>01 — 04</span></div>
          </div>
        </section>

        <section className="work-section" id="work">
          <div className="section-heading reveal-on-scroll"><div><p className="eyebrow">SELECTED CASE FILES / 01—02</p><h2>People, systems,<br /><em>and what connects them.</em></h2></div><p className="section-aside">A small archive of things learned by making, helping, and paying close attention.</p></div>
          <div className="project-grid">
            <TiltCard className="project-card-primary">
              <ProjectArtwork kind="system" />
              <div className="project-meta"><span>01 / CAPSTONE · 2025</span><span>C# / .NET / SQL</span></div>
              <h3>Employee Profile<br />Management System</h3>
              <p>A web-based employee records tool built from requirements through documentation and project defense.</p>
              <div className="project-bottom"><span>NORTHEASTERN CEBU COLLEGES</span><span>CAPSTONE RECORD</span></div>
            </TiltCard>
            <TiltCard className="project-card-secondary">
              <ProjectArtwork kind="field" />
              <div className="project-meta"><span>02 / WORK IMMERSION · 2023</span><span>EDUCATION</span></div>
              <h3>Learning in<br />the classroom</h3>
              <p>Supported Grade 3 reading, writing, classroom records, and daily learning at Aloguinsan Central Elementary School.</p>
              <div className="project-bottom"><span>ALOGUINSAN, CEBU</span><span>IMMERSION RECORD</span></div>
            </TiltCard>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-index reveal-on-scroll"><span>02</span><i>PROFILE / 2026</i></div>
          <div className="about-copy reveal-on-scroll"><p className="eyebrow">A LITTLE ABOUT THE AUTHOR</p><h2>Curious by nature.<br /><em>Grounded in people.</em></h2><p>I’m pursuing a Bachelor of Science in Information Technology at Northeastern Cebu Colleges, after completing an Associate in Computer Technology. I like learning unfamiliar tools, making information easier to use, and being thoughtful about the people on the other side of a screen.</p><a className="text-link" href="/John_Roy_Nengasca_Resume.pdf" target="_blank" rel="noreferrer">OPEN MY RESUME <span>↗</span></a></div>
          <div className="about-facts reveal-on-scroll"><div><span>01</span><p>BS INFORMATION<br />TECHNOLOGY</p><small>EXPECTED 2027</small></div><div><span>02</span><p>ASSOCIATE IN<br />COMPUTER TECHNOLOGY</p><small>COMPLETED 2025</small></div><div><span>03</span><p>TOOLS OF THE TRADE</p><small>HTML · CSS · JS · C# · .NET</small></div></div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-orbit" aria-hidden="true" />
          <p className="eyebrow reveal-on-scroll">HAVE A GOOD QUESTION OR A GOOD PROJECT?</p>
          <h2 className="reveal-on-scroll">Let’s make<br /><em>something matter.</em></h2>
          <a className="contact-email reveal-on-scroll" href="mailto:johnroynengasca@gmail.com">johnroynengasca@gmail.com <span>↗</span></a>
          <div className="contact-links"><a href="https://linkedin.com/in/john-roy-nengasca-bb888a423" target="_blank" rel="noreferrer">LINKEDIN ↗</a><a href="tel:+639057301660">+63 905 730 1660</a><span>CEBU CITY, PHILIPPINES</span></div>
        </section>
      </main>

      <footer className="gallery-footer"><a href="#top">JR / BACK TO THE CANVAS ↑</a><span>© 2026 JOHN ROY NENGASCA</span><span>MADE WITH INTENTION.</span></footer>
    </div>
  );
}
