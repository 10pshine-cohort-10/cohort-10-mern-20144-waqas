import { motion } from "framer-motion";

/**
 * @typedef {"notes" | "tasks" | "docs" | "daily-notes"} FeatureShowcaseId
 */

/**
 * @typedef {Object} FeatureShowcaseItem
 * @property {FeatureShowcaseId} id
 * @property {string} label
 * @property {string} gradient
 * @property {string} glow
 * @property {string} accentBar
 */

/**
 * @typedef {Object} FeatureIconProps
 * @property {FeatureShowcaseId} id
 */

/** @type {FeatureShowcaseItem[]} */
const FEATURES = [
  {
    id: "notes",
    label: "Notes",
    gradient: "from-primary to-secondary",
    glow: "from-primary/20 via-secondary/10 to-transparent",
    accentBar: "from-primary to-secondary",
  },
  {
    id: "tasks",
    label: "Tasks",
    gradient: "from-secondary to-accent-cyan",
    glow: "from-secondary/20 via-accent-cyan/10 to-transparent",
    accentBar: "from-secondary to-accent-cyan",
  },
  {
    id: "docs",
    label: "Docs",
    gradient: "from-primary to-accent-pink",
    glow: "from-primary/20 via-accent-pink/15 to-transparent",
    accentBar: "from-primary to-accent-pink",
  },
  {
    id: "daily-notes",
    label: "Daily Notes",
    gradient: "from-accent-cyan to-primary",
    glow: "from-accent-cyan/20 via-primary/10 to-transparent",
    accentBar: "from-accent-cyan to-primary",
  },
];

/**
 * @param {FeatureIconProps} props
 * @returns {import("react").JSX.Element}
 */
function FeatureIcon({ id }) {
  const iconProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "h-6 w-6 text-white sm:h-7 sm:w-7",
    "aria-hidden": "true",
  };

  switch (id) {
    case "notes":
      return (
        <svg {...iconProps}>
          <path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
          <path d="M15 3v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </svg>
      );
    case "tasks":
      return (
        <svg {...iconProps}>
          <rect width="18" height="18" x="3" y="3" rx="4" />
          <path d="m8.5 12 2.5 2.5 4.5-5" />
        </svg>
      );
    case "docs":
      return (
        <svg {...iconProps}>
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
          <path d="M8 7h6" />
          <path d="M8 11h8" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <rect width="18" height="18" x="3" y="4" rx="3" />
          <path d="M16 2v4" />
          <path d="M8 2v4" />
          <path d="M3 10h18" />
          <path d="m12 14 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" />
        </svg>
      );
  }
}

/* Feature Showcase Section */
function FeatureShowcase() {
  return (
    <section
      aria-labelledby="feature-showcase-heading"
      className="relative px-4 pt-4 pb-10 sm:px-6 sm:pt-6 sm:pb-12 lg:pb-14"
    >
      <div className="mx-auto max-w-5xl text-center">
        <motion.h2
          id="feature-showcase-heading"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-2xl font-bold tracking-tight text-heading sm:text-3xl md:text-4xl"
        >
          Notiq isn’t just for one thing, it’s for{" "}
          <em className="notiq-gradient-text italic">your</em> things.
        </motion.h2>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 sm:gap-5 md:grid-cols-4 md:gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.38, delay: index * 0.06, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="notiq-float-card group relative flex flex-col items-center overflow-hidden rounded-3xl px-4 py-7 hover:border-primary/35 sm:px-6 sm:py-8"
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${feature.glow} opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
              />

              <div
                className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-md transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3 sm:h-16 sm:w-16`}
              >
                <FeatureIcon id={feature.id} />
              </div>

              <span className="relative mt-4 text-base font-semibold tracking-tight text-heading sm:mt-5 sm:text-lg">
                {feature.label}
              </span>

              <span
                aria-hidden="true"
                className={`relative mt-3 h-1 w-8 rounded-full bg-gradient-to-r ${feature.accentBar} opacity-50 transition-all duration-200 group-hover:w-14 group-hover:opacity-100`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureShowcase;

