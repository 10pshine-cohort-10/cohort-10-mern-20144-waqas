import { memo } from "react";
import { FiCheckCircle, FiShield, FiZap } from "react-icons/fi";
import logo from "../../assets/logo.png";

const DEFAULT_HIGHLIGHTS = [
  {
    icon: FiCheckCircle,
    title: "Smart Daily Notes",
    desc: "Instant capture with markdown & rich-text support.",
    color: "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10",
  },
  {
    icon: FiShield,
    title: "Encrypted & Private",
    desc: "Your credentials and personal workspace are safeguarded 24/7.",
    color: "text-primary border-primary/30 bg-primary/10",
  },
  {
    icon: FiZap,
    title: "Always in Sync",
    desc: "Effortless access on all your devices with light & dark mode.",
    color: "text-neon-pink border-neon-pink/30 bg-neon-pink/10",
  },
];

function AuthVisualCard({
  badge = "Notiq Productivity Suite",
  title = "Where Focus Meets Effortless Clarity.",
  subtitle = "Capture daily notes, manage tasks, set reminders, and build routines in one calm, vibrant workspace.",
  highlights = DEFAULT_HIGHLIGHTS,
  className = "",
}) {
  return (
    <div
      className={`relative flex h-full flex-col justify-between overflow-hidden p-6 sm:p-7 lg:p-8 transform-gpu ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-primary/20 blur-2xl transform-gpu"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-16 h-60 w-60 rounded-full bg-neon-cyan/18 blur-2xl transform-gpu"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 left-1/4 h-56 w-56 rounded-full bg-neon-pink/15 blur-2xl transform-gpu"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25 dark:opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--notiq-primary) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <svg
        aria-hidden="true"
        viewBox="0 0 600 700"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-65 dark:opacity-80"
      >
        <defs>
          <linearGradient id="auth-neon-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--notiq-primary)" stopOpacity="0.1" />
            <stop offset="45%" stopColor="var(--notiq-accent-cyan)" stopOpacity="0.6" />
            <stop offset="85%" stopColor="var(--notiq-accent-pink)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--notiq-primary)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="auth-neon-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--notiq-accent-pink)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--notiq-secondary)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--notiq-accent-cyan)" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        <path
          d="M-20 180 C 180 80, 320 280, 580 140 C 660 100, 700 200, 720 240"
          fill="none"
          stroke="url(#auth-neon-grad-1)"
          strokeWidth="6"
          strokeOpacity="0.3"
        />
        <path
          d="M-20 180 C 180 80, 320 280, 580 140 C 660 100, 700 200, 720 240"
          fill="none"
          stroke="url(#auth-neon-grad-1)"
          strokeWidth="2.2"
        />

        <path
          d="M-40 450 C 160 520, 360 380, 560 520 C 640 580, 680 480, 720 500"
          fill="none"
          stroke="url(#auth-neon-grad-2)"
          strokeWidth="5"
          strokeOpacity="0.25"
        />
        <path
          d="M-40 450 C 160 520, 360 380, 560 520 C 640 580, 680 480, 720 500"
          fill="none"
          stroke="url(#auth-neon-grad-2)"
          strokeWidth="1.8"
        />
      </svg>

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-surface/90 px-3 py-1 text-xs font-semibold tracking-wide text-heading shadow-sm dark:bg-elevated/90">
          <div className="relative flex h-5 w-5 items-center justify-center rounded-lg bg-[image:var(--notiq-gradient-neon-subtle)] p-0.5 ring-1 ring-primary/20">
            <img src={logo} alt="" aria-hidden="true" className="h-full w-full object-contain" />
          </div>
          <span>{badge}</span>
        </div>

        <h2 className="mt-3.5 text-xl font-extrabold tracking-tight text-heading sm:text-2xl lg:text-[1.65rem] lg:leading-tight">
          {title}
        </h2>

        <p className="mt-2 text-xs leading-relaxed text-body sm:text-sm">
          {subtitle}
        </p>
      </div>

      <div className="relative z-10 my-4 space-y-2.5">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-center gap-3 rounded-xl border border-border/80 bg-surface/75 p-2.5 shadow-sm transition-transform duration-150 hover:-translate-y-0.5 dark:bg-elevated/70"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${item.color}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-semibold text-heading sm:text-sm">{item.title}</h3>
                <p className="truncate text-[11px] text-muted sm:text-xs">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-neon-cyan/10 to-neon-pink/10 p-2.5">
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="font-semibold text-heading">Notiq Cloud Sync</span>
          </div>
          <span className="text-[11px] text-muted sm:text-xs">Fast · Private · Encrypted</span>
        </div>
      </div>
    </div>
  );
}

export default memo(AuthVisualCard);
