import React from "react";
import { motion, MotionConfig } from "framer-motion";
import { FiCalendar, FiShield } from "react-icons/fi";
import Seo from "../components/common/Seo";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import PageHero from "../components/layout/PageHero";

/* Privacy Policy Page */

interface PolicySectionItem {
  id: string;
  title: string;
  body: string;
}

const LAST_UPDATED = "November 12, 2026";

const POLICY_SECTIONS: PolicySectionItem[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    body: "Welcome to Notiq. This Privacy Policy explains how Notiq collects, uses, stores, and protects information when you visit our website or use our productivity application. By creating an account or using Notiq, you agree to the practices described in this policy.",
  },
  {
    id: "information-collection",
    title: "2. Information Collection and Usage",
    body: "We collect information you provide directly when registering or using Notiq, such as your name, email address, and workspace content (notes, tasks, to-do lists, reminders, labels, routines, and documents). We use this information solely to operate, maintain, and improve your personal Notiq workspace and respond to support requests.",
  },
  {
    id: "account-security",
    title: "3. Account Security",
    body: "Your account is protected by your login credentials. Passwords are stored in hashed form rather than plain text, and you are responsible for keeping your password confidential. If you suspect unauthorized access to your account, please contact us promptly so we can assist you.",
  },
  {
    id: "notes-and-content",
    title: "4. Notes and User Content",
    body: "You retain ownership of all notes, tasks, routines, and documents you create inside Notiq. We do not sell your personal content or use your private notes for advertising purposes. Your workspace items are processed only as needed to display, organize, and sync them for you.",
  },
  {
    id: "data-storage",
    title: "5. Data Storage and Protection",
    body: "We take reasonable technical and organizational measures to safeguard your account data against accidental loss or unauthorized access. However, no online service or storage system can be guaranteed completely immune to risk, so we encourage using strong, unique passwords.",
  },
  {
    id: "cookies-third-party",
    title: "6. Cookies and Third-Party Services",
    body: "Notiq may use essential cookies or local browser storage to keep you signed in, remember your light/dark theme preference, and ensure smooth application performance. If third-party infrastructure providers (such as hosting or database services) are used to run the app, they process data only as needed to deliver the service.",
  },
  {
    id: "data-sharing",
    title: "7. Data Sharing",
    body: "We do not sell, rent, or trade your personal information to third parties. Information may only be disclosed if required by applicable law, to protect the rights and safety of Notiq and its users, or with service providers strictly necessary to operate the platform.",
  },
  {
    id: "user-rights",
    title: "8. User Rights and Data Deletion",
    body: "You can review, edit, archive, or delete your notes, tasks, and workspace items directly within the application. You may also request access to, correction of, or deletion of your account and associated personal data by contacting us at waqastariq9101@gmail.com.",
  },
  {
    id: "data-retention",
    title: "9. Data Retention",
    body: "We retain your account information and workspace content for as long as your account remains active or as needed to provide the service. When you request account deletion, we remove your personal data within a reasonable timeframe unless retention is required by law.",
  },
  {
    id: "childrens-privacy",
    title: "10. Children's Privacy",
    body: "Notiq is not directed toward children under the age of 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided personal information to us, please contact us so we can remove it.",
  },
  {
    id: "policy-updates",
    title: "11. Policy Updates",
    body: "We may update this Privacy Policy from time to time to reflect changes in our features or practices. When we make updates, we will revise the Last Updated date at the top of this page.",
  },
  {
    id: "contact-information",
    title: "12. Contact Information",
    body: "If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please reach out to us at waqastariq9101@gmail.com or by phone at 03025649101 (Mirpur AJK).",
  },
];

const PRIVACY_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy | Notiq",
  description:
    "Read Notiq's Privacy Policy covering information collection, account security, notes and user content, cookies, data retention, and user rights.",
  dateModified: "2026-11-12",
};

function PrivacyPolicy(): React.JSX.Element {
  return (
    <MotionConfig reducedMotion="user">
      <Seo
        title="Privacy Policy | Notiq — How We Handle Your Data"
        description="Learn how Notiq collects, uses, stores, and protects your account information, notes, tasks, and workspace content."
        keywords="Notiq privacy policy, data protection, user rights, account security, notes privacy"
        structuredData={PRIVACY_STRUCTURED_DATA}
      />
      <div className="notiq-hero-bg flex min-h-screen flex-col overflow-x-clip text-body">
        <Navbar />

        <main className="flex-1">
          <PageHero
            eyebrow="Privacy Policy"
            icon={FiShield}
            title={
              <>
                Your Privacy,{" "}
                <span className="notiq-gradient-text">Clearly Explained.</span>
              </>
            }
            description="We believe trust starts with transparency. Here is how Notiq handles your account information and workspace content."
          />

          <section className="pt-4 pb-16 sm:pb-24">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              {/* Last Updated Badge */}
              <div className="mb-8 flex justify-center sm:justify-start">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-surface/80 px-4 py-2 text-xs font-semibold text-heading backdrop-blur-md dark:bg-elevated/80">
                  <FiCalendar className="h-3.5 w-3.5 text-neon-cyan" aria-hidden="true" />
                  <span>Last Updated: {LAST_UPDATED}</span>
                </div>
              </div>

              <div className="space-y-5">
                {POLICY_SECTIONS.map((section, index) => (
                  <motion.article
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(index * 0.03, 0.2),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="notiq-float-card rounded-2xl p-6 sm:p-7"
                  >
                    <h2 className="text-lg font-bold text-heading sm:text-xl">
                      {section.title}
                    </h2>
                    <p className="mt-2.5 text-sm leading-relaxed text-body sm:text-base">
                      {section.body}
                    </p>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}

export default PrivacyPolicy;
