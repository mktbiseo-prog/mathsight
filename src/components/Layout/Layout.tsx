import { useState } from "react";
import { Outlet } from "react-router";
import { Header } from "./Header";
import { useThemeInit } from "@/hooks/useTheme";
import { usePageTracking } from "@/hooks/usePageTracking";
import { InstallBanner } from "@/components/common/InstallBanner";
import { Onboarding, shouldShowOnboarding } from "@/components/Onboarding/Onboarding";

export function Layout() {
  useThemeInit();
  usePageTracking();

  const [showOnboarding, setShowOnboarding] = useState(shouldShowOnboarding);

  return (
    <div className="min-h-screen">
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
