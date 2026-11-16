import { motion } from "framer-motion";
import {
  FiArrowUp,
  FiMail,
  FiMapPin,
  FiPhone,
  FiZap,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

const QUICK_LINKS = [
  { label: "Home", to: "/", sectionId: null },
  { label: "Features", to: "/#features", sectionId: "features" },
  { label: "How It Works", to: "/#how-it-works", sectionId: "how-it-works" },
  { label: "Community Love", to: "/#testimonials", sectionId: "testimonials" },
];

const COMPANY_LINKS = [
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Login", to: "/login" },
  { label: "Register", to: "/register" },
];

const CONTACT_ITEMS = [
  {
    id: "phone",
    label: "Phone",
    value: "03025649101",
    href: "tel:03025649101",
    icon: FiPhone,
    iconBg: "from-neon-cyan/25 to-secondary/20 text-neon-cyan border-neon-cyan/30",
  },
  {
    id: "email",
    label: "Email",
    value: "waqastariq9101@gmail.com",
    href: "mailto:waqastariq9101@gmail.com",
    icon: FiMail,
    iconBg: "from-primary/25 to-neon-violet/20 text-primary border-primary/30",
  },
  {
    id: "address",
    label: "Address",
    value: "Mirpur AJK",
    href: null,
    icon: FiMapPin,
    iconBg: "from-neon-pink/25 to-primary/20 text-neon-pink border-neon-pink/30",
  },
];

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/waqas_tariq77?cplk=MWoyNTZmc203NjhyYQ%3D%3D&utm_source=qr",
    icon: FaInstagram,
    gradient: "from-neon-pink/25 via-primary/20 to-neon-violet/25",
    iconColor: "text-neon-pink",
    hoverGlow: "hover:border-neon-pink/50 hover:shadow-[0_0_20px_-4px_rgba(255,91,200,0.45)]",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/waqas-tariq-9a0a2b332?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    icon: FaLinkedinIn,
    gradient: "from-secondary/25 via-neon-blue/20 to-neon-cyan/25",
    iconColor: "text-secondary dark:text-neon-blue",
    hoverGlow: "hover:border-secondary/50 hover:shadow-[0_0_20px_-4px_rgba(82,139,255,0.45)]",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/waqas.tariq.203698?mibextid=wwXIfr",
    icon: FaFacebookF,
    gradient: "from-neon-blue/25 via-primary/20 to-secondary/25",
    iconColor: "text-primary",
    hoverGlow: "hover:border-primary/50 hover:shadow-[0_0_20px_-4px_rgba(146,117,255,0.45)]",
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/waqastariq8917?s=11",
    icon: FaXTwitter,
    gradient: "from-neon-cyan/25 via-secondary/20 to-primary/25",
    iconColor: "text-neon-cyan",
    hoverGlow: "hover:border-neon-cyan/50 hover:shadow-[0_0_20px_-4px_rgba(0,217,245,0.45)]",
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.06,
    },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

/* Footer Section */
function Footer() {
  const location = useLocation();

  const handleSectionScroll = (event, item) => {
    if (item.sectionId && location.pathname === "/") {
      const target = document.getElementById(item.sectionId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `/#${item.sectionId}`);
      }
      return;
    }

    if (item.to === "/" && location.pathname === "/") {
      event.preventDefault();
      window.scrollTo?.({ top: 0, behavior: "smooth" });
    }
  };

  const handleBackToTop = () => {
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="relative overflow-hidden bg-surface/95 dark:bg-elevated/95 pt-14 pb-8 transition-colors duration-150 sm:pt-16 transform-gpu"
      style={{ transform: "translateZ(0)" }}
    >
      {/* Top vibrant neon-gradient border line with subtle glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/75 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary/60 to-transparent blur-sm"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.22] dark:opacity-[0.16]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--notiq-primary) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 360"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60 dark:opacity-75"
      >
        <defs>
          <linearGradient id="footer-neon-line-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--notiq-primary)" stopOpacity="0" />
            <stop offset="28%" stopColor="var(--notiq-primary)" stopOpacity="0.45" />
            <stop offset="55%" stopColor="var(--notiq-accent-cyan)" stopOpacity="0.55" />
            <stop offset="82%" stopColor="var(--notiq-accent-pink)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--notiq-accent-pink)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="footer-neon-line-2" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="var(--notiq-accent-cyan)" stopOpacity="0" />
            <stop offset="30%" stopColor="var(--notiq-secondary)" stopOpacity="0.4" />
            <stop offset="65%" stopColor="var(--notiq-accent-pink)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--notiq-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Path 1: Outer soft glow + inner sharp stroke */}
        <path
          d="M-40 270 C 260 190, 540 330, 860 220 C 1100 135, 1280 210, 1480 150"
          fill="none"
          stroke="url(#footer-neon-line-1)"
          strokeWidth="5"
          strokeOpacity="0.25"
        />
        <path
          d="M-40 270 C 260 190, 540 330, 860 220 C 1100 135, 1280 210, 1480 150"
          fill="none"
          stroke="url(#footer-neon-line-1)"
          strokeWidth="1.75"
        />

        {/* Path 2: Outer soft glow + inner sharp stroke */}
        <path
          d="M-40 120 C 280 185, 580 55, 920 145 C 1180 215, 1320 95, 1480 135"
          fill="none"
          stroke="url(#footer-neon-line-2)"
          strokeWidth="4"
          strokeOpacity="0.25"
        />
        <path
          d="M-40 120 C 280 185, 580 55, 920 145 C 1180 215, 1320 95, 1480 135"
          fill="none"
          stroke="url(#footer-neon-line-2)"
          strokeWidth="1.35"
        />
      </svg>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/5 h-52 w-52 rounded-full bg-primary/14 blur-2xl transform-gpu"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-1/5 h-52 w-52 rounded-full bg-neon-cyan/14 blur-2xl transform-gpu"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_minmax(0,0.9fr)_auto] lg:gap-12">
          <motion.div variants={columnVariants}>
            <Link
              to="/"
              onClick={(e) => handleSectionScroll(e, { to: "/", sectionId: null })}
              className="group inline-flex items-center gap-3 focus:outline-none"
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[image:var(--notiq-gradient-neon-subtle)] p-1.5 ring-1 ring-primary/25 transition-transform duration-300 group-hover:scale-105">
                <img
                  src={logo}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="notiq-gradient-text text-2xl font-bold tracking-tight">
                Notiq
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-body">
              Organize your notes, tasks, daily routines, and important documents in one
              calm, vibrant workspace built for everyday clarity.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <FiZap className="h-3.5 w-3.5" aria-hidden="true" />
                Smart Notes
              </span>
              <span className="inline-flex items-center rounded-full border border-neon-cyan/25 bg-neon-cyan/10 px-3 py-1 text-xs font-medium text-neon-cyan">
                Daily Routines
              </span>
              <span className="inline-flex items-center rounded-full border border-neon-pink/25 bg-neon-pink/10 px-3 py-1 text-xs font-medium text-neon-pink">
                Tasks &amp; Docs
              </span>
            </div>
          </motion.div>

          <motion.div variants={columnVariants}>
            <h3 className="text-sm font-semibold tracking-wide text-heading uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    onClick={(e) => handleSectionScroll(e, item)}
                    className="group inline-flex items-center gap-2 text-sm text-body transition-colors duration-200 hover:text-heading"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan/70 transition-transform duration-200 group-hover:scale-125 group-hover:bg-primary" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={columnVariants}>
            <h3 className="text-sm font-semibold tracking-wide text-heading uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5">
              {COMPANY_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="group inline-flex items-center gap-2 text-sm text-body transition-colors duration-200 hover:text-heading"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-neon-pink/70 transition-transform duration-200 group-hover:scale-125 group-hover:bg-neon-cyan" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            id="footer-contact"
            variants={columnVariants}
          >
            <h3 className="text-sm font-semibold tracking-wide text-heading uppercase">
              Contact Information
            </h3>

            <ul className="mt-4 space-y-3">
              {CONTACT_ITEMS.map((item) => {
                const Icon = item.icon;
                const inner = (
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br ${item.iconBg} transition-transform duration-200 group-hover:scale-105`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium tracking-wide text-muted uppercase">
                        {item.label}
                      </p>
                      <p className="truncate text-sm font-medium text-heading">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );

                return (
                  <li key={item.id}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="group block rounded-xl p-1 -m-1 transition-colors duration-200 hover:bg-surface/70 dark:hover:bg-elevated/60"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="group block p-1 -m-1">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-6">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                Connect With Us
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                {SOCIAL_LINKS.map((social) => {
                  const SocialIcon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      title={social.name}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-gradient-to-br ${social.gradient} ${social.iconColor} transition-all duration-150 hover:-translate-y-1 hover:scale-105 active:scale-95 ${social.hoverGlow}`}
                    >
                      <SocialIcon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative mt-12 pt-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-center text-xs text-muted sm:text-left">
              © 2026 Notiq. All rights reserved.
            </p>

            <button
              type="button"
              onClick={handleBackToTop}
              className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface/80 px-4 py-1.5 text-xs font-semibold text-heading backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_0_18px_-4px_rgba(146,117,255,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <span>Back to Top</span>
              <FiArrowUp
                className="h-3.5 w-3.5 text-neon-cyan transition-transform duration-200 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

export default Footer;
