import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";

export interface Testimonial {
  id: string;
  name: string;
  initials: string;
  avatar: string;
  review: string;
  accent: string;
  borderGlow: string;
}

interface ProfileAvatarProps {
  name: string;
  initials: string;
  avatar: string;
  accent: string;
}

interface TestimonialCardProps {
  item: Testimonial;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Maya Patel",
    initials: "MP",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    review:
      "I start every morning in Daily Notes to map out my priorities and link meeting notes in seconds.",
    accent: "from-primary to-secondary",
    borderGlow: "hover:border-primary/40",
  },
  {
    id: "t2",
    name: "Liam Brooks",
    initials: "LB",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    review:
      "Having my tasks, to-do lists, and project docs side by side completely replaced three separate apps.",
    accent: "from-secondary to-accent-cyan",
    borderGlow: "hover:border-accent-cyan/40",
  },
  {
    id: "t3",
    name: "Sofia Alvarez",
    initials: "SA",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    review:
      "Custom labels and starred notes make finding study outlines and lecture summaries effortless.",
    accent: "from-primary to-accent-pink",
    borderGlow: "hover:border-accent-pink/40",
  },
  {
    id: "t4",
    name: "Noah Kim",
    initials: "NK",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    review:
      "Notiq’s reminders and daily routines keep my client deadlines and evening habits on track.",
    accent: "from-accent-cyan to-primary",
    borderGlow: "hover:border-accent-cyan/40",
  },
  {
    id: "t5",
    name: "Elena Rossi",
    initials: "ER",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    review:
      "I archive completed sprint notes without losing anything—search brings them back whenever I need.",
    accent: "from-accent-pink to-secondary",
    borderGlow: "hover:border-accent-pink/40",
  },
  {
    id: "t6",
    name: "Daniel Okafor",
    initials: "DO",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    review:
      "All my contracts, PDFs, and quick rough drafts stay neatly organized in one calm workspace.",
    accent: "from-secondary to-primary",
    borderGlow: "hover:border-secondary/40",
  },
  {
    id: "t7",
    name: "Hannah Chen",
    initials: "HC",
    avatar: "https://randomuser.me/api/portraits/women/90.jpg",
    review:
      "Breaking big goals into clean to-do lists inside Notiq makes every week feel manageable.",
    accent: "from-primary to-accent-cyan",
    borderGlow: "hover:border-primary/40",
  },
  {
    id: "t8",
    name: "Lucas Meyer",
    initials: "LM",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    review:
      "The dark mode and instant sync make capturing late-night ideas genuinely enjoyable.",
    accent: "from-accent-cyan to-secondary",
    borderGlow: "hover:border-accent-cyan/40",
  },
  {
    id: "t9",
    name: "Amara Singh",
    initials: "AS",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    review:
      "From grocery lists to long-term project docs, everything I write finally has a clear home.",
    accent: "from-accent-pink to-primary",
    borderGlow: "hover:border-accent-pink/40",
  },
];

function ProfileAvatar({ name, initials, avatar, accent }: ProfileAvatarProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        aria-hidden="true"
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${accent} text-xs font-bold text-white shadow-sm`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={`rounded-full bg-gradient-to-br ${accent} p-0.5 shadow-sm`}>
      <img
        src={avatar}
        alt={name}
        loading="lazy"
        onError={() => setHasError(true)}
        className="h-10 w-10 rounded-full object-cover bg-surface"
      />
    </div>
  );
}

function TestimonialCard({ item }: TestimonialCardProps) {
  return (
    <article
      className={`notiq-feature-item group relative flex w-[280px] shrink-0 flex-col justify-between overflow-hidden rounded-3xl p-5 sm:w-[320px] sm:p-6 ${item.borderGlow}`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-x-6 top-0 h-0.5 rounded-full bg-gradient-to-r ${item.accent} opacity-75 transition-opacity duration-200 group-hover:opacity-100`}
      />

      <p className="text-sm leading-relaxed text-body">
        “{item.review}”
      </p>

      <div className="mt-5 flex items-center gap-3">
        <ProfileAvatar
          name={item.name}
          initials={item.initials}
          avatar={item.avatar}
          accent={item.accent}
        />
        <span className="text-sm font-semibold tracking-tight text-heading">
          {item.name}
        </span>
      </div>
    </article>
  );
}

function TestimonialsSection() {
  const shouldReduceMotion = useReducedMotion();
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isPaused = isManuallyPaused || isHovered;

  const x = useMotionValue("0%");
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const controls = animate(x, ["0%", "-50%"], {
      repeat: Infinity,
      repeatType: "loop",
      duration: 42,
      ease: "linear",
    });

    controlsRef.current = controls;

    return () => {
      controls.stop();
      controlsRef.current = null;
    };
  }, [shouldReduceMotion, x]);

  useEffect(() => {
    if (!controlsRef.current) return;
    if (isPaused) {
      controlsRef.current.pause();
    } else {
      controlsRef.current.play();
    }
  }, [isPaused]);

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <h2
            id="testimonials-heading"
            className="text-3xl font-bold tracking-tight text-heading sm:text-4xl"
          >
            How People Use{" "}
            <span className="notiq-gradient-text">Notiq</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-body sm:text-base">
            Real workflows from people organizing their daily notes, tasks,
            reminders, routines, and documents in one place.
          </p>
        </motion.div>
      </div>

      {shouldReduceMotion ? (
        <div
          tabIndex={0}
          aria-label="Community love and user reviews"
          className="mx-auto mt-10 flex max-w-7xl gap-4 overflow-x-auto px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/40 sm:mt-12 sm:gap-6 sm:px-6"
        >
          {TESTIMONIALS.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="relative mt-10 w-full overflow-hidden sm:mt-12">
          <div className="mb-4 flex justify-center">
            <button
              type="button"
              onClick={() => setIsManuallyPaused((prev) => !prev)}
              aria-label={isManuallyPaused ? "Resume testimonial marquee" : "Pause testimonial marquee"}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1 text-xs font-medium text-body shadow-sm backdrop-blur-md transition-all hover:bg-surface hover:text-heading focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <span
                className={`h-2 w-2 rounded-full ${isManuallyPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`}
                aria-hidden="true"
              />
              <span>{isManuallyPaused ? "Resume auto-scroll" : "Pause auto-scroll"}</span>
            </button>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-bg to-transparent sm:w-24"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-bg to-transparent sm:w-24"
          />

          <motion.div
            className="flex w-max will-change-transform"
            style={{ x }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex shrink-0 gap-4 pr-4 sm:gap-6 sm:pr-6">
              {TESTIMONIALS.map((item) => (
                <TestimonialCard key={item.id} item={item} />
              ))}
            </div>

            <div
              aria-hidden="true"
              className="flex shrink-0 gap-4 pr-4 sm:gap-6 sm:pr-6"
            >
              {TESTIMONIALS.map((item) => (
                <TestimonialCard key={`${item.id}-clone`} item={item} />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}

export default TestimonialsSection;
