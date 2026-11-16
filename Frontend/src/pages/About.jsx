import { motion, MotionConfig } from "framer-motion";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiCheckSquare,
  FiCode,
  FiCompass,
  FiCpu,
  FiGlobe,
  FiLayers,
  FiPenTool,
  FiZap,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Seo from "../components/common/Seo";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import PageHero from "../components/layout/PageHero";

/* About Page */

const SERVICES = [
  {
    title: "Web Applications",
    description:
      "Fast, responsive web apps built with modern architectures for seamless everyday workflows.",
    icon: FiGlobe,
    accent: "from-neon-cyan/25 to-secondary/20 text-neon-cyan border-neon-cyan/30",
  },
  {
    title: "Business Systems",
    description:
      "Structured dashboards, internal tools, and operational systems tailored to growing teams.",
    icon: FiLayers,
    accent: "from-primary/25 to-neon-violet/20 text-primary border-primary/30",
  },
  {
    title: "Custom Software",
    description:
      "Purpose-built software crafted around your exact goals, processes, and scaling needs.",
    icon: FiCode,
    accent: "from-neon-pink/25 to-primary/20 text-neon-pink border-neon-pink/30",
  },
  {
    title: "UI/UX Design",
    description:
      "Clean, intuitive interfaces that balance visual polish with effortless usability.",
    icon: FiPenTool,
    accent: "from-secondary/25 to-neon-cyan/20 text-secondary dark:text-neon-blue border-secondary/30",
  },
  {
    title: "Productivity Solutions",
    description:
      "Focused tools for notes, tasks, routines, and documents that help you stay ahead.",
    icon: FiCheckSquare,
    accent: "from-neon-cyan/25 to-primary/20 text-neon-cyan border-neon-cyan/30",
  },
  {
    title: "AI Integrations",
    description:
      "Practical AI-powered workflows that automate repetitive tasks and surface clarity faster.",
    icon: FiCpu,
    accent: "from-neon-pink/25 to-neon-violet/20 text-neon-pink border-neon-pink/30",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const ABOUT_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Us | Notiq",
  description:
    "Learn about Notiq's vision to simplify productivity and our capabilities in web applications, business systems, custom software, UI/UX design, productivity solutions, and AI integrations.",
  mainEntity: {
    "@type": "Organization",
    name: "Notiq",
    sameAs: ["https://waqasportfolio77.vercel.app/"],
  },
};

function About() {
  return (
    <MotionConfig reducedMotion="user">
      <Seo
        title="About Us | Notiq — Making Life Organized"
        description="Discover Notiq's vision for calm, structured productivity and explore our work in web applications, business systems, custom software, UI/UX design, and AI integrations."
        keywords="About Notiq, productivity vision, web applications, business systems, custom software, UI/UX design, AI integrations"
        structuredData={ABOUT_STRUCTURED_DATA}
      />
      <div className="notiq-hero-bg flex min-h-screen flex-col overflow-x-clip text-body">
        <Navbar />

        <main className="flex-1">
          <PageHero
            eyebrow="About Notiq"
            icon={FiCompass}
            title={
              <>
                More Than Just an App, We&apos;re Here to Make{" "}
                <span className="notiq-gradient-text">Life Organized.</span>
              </>
            }
            description="We craft calm, modern digital experiences where your notes, tasks, routines, and projects come together with clarity."
          />

          {/* Our Vision */}
          <section className="py-12 sm:py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="notiq-float-card relative overflow-hidden rounded-3xl p-7 sm:p-10"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl"
                />
                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/25 to-neon-cyan/20 text-primary">
                    <FiZap className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-neon-cyan uppercase">
                      Our Vision
                    </p>
                    <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-heading sm:text-3xl">
                      Simplifying productivity so you can focus on what matters most.
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-body sm:text-base">
                      Great work shouldn&apos;t feel buried under scattered tabs, forgotten
                      sticky notes, or complicated tools. Our vision is to replace daily
                      friction with an intuitive, thoughtfully designed workspace that
                      adapts to how you think, plan, and create—helping students,
                      creators, and teams turn everyday ideas into meaningful progress.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* What We Do */}
          <section className="py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="mx-auto max-w-2xl text-center"
              >
                <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                  What We Do
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-heading sm:text-4xl">
                  Digital solutions built for{" "}
                  <span className="notiq-gradient-text">clarity and scale</span>
                </h2>
                <p className="mt-3 text-sm text-muted sm:text-base">
                  Beyond Notiq, we design and engineer modern software products that
                  empower individuals and businesses.
                </p>
              </motion.div>

              <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {SERVICES.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="notiq-float-card group rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl border bg-gradient-to-br ${service.accent} transition-transform duration-300 group-hover:scale-105`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-heading">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-body">
                        {service.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Our Showcase */}
          <section className="py-12 sm:py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="notiq-glass relative overflow-hidden rounded-3xl p-8 text-center sm:p-12"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-neon-cyan/18 blur-3xl"
                />
                <div className="relative">
                  <p className="text-xs font-semibold tracking-wider text-neon-pink uppercase">
                    Our Showcase
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-heading sm:text-3xl">
                    See our craft in action
                  </h2>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-body sm:text-base">
                    Explore featured web applications, custom software builds, and UI/UX
                    projects crafted with precision and modern engineering.
                  </p>
                  <div className="mt-7">
                    <a
                      href="https://waqasportfolio77.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="notiq-btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold"
                    >
                      <span>Explore Our Showcase</span>
                      <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Motivational Closing Section */}
          <section className="pt-6 pb-16 sm:pb-20">
            <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <h2 className="text-2xl font-bold tracking-tight text-heading sm:text-3xl">
                  Ready to bring{" "}
                  <span className="notiq-gradient-text">calm and structure</span> to
                  every day?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-muted sm:text-base">
                  Whether you&apos;re organizing your personal goals with Notiq or
                  building your next digital product with us, every step forward starts
                  with clarity.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    to="/register"
                    className="notiq-btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                  >
                    <span>Get Started Free</span>
                    <FiArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-6 py-3 text-sm font-semibold text-heading backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40"
                  >
                    <span>Talk With Us</span>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}

export default About;

