interface EducationCardProps {
  emoji: string;
  title: string;
  school: string;
  date: string;
  id: string;
  animationClass: string;
}

export function EducationCard({
  emoji,
  title,
  school,
  date,
  id,
  animationClass,
}: EducationCardProps) {
  return (
    <div
      id={id}
      data-animate
      className={`${animationClass} card-hover bg-secondary p-8 rounded-lg border border-border`}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-accent-foreground font-bold text-lg">{emoji}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
          <p className="text-accent font-semibold mb-2">{school}</p>
          <p className="text-foreground">{date}</p>
        </div>
      </div>
    </div>
  );
}
