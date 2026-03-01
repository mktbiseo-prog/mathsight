import { Link, useLocation } from "react-router";
import { Compass } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/utils/cn";

const NAV_ITEMS = [
  { to: "/", label: "홈" },
  { to: "/solve", label: "문제 풀이" },
  { to: "/explore", label: "자유 탐구" },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Compass className="w-6 h-6 text-neon-blue group-hover:rotate-45 transition-transform duration-300" />
          <span className="text-lg font-bold">
            Math<span className="text-neon-blue">Sight</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.to
                  ? "bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
