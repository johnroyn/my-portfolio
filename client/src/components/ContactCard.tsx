import { ReactNode } from 'react';

interface ContactCardProps {
  icon: ReactNode;
  title: string;
  content: string | ReactNode;
  href?: string;
  id: string;
  animationClass: string;
}

export function ContactCard({
  icon,
  title,
  content,
  href,
  id,
  animationClass,
}: ContactCardProps) {
  return (
    <div
      id={id}
      data-animate
      className={`${animationClass} card-hover bg-white p-6 rounded-lg border border-border text-center`}
    >
      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
        <div className="text-accent-foreground">{icon}</div>
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      {href ? (
        <a href={href} className="text-accent hover:underline">
          {content}
        </a>
      ) : (
        <p className="text-foreground">{content}</p>
      )}
    </div>
  );
}
