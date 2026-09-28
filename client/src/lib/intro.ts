import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export const INTRO_PROGRESS_STEPS = [3, 9, 18, 34, 57, 81, 100] as const;

export function getIntroProgressSteps() {
  return [...INTRO_PROGRESS_STEPS];
}

export function useIntroSequence() {
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage] = useState<"idle" | "intro" | "content">("idle");
  const [progress, setProgress] = useState(0);
  const [showCursor, setShowCursor] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setStage("content");
      return;
    }

    const introTimer = window.setTimeout(() => setStage("intro"), 700);
    return () => window.clearTimeout(introTimer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (stage !== "intro") return;

    let frame = 0;
    const stepDuration = 180;

    const tick = () => {
      frame += 1;
      const nextProgress = INTRO_PROGRESS_STEPS[Math.min(frame - 1, INTRO_PROGRESS_STEPS.length - 1)] ?? 100;
      setProgress(nextProgress);

      if (frame < INTRO_PROGRESS_STEPS.length) {
        window.setTimeout(tick, stepDuration);
      } else {
        window.setTimeout(() => {
          setStage("content");
          setShowCursor(true);
        }, 400);
      }
    };

    const initialTimer = window.setTimeout(() => {
      tick();
    }, 600);

    return () => window.clearTimeout(initialTimer);
  }, [stage]);

  const title = useMemo(() => {
    if (stage === "intro") {
      return "OBSERVE.";
    }

    return "John Roy";
  }, [stage]);

  return {
    stage,
    progress,
    showCursor,
    hasInteracted,
    setHasInteracted,
    setShowCursor,
    title,
  };
}

export const introMotion = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.98 },
};

export const introLineVariants = {
  hidden: { opacity: 0, pathLength: 0 },
  visible: { opacity: 1, pathLength: 1 },
};
