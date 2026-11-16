import { MotionConfig } from "framer-motion";
import Seo from "../components/common/Seo";
import FeatureShowcase from "../components/home/FeatureShowcase";
import FeaturesSection from "../components/home/FeaturesSection";
import Hero from "../components/home/Hero";
import HowItWorksSection from "../components/home/HowItWorksSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

/* Home Page */

const HOME_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Notiq",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Web",
  description:
    "All-in-one productivity workspace for daily notes, tasks, to-do lists, reminders, labels, daily routines, and documents.",
  featureList: [
    "Daily Notes",
    "Tasks",
    "To-Do Lists",
    "Reminders",
    "Labels",
    "Archived Notes",
    "Starred Notes",
    "Daily Routines",
    "Documents",
  ],
};

function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <Seo
        title="Notiq — Organize Notes, Tasks, Routines & Documents in One Workspace"
        description="Notiq helps you capture daily notes, manage tasks and to-do lists, set reminders, organize documents, and build consistent daily routines in one calm workspace."
        keywords="Notiq, notes app, daily notes, tasks, to-do lists, reminders, labels, daily routines, documents, productivity workspace"
        structuredData={HOME_STRUCTURED_DATA}
      />
      <div className="notiq-hero-bg min-h-screen overflow-x-clip text-body">
        <Navbar />
        <main>
          <Hero />
          <FeatureShowcase />
          <FeaturesSection />
          <HowItWorksSection />
          <TestimonialsSection />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default Home;
