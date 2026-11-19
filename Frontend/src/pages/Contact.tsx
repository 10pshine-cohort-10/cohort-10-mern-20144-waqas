import React from "react";
import { motion, MotionConfig } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa6";
import {
  FiArrowUpRight,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
} from "react-icons/fi";
import Seo from "../components/common/Seo";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import PageHero from "../components/layout/PageHero";

/* Contact Page */

interface ContactCardItem {
  id: string;
  label: string;
  value: string;
  helper: string;
  href: string | null;
  icon: React.ElementType;
  accent: string;
  glow: string;
}

const CONTACT_CARDS: ContactCardItem[] = [
  {
    id: "phone",
    label: "Phone",
    value: "03025649101",
    helper: "Available for calls & project inquiries",
    href: "tel:03025649101",
    icon: FiPhone,
    accent: "from-neon-cyan/25 to-secondary/20 text-neon-cyan border-neon-cyan/30",
    glow: "hover:border-neon-cyan/50 hover:shadow-[0_0_26px_-6px_rgba(0,217,245,0.4)]",
  },
  {
    id: "email",
    label: "Email",
    value: "waqastariq9101@gmail.com",
    helper: "Send us a message anytime",
    href: "mailto:waqastariq9101@gmail.com",
    icon: FiMail,
    accent: "from-primary/25 to-neon-violet/20 text-primary border-primary/30",
    glow: "hover:border-primary/50 hover:shadow-[0_0_26px_-6px_rgba(146,117,255,0.4)]",
  },
  {
    id: "location",
    label: "Location",
    value: "Mirpur AJK",
    helper: "Collaborating locally & worldwide",
    href: null,
    icon: FiMapPin,
    accent: "from-neon-pink/25 to-primary/20 text-neon-pink border-neon-pink/30",
    glow: "hover:border-neon-pink/50 hover:shadow-[0_0_26px_-6px_rgba(255,91,200,0.35)]",
  },
];

const CONTACT_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Us | Notiq",
  description:
    "Connect with Notiq via phone, email, or WhatsApp in Mirpur AJK.",
  mainEntity: {
    "@type": "Organization",
    name: "Notiq",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+92-302-5649101",
      email: "waqastariq9101@gmail.com",
      contactType: "customer support",
      areaServed: "Mirpur AJK",
    },
  },
};

function Contact(): React.JSX.Element {
  return (
    <MotionConfig reducedMotion="user">
      <Seo
        title="Contact Us | Notiq — Let's Connect and Build Something Great"
        description="Get in touch with Notiq via phone (03025649101), email (waqastariq9101@gmail.com), or WhatsApp. Based in Mirpur AJK."
        keywords="Contact Notiq, Notiq support, Mirpur AJK, WhatsApp, waqastariq9101@gmail.com"
        structuredData={CONTACT_STRUCTURED_DATA}
      />
      <div className="notiq-hero-bg flex min-h-screen flex-col overflow-x-clip text-body">
        <Navbar />

        <main className="flex-1">
          <PageHero
            eyebrow="Contact Us"
            icon={FiMessageCircle}
            title={
              <>
                Let&apos;s Connect and{" "}
                <span className="notiq-gradient-text">Build Something Great.</span>
              </>
            }
            description="Have an idea, feedback on Notiq, or a project you want to bring to life? Reach out directly through any channel below."
          />

          {/* Glassmorphic Contact Cards */}
          <section className="py-10 sm:py-14">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {CONTACT_CARDS.map((card, index) => {
                  const Icon = card.icon;
                  const content = (
                    <>
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl border bg-gradient-to-br ${card.accent} transition-transform duration-300 group-hover:scale-105`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <p className="mt-5 text-xs font-semibold tracking-wider text-muted uppercase">
                        {card.label}
                      </p>
                      <h2 className="mt-1.5 break-all text-lg font-bold text-heading sm:text-xl">
                        {card.value}
                      </h2>
                      <p className="mt-2 text-sm text-body">{card.helper}</p>
                    </>
                  );

                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.45,
                        delay: index * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {card.href ? (
                        <a
                          href={card.href}
                          className={`notiq-float-card group block h-full rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 ${card.glow}`}
                        >
                          {content}
                        </a>
                      ) : (
                        <div
                          className={`notiq-float-card group h-full rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 ${card.glow}`}
                        >
                          {content}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Motivational Section + WhatsApp CTA */}
          <section className="pt-6 pb-16 sm:pb-24">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="notiq-glass relative overflow-hidden rounded-3xl p-8 text-center sm:p-12"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-20 left-1/3 h-52 w-52 rounded-full bg-primary/15 blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-20 right-1/3 h-52 w-52 rounded-full bg-neon-cyan/15 blur-3xl"
                />

                <div className="relative">
                  <p className="text-xs font-semibold tracking-wider text-neon-cyan uppercase">
                    Direct Conversation
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-heading sm:text-3xl">
                    Every Great Project Starts With a Conversation.
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-body sm:text-base">
                    Whether you&apos;re exploring a custom web application, need help
                    streamlining your workflow, or just want to share feedback on
                    Notiq, we&apos;re one message away.
                  </p>

                  <div className="mt-8 flex justify-center">
                    <a
                      href="https://wa.me/923025649101"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="notiq-btn-primary inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold"
                    >
                      <FaWhatsapp className="h-5 w-5" aria-hidden="true" />
                      <span>Chat on WhatsApp</span>
                      <FiArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
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

export default Contact;
