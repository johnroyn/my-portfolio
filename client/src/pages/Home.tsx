import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Download,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "@/components/SectionHeader";
import { SkillCard } from "@/components/SkillCard";
import { ProjectCard } from "@/components/ProjectCard";
import { EducationCard } from "@/components/EducationCard";
import { ContactCard } from "@/components/ContactCard";
import { MobileNav } from "@/components/MobileNav";
import { introMotion, useIntroSequence } from "@/lib/intro";

const skillsData = [
  {
    title: "Microsoft Office",
    skills: ["Word", "Excel", "PowerPoint", "Outlook"],
  },
  {
    title: "Google Workspace",
    skills: ["Docs", "Sheets", "Drive", "Gmail"],
  },
  {
    title: "Technical Skills",
    skills: ["HTML", "CSS", "JavaScript", "C#", ".NET"],
  },
  {
    title: "Administrative Support",
    skills: [
      "Data Entry",
      "Record Management",
      "Communication",
      "Organization",
    ],
  },
  {
    title: "AI Productivity Tools",
    skills: ["ChatGPT", "Blackbox AI", "AI Prompting"],
  },
  {
    title: "Project Management",
    skills: ["Trello", "Time Management", "Problem Solving"],
  },
];

const projectsData = [
  {
    title: "Employee Profile Management System",
    period: "Northeastern Cebu Colleges | Jan 2025 – June 2025",
    description:
      "Developed a comprehensive web-based Employee Profile Management System to streamline HR employee data entry and profile management processes. This capstone project demonstrates independent learning and technical proficiency.",
    responsibilities: [
      "Independently learned C# and .NET beyond classroom instruction",
      "Designed and built the system from requirements to deployment",
      "Completed comprehensive documentation and successful defense",
    ],
    technologies: ["C#", ".NET", "Visual Studio", "SQL", "Bootstrap"],
  },
  {
    title: "Student Teacher (Work Immersion)",
    period: "Aloguinsan Central Elementary School | Jan 2023 – March 2023",
    description:
      "Provided comprehensive support to Grade 3 students and teachers, gaining valuable experience in educational administration and student support. This role developed my organizational and communication skills in a structured environment.",
    responsibilities: [
      "Supported Grade 3 students with reading and writing activities",
      "Checked quizzes and organized student records",
      "Assisted with administrative tasks and classroom management",
      "Communicated effectively with students and teachers",
    ],
    skills: [
      "Communication",
      "Organization",
      "Time Management",
      "Attention to Detail",
    ],
  },
];

const educationData = [
  {
    emoji: "🎓",
    title: "Bachelor of Science in Information Technology",
    school: "Northeastern Cebu Colleges",
    date: "Expected Graduation: 2027",
  },
  {
    emoji: "📜",
    title: "Associate in Computer Technology",
    school: "Northeastern Cebu Colleges",
    date: "Graduated: June 2025",
  },
];

const contactData = [
  {
    icon: <Mail size={24} />,
    title: "Email",
    content: "johnroynengasca@gmail.com",
    href: "mailto:johnroynengasca@gmail.com",
  },
  {
    icon: <Phone size={24} />,
    title: "Phone",
    content: "+63 905 730 1660",
    href: "tel:+639057301660",
  },
  {
    icon: <Linkedin size={24} />,
    title: "LinkedIn",
    content: "View Profile",
    href: "https://linkedin.com/in/john-roy-nengasca-bb888a423",
  },
  {
    icon: <MapPin size={24} />,
    title: "Location",
    content: "Cebu City, Philippines",
  },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const { getAnimationClass } = useScrollAnimation();
  const { stage, progress, showCursor, hasInteracted, setHasInteracted, title } =
    useIntroSequence();
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (stage === "content") {
      const timer = window.setTimeout(() => setReveal(true), 220);
      return () => window.clearTimeout(timer);
    }
  }, [stage]);

  const introCopy = useMemo(() => {
    if (stage === "intro") {
      return ["Observe.", "Every detail...", "...was intentional."];
    }

    return [];
  }, [stage]);

  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href = "/John_Roy_Nengasca_Resume.pdf";
    link.download = "John_Roy_Nengasca_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    contactSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <AnimatePresence mode="wait">
        {stage !== "content" && (
          <motion.div
            key="intro-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-[#050505] text-[#f8f8f8]"
            onClick={() => {
              setHasInteracted(true);
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_60%)]" />
            <div className="absolute inset-0 opacity-40">
              {Array.from({ length: 24 }).map((_, index) => (
                <motion.span
                  key={index}
                  className="absolute h-px w-px rounded-full bg-white/60"
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [0, 0.75, 0],
                    x: [0, (index % 2 === 0 ? 1 : -1) * 40, 0],
                    y: [0, (index % 3) * 24, 0],
                  }}
                  transition={{
                    duration: 7 + (index % 5),
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    left: `${8 + (index % 12) * 7}%`,
                    top: `${10 + (index % 8) * 10}%`,
                  }}
                />
              ))}
            </div>

            <motion.div
              {...introMotion}
              className="relative z-10 flex flex-col items-center justify-center px-6 text-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="mb-10 text-[0.65rem] uppercase tracking-[0.6em] text-white/60"
              >
                {stage === "intro" ? "Cinematic launch" : "Observe"}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.8 }}
                className="relative"
              >
                <div className="mb-6 h-24 w-24 rounded-full border border-white/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                    className="h-20 w-20 rounded-full border border-white/40 border-t-transparent"
                  />
                </div>
              </motion.div>

              <div className="min-h-24">
                {introCopy.map((line, index) => (
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index + 0.2, duration: 0.7 }}
                    className="text-3xl font-semibold tracking-[0.25em] text-white/90 sm:text-4xl"
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.7 }}
                className="mt-8 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.45em] text-white/55"
              >
                <Sparkles size={14} />
                <span>{progress}%</span>
              </motion.div>

              {showCursor && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hasInteracted ? 1 : 0.7 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mt-6 h-8 w-8 rounded-full border border-white/30"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`min-h-screen transition-opacity duration-700 ${
          reveal ? "opacity-100" : "opacity-0"
        }`}
      >
        <header className={`sticky-header ${scrolled ? "scrolled" : ""}`}>
          <nav className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/5 text-[0.75rem] font-semibold uppercase tracking-[0.35em] text-foreground">
                JR
              </div>
              <span className="font-bold text-lg text-foreground">{title}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#about"
                className="text-foreground hover:text-accent transition-colors"
              >
                About
              </a>
              <a
                href="#skills"
                className="text-foreground hover:text-accent transition-colors"
              >
                Skills
              </a>
              <a
                href="#projects"
                className="text-foreground hover:text-accent transition-colors"
              >
                Projects
              </a>
              <a
                href="#contact"
                className="text-foreground hover:text-accent transition-colors"
              >
                Contact
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Button
                className="btn-primary hidden sm:flex"
                onClick={scrollToContact}
              >
                Contact Me
              </Button>
              <MobileNav onContactClick={scrollToContact} />
            </div>
          </nav>
        </header>

        <section className="relative overflow-hidden bg-[var(--background)] pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(89,98,255,0.14),transparent_70%)]" />
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div
                id="hero-text"
                data-animate
                className={getAnimationClass("hero-text", 0)}
              >
                <p className="mb-4 text-[0.8rem] uppercase tracking-[0.45em] text-[color:var(--accent)]">
                  Portfolio / 2026
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-foreground mb-4">
                  John Roy Nengasca
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-6">
                  Technical Virtual Assistant | Administrative Support | IT Support
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
                  Fourth-year BSIT student with hands-on experience in software
                  development, research documentation, and administrative support.
                  Seeking remote opportunities to deliver technical excellence and
                  organizational reliability.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="btn-primary flex items-center justify-center gap-2"
                    onClick={handleDownloadResume}
                  >
                    <Download size={18} />
                    Download Resume
                  </Button>
                  <Button
                    className="btn-secondary flex items-center justify-center gap-2"
                    onClick={scrollToContact}
                  >
                    Get In Touch
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
              <div
                id="hero-image"
                data-animate
                className={getAnimationClass("hero-image", 1)}
              >
                <div className="rounded-[2rem] border border-black/10 bg-white/70 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.15)] backdrop-blur-xl">
                  <img
                    src="/manus-storage/hero-bg-1_c2c4c0f9.png"
                    alt="Hero Background"
                    className="w-full rounded-[1.35rem] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section-padding bg-[color:var(--secondary)]">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <SectionHeader
              title="About Me"
              subtitle="A dedicated IT student with a passion for technical support and administrative excellence"
              id="about-title"
              animationClass={getAnimationClass("about-title", 0)}
            />

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div
                id="about-content"
                data-animate
                className={getAnimationClass("about-content", 1)}
              >
                <p className="text-lg text-foreground mb-6 leading-relaxed">
                  I am a fourth-year Bachelor of Science in Information Technology
                  student at Northeastern Cebu Colleges, expected to graduate in
                  2027. With a strong foundation in both technical and
                  administrative skills, I am eager to contribute to a dynamic
                  team in a remote capacity.
                </p>
                <p className="text-lg text-foreground mb-6 leading-relaxed">
                  My experience spans software development, research documentation,
                  and hands-on administrative support. I have successfully
                  developed a web-based Employee Profile Management System using
                  C# and .NET, demonstrating my ability to learn independently and
                  deliver quality solutions.
                </p>
                <p className="text-lg text-foreground leading-relaxed">
                  I am detail-oriented, organized, and committed to delivering
                  excellence in every task. Whether supporting technical
                  initiatives or managing administrative workflows, I bring
                  professionalism and reliability to every role.
                </p>
              </div>
              <div
                id="about-stats"
                data-animate
                className={getAnimationClass("about-stats", 2)}
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
                    <div className="text-3xl font-bold text-accent mb-2">2+</div>
                    <p className="text-foreground font-medium">Years Experience</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
                    <div className="text-3xl font-bold text-accent mb-2">5+</div>
                    <p className="text-foreground font-medium">Technical Skills</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
                    <div className="text-3xl font-bold text-accent mb-2">1</div>
                    <p className="text-foreground font-medium">Capstone Project</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
                    <div className="text-3xl font-bold text-accent mb-2">100%</div>
                    <p className="text-foreground font-medium">Commitment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section-padding bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <SectionHeader
              title="Skills & Expertise"
              subtitle="A comprehensive toolkit for technical and administrative excellence"
              id="skills-title"
              animationClass={getAnimationClass("skills-title", 0)}
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skillsData.map((category, idx) => (
                <SkillCard
                  key={idx}
                  title={category.title}
                  skills={category.skills}
                  id={`skill-${idx}`}
                  animationClass={getAnimationClass(`skill-${idx}`, idx % 3)}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="section-padding bg-secondary">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <SectionHeader
              title="Project Experience"
              subtitle="Showcasing technical expertise and problem-solving capabilities"
              id="projects-title"
              animationClass={getAnimationClass("projects-title", 0)}
            />

            <div className="grid md:grid-cols-2 gap-8">
              {projectsData.map((project, idx) => (
                <ProjectCard
                  key={idx}
                  title={project.title}
                  period={project.period}
                  description={project.description}
                  responsibilities={project.responsibilities}
                  technologies={project.technologies}
                  skills={project.skills}
                  id={`project-${idx}`}
                  animationClass={getAnimationClass(`project-${idx}`, idx + 1)}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="section-padding bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <SectionHeader
              title="Education"
              subtitle="Building a strong foundation in Information Technology"
              id="education-title"
              animationClass={getAnimationClass("education-title", 0)}
            />

            <div className="grid md:grid-cols-2 gap-8">
              {educationData.map((edu, idx) => (
                <EducationCard
                  key={idx}
                  emoji={edu.emoji}
                  title={edu.title}
                  school={edu.school}
                  date={edu.date}
                  id={`education-${idx}`}
                  animationClass={getAnimationClass(`education-${idx}`, idx + 1)}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section-padding bg-secondary">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <SectionHeader
              title="Get In Touch"
              subtitle="Let's connect and explore opportunities together"
              id="contact-title"
              animationClass={getAnimationClass("contact-title", 0)}
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {contactData.map((contact, idx) => (
                <ContactCard
                  key={idx}
                  icon={contact.icon}
                  title={contact.title}
                  content={contact.content}
                  href={contact.href}
                  id={`contact-${idx}`}
                  animationClass={getAnimationClass(`contact-${idx}`, idx + 1)}
                />
              ))}
            </div>

            <div
              id="contact-cta"
              data-animate
              className={`${getAnimationClass("contact-cta", 2)} bg-white p-8 md:p-12 rounded-lg border border-border text-center`}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Ready to Work Together?
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                I'm actively seeking remote opportunities. Let's discuss how I can
                contribute to your team.
              </p>
              <Button
                className="btn-primary"
                onClick={() => {
                  window.location.href = "mailto:johnroynengasca@gmail.com";
                }}
              >
                Send Me an Email
              </Button>
            </div>
          </div>
        </section>

        <footer className="bg-foreground text-white py-8">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <p className="mb-4">© 2025 John Roy Nengasca. All rights reserved.</p>
            <p className="text-sm opacity-75">
              Designed for excellence. Built for impact.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
