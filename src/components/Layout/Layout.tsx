import { Outlet } from "react-router";
import { Header } from "./Header";
import { useThemeInit } from "@/hooks/useTheme";

export function Layout() {
  useThemeInit();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
