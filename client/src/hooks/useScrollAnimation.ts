import { useEffect, useState } from 'react';

export function useScrollAnimation() {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const getAnimationClass = (id: string, delay: number) => {
    if (visibleElements.has(id)) {
      return `fade-up fade-up-delay-${Math.min(delay, 3)}`;
    }
    return '';
  };

  return { visibleElements, getAnimationClass };
}
