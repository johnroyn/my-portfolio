interface SectionHeaderProps {
  title: string;
  subtitle: string;
  id: string;
  animationClass: string;
}

export function SectionHeader({
  title,
  subtitle,
  id,
  animationClass,
}: SectionHeaderProps) {
  return (
    <div id={id} data-animate className={animationClass}>
      <h2 className="section-title">{title}</h2>
      <p className="section-subtitle">{subtitle}</p>
    </div>
  );
}
