import type { ComponentPropsWithoutRef, SVGProps } from 'react';

type LogoMarkProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

type LogoProps = ComponentPropsWithoutRef<'div'> & {
  showTagline?: boolean;
};

const joinClassNames = (...classNames: Array<string | undefined>) =>
  classNames.filter(Boolean).join(' ');

export function LogoMark({
  className,
  title = 'CodeKids logo',
  ...props
}: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      role="img"
      aria-hidden={title ? undefined : true}
      className={className}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <circle cx="80" cy="18" r="10" stroke="currentColor" strokeWidth="8" />
      <path
        d="M80 28V42"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M64 118H56C49.373 118 44 112.627 44 106V54C44 47.373 49.373 42 56 42H104C110.627 42 116 47.373 116 54V106C116 112.627 110.627 118 104 118H96"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M44 68H38Q30 68 30 76V84Q30 92 38 92H44"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M116 68H122Q130 68 130 76V84Q130 92 122 92H116"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M70 70L56 80L70 90"
        stroke="var(--color-primary)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M90 70L104 80L90 90"
        stroke="var(--color-primary)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className, showTagline = true, ...props }: LogoProps) {
  return (
    <div className={joinClassNames('logoLockup', className)} {...props}>
      <LogoMark className="logoMark" title="" />
      <div className="logoCopy">
        <div className="logoWordmark">
          <span>Code</span>
          <span className="logoAccent">Kids</span>
        </div>
        {showTagline ? <p className="logoTagline">Coding for Kids</p> : null}
      </div>
    </div>
  );
}
