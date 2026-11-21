import React from "react";
import { motion } from "framer-motion";

export interface PageHeroProps {
  eyebrow?: string;
  icon?: React.ElementType;
  title: React.ReactNode;
  description?: React.ReactNode;
}

function PageHero({
  eyebrow,
  icon: Icon,
  title,
  description,
}: PageHeroProps): React.JSX.Element {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-24 left-1/5 h-72 w-72 rounded-full bg-primary/20 blur-3xl dark:bg-primary/25" />
        <div className="absolute top-12 right-1/5 h-80 w-80 rounded-full bg-neon-cyan/18 blur-3xl dark:bg-neon-cyan/22" />
        <div className="absolute -bottom-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-neon-pink/15 blur-3xl dark:bg-neon-pink/20" />

        <div
          className="absolute inset-0 opacity-[0.3] dark:opacity-[0.22]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--notiq-primary) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            maskImage:
              "radial-gradient(ellipse 80% 75% at 50% 45%, black 35%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 75% at 50% 45%, black 35%, transparent 100%)",
          }}
        />

        <svg
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full opacity-70 dark:opacity-85"
        >
          <defs>
            <linearGradient id="page-hero-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--notiq-primary)" stopOpacity="0" />
              <stop offset="25%" stopColor="var(--notiq-primary)" stopOpacity="0.55" />
              <stop offset="55%" stopColor="var(--notiq-accent-cyan)" stopOpacity="0.65" />
              <stop offset="80%" stopColor="var(--notiq-accent-pink)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="var(--notiq-accent-pink)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="page-hero-grad-2" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="var(--notiq-accent-cyan)" stopOpacity="0" />
              <stop offset="30%" stopColor="var(--notiq-secondary)" stopOpacity="0.5" />
              <stop offset="65%" stopColor="var(--notiq-accent-pink)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--notiq-primary)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="page-hero-grad-3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--notiq-accent-pink)" stopOpacity="0" />
              <stop offset="45%" stopColor="var(--notiq-primary)" stopOpacity="0.4" />
              <stop offset="75%" stopColor="var(--notiq-accent-cyan)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--notiq-secondary)" stopOpacity="0" />
            </linearGradient>
            <filter id="page-hero-glow" x="-10%" y="-40%" width="120%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M-40 310 C 260 210, 560 360, 880 230 C 1140 125, 1310 215, 1480 140"
            fill="none"
            stroke="url(#page-hero-grad-1)"
            strokeWidth="2.2"
            filter="url(#page-hero-glow)"
          />
          <path
            d="M-40 130 C 310 220, 600 60, 940 165 C 1200 245, 1340 100, 1480 155"
            fill="none"
            stroke="url(#page-hero-grad-2)"
            strokeWidth="1.75"
            filter="url(#page-hero-glow)"
          />
          <path
            d="M-40 245 C 340 145, 700 285, 1060 175 C 1240 120, 1370 165, 1480 205"
            fill="none"
            stroke="url(#page-hero-grad-3)"
            strokeWidth="1.4"
            filter="url(#page-hero-glow)"
          />
        </svg>

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
      >
        {eyebrow && (
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-surface/75 px-4 py-1.5 text-xs font-semibold tracking-wide text-heading uppercase shadow-sm backdrop-blur-md dark:bg-elevated/75">
            {Icon && (
              <Icon className="h-3.5 w-3.5 text-neon-cyan" aria-hidden="true" />
            )}
            <span>{eyebrow}</span>
          </div>
        )}

        <h1 className="text-3xl font-extrabold tracking-tight text-heading sm:text-5xl sm:leading-[1.12]">
          {title}
        </h1>

        {description && (
          <p className="mx-auto mt-5 max-w-2xl rounded-2xl bg-surface/45 px-4 py-2 text-base leading-relaxed text-body backdrop-blur-sm sm:text-lg dark:bg-bg/35">
            {description}
          </p>
        )}
      </motion.div>
    </section>
  );
}

export default PageHero;
