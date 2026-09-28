interface ProjectCardProps {
  title: string;
  period: string;
  description: string;
  responsibilities: string[];
  technologies?: string[];
  skills?: string[];
  id: string;
  animationClass: string;
}

export function ProjectCard({
  title,
  period,
  description,
  responsibilities,
  technologies,
  skills,
  id,
  animationClass,
}: ProjectCardProps) {
  return (
    <div
      id={id}
      data-animate
      className={`${animationClass} card-hover bg-white p-8 rounded-lg border border-border overflow-hidden`}
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-accent font-semibold mb-4">{period}</p>
      </div>

      <p className="text-foreground mb-6 leading-relaxed">{description}</p>

      <div className="mb-6">
        <h4 className="font-semibold text-foreground mb-3">
          Key Responsibilities:
        </h4>
        <ul className="space-y-2 text-foreground">
          {responsibilities.map((resp, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>{resp}</span>
            </li>
          ))}
        </ul>
      </div>

      {technologies && (
        <div className="mb-6">
          <h4 className="font-semibold text-foreground mb-3">
            Technologies Used:
          </h4>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {skills && (
        <div>
          <h4 className="font-semibold text-foreground mb-3">
            Skills Developed:
          </h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-secondary text-foreground px-3 py-1 rounded-full text-sm font-medium border border-border"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
