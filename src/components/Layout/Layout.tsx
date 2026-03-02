import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { Header } from "./Header";
import { useThemeInit } from "@/hooks/useTheme";
import { usePageTracking } from "@/hooks/usePageTracking";
import { InstallBanner } from "@/components/common/InstallBanner";
import { OfflineBanner } from "@/components/common/OfflineBanner";
import { Onboarding, shouldShowOnboarding } from "@/components/Onboarding/Onboarding";
import { initPyodide } from "@/engine/sympy-bridge";

export function Layout() {
  useThemeInit();
  usePageTracking();

  // Eagerly preload Pyodide in the background so it's ready when user opens solver
  useEffect(() => {
    initPyodide().catch((err) => {
      console.warn("[MathSight] Pyodide preload failed:", err);
    });
  }, []);

  const [showOnboarding, setShowOnboarding] = useState(shouldShowOnboarding);

  return (
    <div className="min-h-screen">
      <OfflineBanner />
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}
      <Header />
      <main>
        <Outlet />
      </main>
      <InstallBanner />
    </div>
  );
}
