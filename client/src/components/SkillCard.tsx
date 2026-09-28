interface SkillCardProps {
  title: string;
  skills: string[];
  id: string;
  animationClass: string;
}

export function SkillCard({
  title,
  skills,
  id,
  animationClass,
}: SkillCardProps) {
  return (
    <div
      id={id}
      data-animate
      className={`${animationClass} card-hover bg-secondary p-8 rounded-lg border border-border`}
    >
      <h3 className="text-xl font-bold text-foreground mb-4">{title}</h3>
      <ul className="space-y-2">
        {skills.map((skill, idx) => (
          <li key={idx} className="text-foreground flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full"></span>
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}
