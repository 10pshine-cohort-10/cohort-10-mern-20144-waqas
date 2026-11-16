import { motion } from "framer-motion";
import howItWorksBg from "../../assets/how-it-works-bg.jpg";

const STEPS = [
  {
    number: "01",
    id: "visit",
    title: "Visit the Landing Page",
    description: "Explore the application and discover its features.",
    gradient: "from-primary to-secondary",
  },
  {
    number: "02",
    id: "account",
    title: "Create Your Account / Login",
    description: "Sign up or log in securely to access your personal workspace.",
    gradient: "from-secondary to-accent-cyan",
  },
  {
    number: "03",
    id: "dashboard",
    title: "Access Your Dashboard",
    description:
      "Get everything organized in one place, including notes, tasks, and daily routines.",
    gradient: "from-accent-cyan to-primary",
  },
  {
    number: "04",
    id: "create-notes",
    title: "Create Your Notes",
    description:
      "Write and save your notes securely so you can access them whenever you need.",
    gradient: "from-primary to-accent-pink",
  },
  {
    number: "05",
    id: "organize-notes",
    title: "Organize & Manage Notes",
    description:
      "Edit, delete, archive, star, and categorize your notes using custom labels.",
    gradient: "from-accent-pink to-secondary",
  },
  {
    number: "06",
    id: "tasks-todos",
    title: "Manage Your Tasks & To-Dos",
    description:
      "Create tasks, organize your to-do lists, track progress, and manage deadlines.",
    gradient: "from-secondary to-primary",
  },
  {
    number: "07",
    id: "reminders",
    title: "Set Reminders & Routines",
    description:
      "Set reminders for important activities and manage your daily routines.",
    gradient: "from-accent-cyan to-secondary",
  },
  {
    number: "08",
    id: "stay-organized",
    title: "Stay Organized",
    description:
      "Keep your documents, notes, and tasks organized and easily accessible.",
    gradient: "from-primary to-accent-cyan",
  },
];

function StepIcon({ id }) {
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
    case "visit":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="m14.5 9.5-5 2 2 5 3-7Z" />
        </svg>
      );
    case "account":
      return (
        <svg {...props}>
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" x2="3" y1="12" y2="12" />
        </svg>
      );
    case "dashboard":
      return (
        <svg {...props}>
          <rect width="7" height="9" x="3" y="3" rx="1.5" />
          <rect width="7" height="5" x="14" y="3" rx="1.5" />
          <rect width="7" height="9" x="14" y="12" rx="1.5" />
          <rect width="7" height="5" x="3" y="16" rx="1.5" />
        </svg>
      );
    case "create-notes":
      return (
        <svg {...props}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      );
    case "organize-notes":
      return (
        <svg {...props}>
          <path d="M12 2H2v10l9.29 9.29a2.4 2.4 0 0 0 3.42 0l6.58-6.58a2.4 2.4 0 0 0 0-3.42L12 2Z" />
          <circle cx="7" cy="7" r="1" />
        </svg>
      );
    case "tasks-todos":
      return (
        <svg {...props}>
          <rect width="18" height="18" x="3" y="3" rx="4" />
          <path d="m8.5 12 2.5 2.5 4.5-5" />
        </svg>
      );
    case "reminders":
      return (
        <svg {...props}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z" />
          <path d="m3 12 9 4.5 9-4.5" />
          <path d="m3 16.5 9 4.5 9-4.5" />
        </svg>
      );
  }
}

/* How It Works Section */
function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="relative w-full overflow-hidden px-4 py-10 sm:px-6 sm:py-12 lg:py-14"
    >
      <img
        src={howItWorksBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center select-none"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#10111B]/35 transition-colors duration-150 dark:bg-[#10111B]/55"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            id="how-it-works-heading"
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            How It{" "}
            <span className="bg-gradient-to-r from-neon-violet via-neon-cyan to-neon-pink bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-white/80 sm:text-base">
            From your first visit to staying effortlessly organized every day, follow
            a clear, connected flow built for focus.
          </p>
        </motion.div>

        <div className="relative mt-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-4 bottom-4 left-5 w-px bg-gradient-to-b from-neon-violet via-neon-cyan to-neon-pink opacity-50 sm:hidden"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.38, delay: index * 0.05, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className="group relative pl-10 sm:pl-0"
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-6 left-3.5 h-3 w-3 rounded-full bg-gradient-to-br ${step.gradient} ring-4 ring-[#10111B]/70 sm:hidden`}
                />

                {index % 4 !== 3 && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-9 -right-5 hidden h-px w-5 bg-gradient-to-r from-white/40 to-neon-cyan/60 lg:block"
                  />
                )}

                <div className="flex h-full flex-col rounded-3xl border border-white/60 bg-white/88 p-5 shadow-[0_12px_32px_rgba(16,17,27,0.2)] backdrop-blur-md transition-colors duration-150 hover:border-primary/40 dark:border-border/90 dark:bg-surface/80 dark:shadow-[0_14px_36px_rgba(0,0,0,0.45)] dark:hover:border-neon-violet/50">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-sm transition-transform duration-200 group-hover:scale-110`}
                    >
                      <StepIcon id={step.id} />
                    </div>
                    <span className="rounded-full border border-border bg-bg/80 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-muted dark:bg-elevated/80">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-heading sm:text-base">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-body sm:text-[13px]">
                    {step.description}
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

export default HowItWorksSection;

