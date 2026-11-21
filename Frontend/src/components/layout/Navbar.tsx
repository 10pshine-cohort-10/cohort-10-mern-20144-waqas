import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import useThemeStore from "../../store/useThemeStore";

export interface NavItem {
  label: string;
  to: string;
  sectionId?: string;
  dropdown?: Array<{ label: string; to: string }>;
}

const NAV_LINKS: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/#features", sectionId: "features" },
  { label: "How It Works", to: "/#how-it-works", sectionId: "how-it-works" },
  { label: "Community Love", to: "/#testimonials", sectionId: "testimonials" },
];

const getNavLinkClass = (isActive: boolean, isMobile: boolean = false): string => {
  const layout = isMobile
    ? "flex w-full items-center justify-between rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-200"
    : "relative rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200";

  const state = isActive
    ? "bg-[image:var(--notiq-gradient-neon-subtle)] text-heading ring-1 ring-primary/25"
    : "text-body hover:-translate-y-px hover:bg-surface/75 hover:text-heading dark:hover:bg-elevated/75";

  return `${layout} ${state}`;
};

interface ThemeIconProps {
  isDark: boolean;
}

function ThemeIcon({ isDark }: ThemeIconProps): React.JSX.Element {
  if (isDark) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[18px] w-[18px] text-neon-cyan transition-transform duration-300"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px] transition-transform duration-300"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

interface MenuIconProps {
  isOpen: boolean;
}

function MenuIcon({ isOpen }: MenuIconProps): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {isOpen ? (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

/* Navigation Bar */
function Navbar(): React.JSX.Element {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  const isDark = theme === "dark";
  const closeMenu = (): void => setIsMenuOpen(false);

  const isLinkActive = (link: NavItem, routeActive: boolean): boolean => {
    if (link.sectionId) {
      return location.pathname === "/" && location.hash === `#${link.sectionId}`;
    }
    if (link.to === "/") {
      return routeActive && !location.hash;
    }
    return routeActive;
  };

  const handleLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    link: NavItem,
  ): void => {
    closeMenu();

    if (link.sectionId && location.pathname === "/") {
      const target = document.getElementById(link.sectionId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `/#${link.sectionId}`);
      }
      return;
    }

    if (link.to === "/" && location.pathname === "/") {
      window.scrollTo?.({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const handlePointerDown = (event: MouseEvent): void => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 w-full px-3 pt-4 sm:px-6 sm:pt-5">
      <motion.nav
        ref={navRef}
        aria-label="Main navigation"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative mx-auto w-full max-w-6xl"
      >
        <div className="notiq-glass flex items-center justify-between gap-2 rounded-full px-3.5 py-2 sm:gap-4 sm:px-5 sm:py-2.5">
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex shrink-0 items-center gap-1.5 rounded-full py-0.5 pr-2 transition-opacity duration-200 hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <img
              src={logo}
              alt="Notiq logo"
              className="h-9 w-9 shrink-0 rounded-xl object-contain shadow-sm transition-transform duration-200 group-hover:scale-105 sm:h-10 sm:w-10"
            />
            <span className="notiq-gradient-text text-lg font-bold tracking-tight whitespace-nowrap sm:text-xl">
              Notiq
            </span>
          </Link>

          <ul className="hidden items-center gap-0.5 lg:flex xl:gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  onClick={(event) => handleLinkClick(event, link)}
                  className={({ isActive }) =>
                    getNavLinkClass(isLinkActive(link, isActive))
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-body transition-all duration-200 hover:scale-105 hover:bg-surface/80 hover:text-heading active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-elevated/80"
            >
              <ThemeIcon isDark={isDark} />
            </button>

            <Link
              to="/login"
              onClick={closeMenu}
              className="notiq-btn-primary inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:px-5 sm:py-2"
            >
              Login
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-body transition-all duration-200 hover:bg-surface/80 hover:text-heading active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden dark:hover:bg-elevated/80"
            >
              <MenuIcon isOpen={isMenuOpen} />
            </button>
          </div>
        </div>

        <div
          id="mobile-nav-menu"
          aria-hidden={!isMenuOpen}
          className={`absolute inset-x-0 top-full grid transition-[grid-template-rows,opacity,transform] duration-300 ease-out lg:hidden ${
            isMenuOpen
              ? "mt-2.5 grid-rows-[1fr] translate-y-0 opacity-100"
              : "pointer-events-none mt-2.5 grid-rows-[0fr] -translate-y-2 opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <ul className="notiq-glass-menu flex flex-col gap-1 rounded-3xl p-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    tabIndex={isMenuOpen ? 0 : -1}
                    onClick={(event) => handleLinkClick(event, link)}
                    className={({ isActive }) =>
                      getNavLinkClass(isLinkActive(link, isActive), true)
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span>{link.label}</span>
                        {isLinkActive(link, isActive) && (
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-neon-cyan"
                            aria-hidden="true"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.nav>
    </header>
  );
}

export default Navbar;
