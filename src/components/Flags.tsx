import type { AppLocale } from "@/i18n/routing";

type Props = { locale: AppLocale; className?: string };

const shared = {
  role: "presentation" as const,
  focusable: "false" as const,
  "aria-hidden": true,
};

function UnionJack({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} {...shared}>
      <path d="M0 0h60v30H0z" fill="#012169" />
      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0l60 30m0-30L0 30" stroke="#c8102e" strokeWidth="4" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
    </svg>
  );
}

function Tricolore({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} {...shared}>
      <path d="M0 0h20v30H0z" fill="#0055a4" />
      <path d="M20 0h20v30H20z" fill="#fff" />
      <path d="M40 0h20v30H40z" fill="#ef4135" />
    </svg>
  );
}

function SaudiFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} {...shared}>
      <path d="M0 0h60v30H0z" fill="#165d31" />
      <rect x="11" y="9" width="38" height="2.6" rx="1.3" fill="#fff" />
      <rect x="15" y="14" width="30" height="2" rx="1" fill="#fff" />
      <path d="M13 21.5h32" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M45 21.5l-4.5-3v6z" fill="#fff" />
    </svg>
  );
}

function SpanishFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={className} {...shared}>
      <path d="M0 0h60v30H0z" fill="#aa151b" />
      <path d="M0 7.5h60v15H0z" fill="#f1bf00" />
    </svg>
  );
}

export function Flag({ locale, className }: Props) {
  switch (locale) {
    case "fr":
      return <Tricolore className={className} />;
    case "ar":
      return <SaudiFlag className={className} />;
    case "es":
      return <SpanishFlag className={className} />;
    default:
      return <UnionJack className={className} />;
  }
}
