/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import ProductShowcase from "./components/ProductShowcase";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import CareerUniverseCTA from "./components/CareerUniverseCTA";
import Footer from "./components/Footer";
import FigmaDesignSystemModal from "./components/FigmaDesignSystemModal";

// Custom Pages
import { AppView, UserSession } from "./types";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GoogleAuth from "./pages/GoogleAuth";
import GitHubAuth from "./pages/GitHubAuth";
import OtpVerification from "./pages/OtpVerification";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [view, setView] = useState<AppView>(() => {
    const path = window.location.pathname;
    // If the SPA ever loads on an API route, force a full reload so Express can handle OAuth
    if (path.startsWith("/api/")) {
      window.location.replace(window.location.href);
      return "landing";
    }
    if (path === "/google-auth") return "google-auth";
    if (path === "/github-auth") return "github-auth";
    return "landing";
  });
  const [activeSection, setActiveSection] = useState("hero");
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [pendingEmail, setPendingEmail] = useState("");
  const [isFigmaModalOpen, setIsFigmaModalOpen] = useState(false);

  // Synchronize view state with window URL path
  useEffect(() => {
    const path = window.location.pathname;
    if (view === "google-auth" && path !== "/google-auth") {
      window.history.pushState({}, "", "/google-auth");
    } else if (view === "github-auth" && path !== "/github-auth") {
      window.history.pushState({}, "", "/github-auth");
    } else if (view !== "google-auth" && view !== "github-auth" && path !== "/" && !path.startsWith("/api/")) {
      window.history.pushState({}, "", "/");
    }
  }, [view]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/google-auth") {
        setView("google-auth");
      } else if (path === "/github-auth") {
        setView("github-auth");
      } else {
        setView("landing");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Check for auto login session on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    let token = tokenFromUrl;

    if (tokenFromUrl) {
      localStorage.setItem("nexhire_auth_token", tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      token = localStorage.getItem("nexhire_auth_token");
    }

    if (token) {
      fetch("/api/auth/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setUserSession({
              name: data.user.name,
              email: data.user.email,
              college: data.user.college,
              authMethod: "email",
              token: token!
            });
            setView("dashboard");
          } else {
            localStorage.removeItem("nexhire_auth_token");
          }
        })
        .catch(() => {
          localStorage.removeItem("nexhire_auth_token");
        });
    }
  }, []);

  // Track scroll position to set active section for the glass navbar indicators
  useEffect(() => {
    if (view !== "landing") return;

    const handleScroll = () => {
      const sections = ["hero", "features", "how-it-works", "showcase", "testimonials", "pricing", "faq"];
      const scrollPosition = window.scrollY + 200; // Offset for triggers

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [view]);

  const handleNavigate = (sectionId: string) => {
    if (view !== "landing") {
      setView("landing");
      // Wait for DOM to mount landing page
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          setActiveSection(sectionId);
        }
      }, 100);
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  // Render active routing views
  if (view === "login") {
    return (
      <Login
        onNavigate={(target) => setView(target)}
        onLoginSuccess={(session) => {
          if (session.token) {
            localStorage.setItem("nexhire_auth_token", session.token);
          }
          setUserSession(session);
          setView("dashboard");
        }}
      />
    );
  }

  if (view === "signup") {
    return (
      <Signup
        onNavigate={(target) => setView(target)}
        onSignupSubmit={(session) => {
          setPendingEmail(session.email);
          fetch("/api/auth/otp/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: session.email })
          }).catch(err => console.error("Failed to send initial signup OTP:", err));
          setView("otp-verification");
        }}
      />
    );
  }

  if (view === "google-auth") {
    return (
      <GoogleAuth
        onNavigate={(target) => setView(target)}
        onSelectAccount={(session) => {
          fetch("/api/auth/social", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: session.name,
              email: session.email,
              provider: "google"
            })
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.token) {
                localStorage.setItem("nexhire_auth_token", data.token);
                session.token = data.token;
              }
              setUserSession(session);
              setView("dashboard");
            })
            .catch(() => {
              setUserSession(session);
              setView("dashboard");
            });
        }}
      />
    );
  }

  if (view === "github-auth") {
    return (
      <GitHubAuth
        onNavigate={(target) => setView(target)}
        onAuthorize={(session) => {
          fetch("/api/auth/social", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: session.name,
              email: session.email,
              provider: "github"
            })
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.token) {
                localStorage.setItem("nexhire_auth_token", data.token);
                session.token = data.token;
              }
              setUserSession(session);
              setView("dashboard");
            })
            .catch(() => {
              setUserSession(session);
              setView("dashboard");
            });
        }}
      />
    );
  }

  if (view === "otp-verification") {
    return (
      <OtpVerification
        email={pendingEmail}
        onNavigate={(target) => setView(target)}
        onVerifySuccess={(session) => {
          if (session.token) {
            localStorage.setItem("nexhire_auth_token", session.token);
          }
          setUserSession(session);
          setView("dashboard");
        }}
      />
    );
  }

  if (view === "forgot-password") {
    return (
      <ForgotPassword
        onNavigate={(target) => setView(target)}
      />
    );
  }

  if (view === "dashboard" && userSession) {
    return (
      <Dashboard
        session={userSession}
        onSignOut={() => {
          localStorage.removeItem("nexhire_auth_token");
          setUserSession(null);
          setPendingEmail("");
          setView("landing");
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#2563eb]/30 selection:text-white">
      {/* Translucent Glass Navbar */}
      <Navbar 
        onNavigate={handleNavigate} 
        activeSection={activeSection} 
        onLoginClick={() => setView("login")}
        onSignupClick={() => setView("signup")}
        onOpenFigmaModal={() => setIsFigmaModalOpen(true)}
      />

      {/* Main Page Layout Flow */}
      <main className="relative">
        
        {/* HERO SECTION */}
        <Hero 
          onExploreFeatures={() => handleNavigate("features")} 
          onExplorePricing={() => setView("signup")} 
        />

        {/* SOCIAL PROOF / STATS */}
        <div id="how-it-works">
          <Stats />
        </div>

        {/* FEATURES BENTO GRID */}
        <Features />

        {/* HOW NEXHIRE WORKS / PRODUCT SHOWCASE */}
        <ProductShowcase onSignupClick={() => setView("signup")} />

        {/* TESTIMONIALS */}
        <Testimonials />

        {/* PRICING */}
        <Pricing onPlanSelect={() => setView("signup")} />

        {/* FAQ */}
        <FAQ />
      </main>

      {/* DYNAMIC ORBITAL CAREER UNIVERSE CALL TO ACTION */}
      <CareerUniverseCTA onExplorePricing={() => setView("signup")} />

      {/* FOOTER */}
      <Footer onExplorePricing={() => setView("signup")} />

      {/* FIGMA DESIGN SYSTEM BRIEF MODAL */}
      <FigmaDesignSystemModal
        isOpen={isFigmaModalOpen}
        onClose={() => setIsFigmaModalOpen(false)}
      />
    </div>
  );
}

