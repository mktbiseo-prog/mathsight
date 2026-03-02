import { lazy, Suspense } from "react";
import { HomePage } from "@/pages/Home/HomePage";
import { useIsStandalone } from "@/hooks/usePWAInstall";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

const LandingPage = lazy(() =>
  import("@/pages/Landing/LandingPage").then((m) => ({ default: m.LandingPage }))
);

export function RootPage() {
  const isStandalone = useIsStandalone();

  if (isStandalone) {
    return <HomePage />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LandingPage />
    </Suspense>
  );
}
