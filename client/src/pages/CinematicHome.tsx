import React, { useEffect, useRef, type ReactElement } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "../styles/cinematic.css";

gsap.registerPlugin(ScrollTrigger);

function AnimePortrait({ compact = false }: { compact?: boolean }): ReactElement {
  return (
    <svg
      className={compact ? "portrait-illustration portrait-illustration-compact" : "portrait-illustration"}
      viewBox="0 0 520 680"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Anime-inspired portrait of John Roy wearing glasses with white hair"
    >
      <defs>
        <linearGradient id="portrait-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9e1e5" />
          <stop offset="0.55" stopColor="#9ba9b5" />
          <stop offset="1" stopColor="#27313b" />
        </linearGradient>
        <linearGradient id="portrait-coat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#17222c" />
          <stop offset="1" stopColor="#06080b" />
        </linearGradient>
        <linearGradient id="portrait-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#dce5e8" />
          <stop offset="1" stopColor="#8997a2" />
        </linearGradient>
        <filter id="portrait-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#05080b" floodOpacity="0.4" />
        </filter>
      </defs>

      <rect width="520" height="680" rx="18" fill="url(#portrait-bg)" />
      <path d="M0 500C120 440 220 455 520 350V680H0Z" fill="#111a22" opacity="0.42" />
      <g filter="url(#portrait-shadow)">
        <path d="M126 680c12-124 78-188 134-188s122 64 134 188H126Z" fill="url(#portrait-coat)" />
        <path d="M221 497h78l30 70-68 54-70-54 30-70Z" fill="#c2ccd1" />
        <path d="M245 510h30l16 53-31 31-31-31 16-53Z" fill="#8f2735" opacity="0.85" />
        <path d="M187 301c0-105 36-167 80-167 54 0 91 62 91 167v83c0 75-42 125-91 125-48 0-80-50-80-125v-83Z" fill="#d79e85" />
        <path d="M181 315c-21-77-9-175 61-204 70-30 146 20 151 105l-23 108-29-87c-28 22-69 38-123 31l-28 72-9-25Z" fill="url(#portrait-hair)" />
        <path d="M188 238c35-26 65-55 84-91 22 31 65 53 116 62l-16-61c-30-57-95-75-150-43-42 25-54 78-34 133Z" fill="#f5f8f9" />
        <path d="M195 275c17-13 32-38 40-67M326 210c12 25 30 45 54 60M218 188c-8 35-8 70-1 104" fill="none" stroke="#aab8c0" strokeWidth="10" strokeLinecap="round" />
        <path d="M211 313c22-15 47-14 65 0M301 313c20-14 46-15 66 0" fill="none" stroke="#18212a" strokeWidth="9" strokeLinecap="round" />
        <circle cx="250" cy="331" r="37" fill="none" stroke="#17232d" strokeWidth="8" />
        <circle cx="334" cy="331" r="37" fill="none" stroke="#17232d" strokeWidth="8" />
        <path d="M287 331h10" stroke="#17232d" strokeWidth="8" strokeLinecap="round" />
        <path d="M242 332h15M326 332h15" stroke="#eaf5ff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
        <path d="M286 348c-6 24-7 43 3 49" fill="none" stroke="#a36f61" strokeWidth="5" strokeLinecap="round" />
        <path d="M263 421c19 13 43 13 61 0" fill="none" stroke="#7b3540" strokeWidth="6" strokeLinecap="round" />
        <path d="M178 312c-18 5-23 26-10 42M363 312c19 5 24 26 10 42" fill="none" stroke="#d79e85" strokeWidth="15" strokeLinecap="round" />
      </g>
      <path d="M36 44h126M36 64h76M358 610h126M408 630h76" stroke="#fff" strokeWidth="2" opacity="0.5" />
      <text x="36" y="625" fill="#fff" fontSize="14" letterSpacing="4" opacity="0.78">JOHN ROY / PROFILE</text>
    </svg>
  );
}

export default function CinematicHome(): ReactElement {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const charRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Intro timeline
    const tl = gsap.timeline();

    // Thin silver line
    tl.to(
      heroRef.current!.querySelector(".cinematic-line"),
      { width: "56%", duration: 1.6, ease: "power3.out" },
      0
    );

    // Small label
    tl.from(
      heroRef.current!.querySelectorAll(".cinematic-title"),
      { opacity: 0, y: 16, duration: 0.9, stagger: 0.12, ease: "power3.out" },
      0.2
    );

    // Name reveal
    tl.from(
      heroRef.current!.querySelectorAll(".cinematic-name"),
      { opacity: 0, y: 28, duration: 1.1, ease: "power4.out" },
      0.6
    );

    // Character slowly emerges
    tl.from(
      charRef.current,
      { opacity: 0, x: 120, duration: 1.6, ease: "power3.out" },
      0.8
    );

    // Scroll-driven parallax for character
    gsap.to(charRef.current, {
      y: -120,
      scale: 1.02,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.9,
      },
    });

    // Chapter reveals
    gsap.utils.toArray<HTMLElement>(".chapter").forEach((el) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 60 },
        {
          duration: 1.2,
          autoAlpha: 1,
          y: 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenis.destroy();
    };
  }, []);

  return (
    <div className="cinematic-root">
      <div className="cinematic-hero" ref={heroRef}>
        <div className="cinematic-line" />

        <div className="container relative z-10 px-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="cinematic-title">BEYOND PERFECTION.</div>
            <h1 className="cinematic-name">JOHN ROY</h1>
            <div className="cinematic-sub">IT • DEVELOPMENT • DESIGN</div>
          </div>

          <div className="flex justify-end" ref={charRef}>
            <AnimePortrait />
          </div>
        </div>

        <div className="grain-overlay" />
      </div>

      <main>
        <section className="section-chapter chapter">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="section-title">THE ONE WHO BUILDS.</h2>
            <p className="section-sub">
              An aspiring IT professional focused on creating digital experiences where technology meets design.
            </p>
          </div>
        </section>

        <section className="section-chapter chapter profile-section bg-[color:var(--secondary)]">
          <div className="max-w-6xl mx-auto px-6 md:flex md:gap-12 items-center">
            <div className="md:w-1/2">
              <div className="text-sm uppercase tracking-widest text-muted-foreground">01 / PROFILE</div>
              <h3 className="section-title">WHO AM I?</h3>
              <div className="mt-6 text-lg">
                <p>BSIT STUDENT</p>
                <p>DEVELOPER</p>
                <p>UI ENTHUSIAST</p>
                <p>PROBLEM SOLVER</p>
              </div>
            </div>

            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="profile-portrait rounded-lg overflow-hidden bg-black/20 p-6">
                <AnimePortrait compact />
              </div>
            </div>
          </div>
        </section>

        <section className="section-chapter chapter">
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="section-title">ABILITY ARCHIVE</h3>
            <div className="ability-archive mt-8">
              <div className="p-6 border border-border rounded-lg">
                <div className="text-5xl font-bold text-muted-foreground">01</div>
                <h4 className="mt-2 font-semibold">FRONT-END</h4>
                <div className="mt-3">HTML · CSS · JavaScript · Tailwind</div>
              </div>
              <div className="p-6 border border-border rounded-lg">
                <div className="text-5xl font-bold text-muted-foreground">02</div>
                <h4 className="mt-2 font-semibold">DEVELOPMENT</h4>
                <div className="mt-3">C# · .NET · PHP · MySQL</div>
              </div>
              <div className="p-6 border border-border rounded-lg">
                <div className="text-5xl font-bold text-muted-foreground">03</div>
                <h4 className="mt-2 font-semibold">DESIGN</h4>
                <div className="mt-3">Figma · UI/UX · Visual Design</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-chapter chapter bg-[color:var(--secondary)]">
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="section-title">SELECTED WORKS</h3>
            <div className="mt-8 space-y-12">
              <div className="p-8 bg-white/5 border border-border rounded-lg">
                <div className="text-2xl font-bold">EMPLOYEE RECORD MANAGEMENT SYSTEM</div>
                <p className="mt-2 text-muted-foreground">Role · Developer</p>
                <p className="mt-4">A cinematic preview of a project feels like a character dossier—large artwork, role, and tech stack revealed as you scroll.</p>
              </div>
              <div className="p-8 bg-white/5 border border-border rounded-lg">
                <div className="text-2xl font-bold">PROJECT TWO</div>
                <p className="mt-2 text-muted-foreground">Role · Designer</p>
                <p className="mt-4">Project summary with thoughtful whitespace and typography.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-chapter chapter">
          <div className="max-w-6xl mx-auto px-6">
            <h3 className="section-title">CASE FILES</h3>
            <div className="mt-8 space-y-10">
              <div className="flex items-start gap-6">
                <div className="text-4xl font-bold text-muted-foreground">001</div>
                <div>
                  <div className="font-semibold">Junior Developer - Internship</div>
                  <div className="text-muted-foreground">Summary of responsibilities and outcome.</div>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="text-4xl font-bold text-muted-foreground">002</div>
                <div>
                  <div className="font-semibold">Capstone Project</div>
                  <div className="text-muted-foreground">Employee Profile Management System details.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-chapter chapter bg-[color:var(--secondary)]">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h3 className="section-title">THE STORY DOESN'T END HERE.</h3>
            <p className="mt-4 text-lg text-muted-foreground">LET'S CREATE SOMETHING EXCEPTIONAL.</p>
            <div className="mt-8 flex justify-center gap-6">
              <a href="mailto:johnroynengasca@gmail.com" className="btn-primary px-6 py-3">Email</a>
              <a href="https://github.com/" className="btn-secondary px-6 py-3">GitHub</a>
              <a href="https://linkedin.com/" className="btn-secondary px-6 py-3">LinkedIn</a>
            </div>
          </div>
        </section>

        <footer className="py-12 text-center text-muted-foreground">© 2026 John Roy Nengasca</footer>
      </main>
    </div>
  );
}
