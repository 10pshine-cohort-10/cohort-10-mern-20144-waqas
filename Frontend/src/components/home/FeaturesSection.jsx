import { motion } from "framer-motion";

const FEATURES = [
  {
    id: "daily-notes",
    title: "Daily Notes",
    description: "Capture your thoughts and important information every day.",
    gradient: "from-primary to-secondary",
  },
  {
    id: "tasks",
    title: "Tasks",
    description: "Organize your work and keep track of what needs to be done.",
    gradient: "from-secondary to-accent-cyan",
  },
  {
    id: "todo-lists",
    title: "To-Do Lists",
    description: "Break your goals into manageable action items.",
    gradient: "from-accent-cyan to-primary",
  },
  {
    id: "reminders",
    title: "Reminders",
    description: "Never miss important tasks, events, or deadlines.",
    gradient: "from-primary to-accent-pink",
  },
  {
    id: "labels",
    title: "Labels",
    description: "Categorize and organize notes with custom labels.",
    gradient: "from-accent-pink to-secondary",
  },
  {
    id: "archived",
    title: "Archived",
    description: "Keep completed and old notes safely stored.",
    gradient: "from-secondary to-primary",
  },
  {
    id: "starred",
    title: "Starred",
    description: "Quickly access your most important notes.",
    gradient: "from-accent-pink to-primary",
  },
  {
    id: "manage-notes",
    title: "Manage Notes",
    description: "Create, edit, delete, and manage all your notes in one place.",
    gradient: "from-primary to-accent-cyan",
  },
  {
    id: "daily-routines",
    title: "Daily Routines",
    description: "Build consistent habits and manage your everyday routines.",
    gradient: "from-accent-cyan to-secondary",
  },
  {
    id: "documents",
    title: "Documents",
    description: "Keep important documents organized and easily accessible.",
    gradient: "from-secondary to-accent-pink",
  },
];

function FeatureItemIcon({ id }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "h-4 w-4 text-white",
    "aria-hidden": "true",
  };

  switch (id) {
    case "daily-notes":
      return (
        <svg {...props}>
          <rect width="18" height="18" x="3" y="4" rx="3" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "tasks":
      return (
        <svg {...props}>
          <rect width="18" height="18" x="3" y="3" rx="4" />
          <path d="m8.5 12 2.5 2.5 4.5-5" />
        </svg>
      );
    case "todo-lists":
      return (
        <svg {...props}>
          <path d="M10 6h11M10 12h11M10 18h11" />
          <path d="m3 6 1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17" />
        </svg>
      );
    case "reminders":
      return (
        <svg {...props}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );
    case "labels":
      return (
        <svg {...props}>
          <path d="M12 2H2v10l9.29 9.29a2.4 2.4 0 0 0 3.42 0l6.58-6.58a2.4 2.4 0 0 0 0-3.42L12 2Z" />
          <circle cx="7" cy="7" r="1" />
        </svg>
      );
    case "archived":
      return (
        <svg {...props}>
          <rect width="20" height="5" x="2" y="3" rx="1" />
          <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
          <path d="M10 12h4" />
        </svg>
      );
    case "starred":
      return (
        <svg {...props}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "manage-notes":
      return (
        <svg {...props}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      );
    case "daily-routines":
      return (
        <svg {...props}>
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2Z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
        </svg>
      );
  }
}

const STACKED_CARDS = [
  {
    id: "card-daily",
    position: "top-2 left-0 z-10 w-[70%]",
    rotate: -3,
    floatDuration: 6,
    delay: 0,
    glowShadow: "shadow-[0_16px_40px_rgba(118,87,255,0.18)]",
  },
  {
    id: "card-tasks",
    position: "top-20 right-0 z-20 w-[72%] sm:top-24",
    rotate: 3,
    floatDuration: 7,
    delay: 0.1,
    glowShadow: "shadow-[0_16px_40px_rgba(0,217,245,0.16)]",
  },
  {
    id: "card-labels",
    position: "bottom-16 left-2 z-30 w-[68%] sm:bottom-20",
    rotate: 2,
    floatDuration: 6.5,
    delay: 0.2,
    glowShadow: "shadow-[0_16px_40px_rgba(255,91,200,0.16)]",
  },
  {
    id: "card-docs",
    position: "right-2 bottom-0 z-40 w-[75%] border-primary/25",
    rotate: -1,
    floatDuration: 7.5,
    delay: 0.3,
    glowShadow: "shadow-[0_20px_48px_rgba(118,87,255,0.2)]",
  },
];

function renderStackedCardContent(id) {
  switch (id) {
    case "card-daily":
      return (
        <>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-heading">
              <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-primary to-secondary" />
              Daily Notes
            </span>
            <span className="text-[11px] text-muted">Today</span>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-body">
            Morning priorities locked in. Design review at 2 PM and sprint sync notes linked.
          </p>
        </>
      );
    case "card-tasks":
      return (
        <>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-heading">Tasks & To-Do</span>
            <span className="rounded-full bg-accent-cyan/15 px-2.5 py-0.5 text-[10px] font-semibold text-accent-cyan">
              3 / 4 Done
            </span>
          </div>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-muted line-through">
              <span className="h-2 w-2 rounded-full bg-neon-cyan" />
              Finalize product roadmap
            </div>
            <div className="flex items-center gap-2 font-medium text-heading">
              <span className="h-2 w-2 rounded-full bg-neon-blue" />
              Send weekly team update
            </div>
          </div>
        </>
      );
    case "card-labels":
      return (
        <>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-heading">Labels & Starred</span>
            <span className="text-xs text-accent-pink">★ Starred</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-medium text-primary dark:text-neon-violet">
              #Ideas
            </span>
            <span className="rounded-full bg-secondary/15 px-2.5 py-0.5 text-[11px] font-medium text-secondary dark:text-neon-blue">
              #Work
            </span>
            <span className="rounded-full bg-accent-pink/15 px-2.5 py-0.5 text-[11px] font-medium text-accent-pink dark:text-neon-pink">
              #Routine
            </span>
          </div>
        </>
      );
    default:
      return (
        <>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent-cyan text-[11px] font-bold text-white shadow-sm">
              DOC
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-heading">
                Q4 Product Brief.pdf
              </p>
              <p className="text-[11px] text-muted">Reminder · 4:00 PM</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="font-medium text-accent-cyan">14-day routine streak</span>
            <span className="text-muted">Archived & synced</span>
          </div>
        </>
      );
  }
}

function StackedCards() {
  return (
    <div
      aria-hidden="true"
      className="relative isolate mx-auto h-[380px] w-full max-w-[430px] sm:h-[430px] lg:max-w-none"
    >
      <div className="pointer-events-none absolute top-8 left-6 h-44 w-44 rounded-full bg-neon-violet/20 blur-3xl" />
      <div className="pointer-events-none absolute right-6 bottom-10 h-48 w-48 rounded-full bg-neon-cyan/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-4 left-12 h-36 w-36 rounded-full bg-neon-pink/15 blur-3xl" />

      {STACKED_CARDS.map((card) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: card.delay }}
          whileHover={{ zIndex: 50 }}
          className={`absolute ${card.position}`}
        >
          <motion.div
            initial={{ rotate: card.rotate }}
            animate={{ y: [0, -6, 0] }}
            transition={{
              y: {
                duration: card.floatDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: card.delay,
              },
            }}
            whileHover={{ y: -8, scale: 1.03, rotate: 0 }}
            className={`notiq-glass-menu cursor-pointer rounded-3xl p-4 sm:p-5 ${card.glowShadow}`}
          >
            {renderStackedCardContent(card.id)}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

/* Features Section */
function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="relative overflow-hidden px-4 pt-8 pb-16 sm:px-6 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <StackedCards />
        </div>

        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
          >
            <h2
              id="features-heading"
              className="text-2xl font-bold tracking-tight text-heading sm:text-3xl md:text-4xl"
            >
              Everything you need to{" "}
              <span className="notiq-gradient-text">capture and organize</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-body sm:text-base">
              Built to keep your daily thoughts, actionable tasks, habits, and
              essential documents connected in one calm workspace.
            </p>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                whileHover={{ y: -3 }}
                className="notiq-feature-item group flex items-start gap-3.5 rounded-2xl p-3.5 hover:border-primary/35"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-sm transition-transform duration-200 group-hover:scale-110`}
                >
                  <FeatureItemIcon id={feature.id} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-heading">
                    {feature.title}
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-body">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
