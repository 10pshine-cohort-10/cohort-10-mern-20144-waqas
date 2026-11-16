import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/* Hero Section */

const TASK_ITEMS = [
  { label: "Inbox: Review meeting notes", dotClass: "bg-neon-violet" },
  { label: "Next Up: Draft project brief", dotClass: "bg-neon-blue" },
  { label: "Done: Send weekly update", dotClass: "bg-neon-cyan", done: true },
];

const PILL_TONES = {
  notes:
    "text-primary bg-primary/10 border-primary/20 dark:text-neon-violet dark:bg-neon-violet/15 dark:border-neon-violet/30",
  meeting:
    "text-secondary bg-secondary/10 border-secondary/20 dark:text-neon-blue dark:bg-neon-blue/15 dark:border-neon-blue/30",
  links:
    "text-accent-pink bg-accent-pink/10 border-accent-pink/20 dark:text-neon-pink dark:bg-neon-pink/15 dark:border-neon-pink/30",
  daily:
    "text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20 dark:text-neon-cyan dark:bg-neon-cyan/15 dark:border-neon-cyan/30",
  images:
    "text-secondary bg-accent-cyan/10 border-accent-cyan/20 dark:text-neon-cyan dark:bg-neon-cyan/15 dark:border-neon-cyan/30",
};

function PillIcon({ id }) {
  const iconProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4",
    "aria-hidden": "true",
  };

  switch (id) {
    case "notes":
      return (
        <svg {...iconProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </svg>
      );
    case "meeting":
      return (
        <svg {...iconProps}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "links":
      return (
        <svg {...iconProps}>
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" />
        </svg>
      );
    case "daily":
      return (
        <svg {...iconProps}>
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M16 2v4" />
          <path d="M8 2v4" />
          <path d="M3 10h18" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      );
  }
}

function CategoryPill({ id, label, className = "" }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-[11px] font-medium shadow-sm backdrop-blur-md transition-transform duration-300 hover:scale-105 sm:gap-2 sm:px-3.5 sm:py-2 sm:text-xs ${PILL_TONES[id]} ${className}`}
    >
      <PillIcon id={id} />
      <span className="whitespace-nowrap">{label}</span>
    </div>
  );
}

function TaskDashboardCard({ className = "" }) {
  return (
    <div className={`notiq-float-card rounded-2xl p-2.5 text-left sm:p-3.5 lg:p-4 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-heading sm:text-xs">
          Task dashboard
        </span>
        <span className="rounded-full bg-accent-cyan/15 px-2 py-0.5 text-[10px] font-medium text-accent-cyan sm:text-[11px]">
          Today
        </span>
      </div>
      <div className="mt-2 space-y-1.5 rounded-xl border border-border/80 bg-bg/70 p-2 sm:mt-2.5 sm:space-y-2 sm:p-2.5 dark:bg-elevated/70">
        {TASK_ITEMS.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-1.5 text-[10px] text-body sm:gap-2 sm:text-[11px]"
          >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full sm:h-2 sm:w-2 ${item.dotClass}`} />
            <span className={item.done ? "truncate text-muted" : "truncate font-medium text-heading"}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-1.5 hidden text-[10px] text-muted sm:mt-2 sm:block">
        Status and priority in context
      </p>
    </div>
  );
}

function LinkedKnowledgeCard({ className = "" }) {
  return (
    <div className={`notiq-float-card rounded-2xl p-4 text-left ${className}`}>
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-neon-violet" />
        <span className="h-1.5 w-1.5 rounded-full bg-neon-blue" />
        <span className="ml-1 truncate text-[10px] text-muted">notiq.app/workspace</span>
      </div>
      <p className="mt-2.5 text-xs font-semibold text-heading">How to build a second brain</p>
      <p className="mt-1 text-[11px] leading-relaxed text-body">
        Bookmark saved and linked directly to your project notes.
      </p>
      <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary dark:bg-neon-violet/15 dark:text-neon-violet">
        <span className="h-1.5 w-1.5 rounded-full bg-neon-pink" />
        Bookmarked
      </span>
    </div>
  );
}

function MicroChip({ label, tone, className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`notiq-float-card hidden h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold ${tone} ${className}`}
    >
      {label}
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden px-4 pt-28 pb-20 sm:min-h-[640px] sm:px-6 sm:pt-32 sm:pb-24 lg:min-h-screen lg:pt-28 lg:pb-20">
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="pointer-events-none absolute top-[78px] bottom-2 left-1/2 w-full max-w-[88rem] -translate-x-1/2 px-3 select-none sm:top-[88px] sm:bottom-4 sm:px-6 lg:top-24 lg:bottom-6"
      >
        <div className="relative h-full w-full opacity-45 sm:opacity-55 lg:opacity-100">
          <MicroChip
            label="Aa"
            tone="text-secondary"
            className="xl:flex absolute top-2 right-[25%] rotate-6"
          />
          <MicroChip
            label="{}"
            tone="text-accent-cyan"
            className="xl:flex absolute bottom-12 right-[26%] -rotate-6"
          />
          <MicroChip
            label="✦"
            tone="text-accent-pink"
            className="xl:flex absolute bottom-6 left-[24%] rotate-12"
          />
          <MicroChip
            label="≡"
            tone="text-primary"
            className="xl:flex absolute top-2 left-[26%] -rotate-6"
          />

          <CategoryPill
            id="notes"
            label="Notes & snippets"
            className="absolute top-4 left-3 -rotate-3 sm:top-6 sm:left-8 lg:top-8 lg:left-6 xl:top-10 xl:left-[8%] notiq-animate-float"
          />
          <CategoryPill
            id="daily"
            label="Daily notes"
            className="absolute top-6 right-3 rotate-3 sm:top-8 sm:right-8 lg:top-44 lg:right-8 xl:top-44 xl:right-[12%] lg:-rotate-2 notiq-animate-float-delayed"
          />
          <CategoryPill
            id="meeting"
            label="Meeting notes"
            className="flex absolute top-[34%] left-2 -rotate-2 sm:top-[30%] sm:left-6 sm:rotate-2 lg:top-auto lg:bottom-24 lg:left-8 xl:bottom-28 xl:left-[11%] notiq-animate-float-delayed"
          />
          <CategoryPill
            id="links"
            label="Saved links"
            className="absolute bottom-3 left-[44%] -translate-x-1/2 rotate-2 sm:bottom-5 sm:left-[48%] sm:-rotate-2 lg:right-auto lg:bottom-6 lg:left-4 lg:translate-x-0 lg:-rotate-2 xl:bottom-8 xl:left-[4%] notiq-animate-float"
          />
          <CategoryPill
            id="images"
            label="Images"
            className="flex absolute top-[46%] right-2 rotate-3 sm:top-[42%] sm:right-6 sm:-rotate-2 lg:top-auto lg:bottom-8 lg:left-auto lg:right-6 lg:translate-x-0 lg:-rotate-3 xl:bottom-6 xl:right-[15%] notiq-animate-float"
          />

          <TaskDashboardCard className="absolute bottom-12 left-2 w-[166px] -rotate-3 sm:bottom-10 sm:left-6 sm:w-44 lg:bottom-auto lg:top-28 lg:left-2 xl:top-28 xl:left-[2%] lg:w-48 xl:w-60 notiq-animate-float-delayed" />
          <LinkedKnowledgeCard className="hidden xl:block absolute bottom-20 right-[2%] w-60 rotate-2 notiq-animate-float" />
        </div>
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-2xl translate-y-4 flex-col items-center text-center before:pointer-events-none before:absolute before:-inset-x-6 before:-inset-y-4 before:-z-10 before:rounded-full before:bg-bg/70 before:blur-2xl sm:translate-y-6 lg:max-w-xl lg:translate-y-12 lg:before:hidden xl:max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full text-center text-3xl font-bold tracking-tight text-heading leading-[1.12] sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem] xl:text-[4rem] xl:leading-[1.08]"
        >
          A{" "}
          <span className="relative inline-block">
            home
            <span
              aria-hidden="true"
              className="notiq-underline absolute right-0 -bottom-1 left-0 h-1 rounded-full sm:h-1.5"
            />
          </span>{" "}
          for everything
          <br className="hidden sm:inline" /> you think, learn, and
          <br className="hidden sm:inline" /> create.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
          className="mx-auto mt-5 max-w-xl text-center text-base leading-relaxed text-body sm:mt-6 sm:text-lg"
        >
          Notiq brings your notes, tasks, ideas, and knowledge together in one
          connected workspace. Capture thoughts effortlessly, link everything in
          context, and find what you need instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16, ease: "easeOut" }}
          className="mt-7 flex w-full justify-center sm:mt-8"
        >
          <Link
            to="/signup"
            className="notiq-btn-primary group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:text-base"
          >
            <span>Get Started</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
