import { Link, useLocation } from "react-router";
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
    <header className="sticky top-0 z-50 border-b border-border-warm dark:border-white/6 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-display text-lg font-bold group-hover:bg-primary/20 transition-colors">
            π
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Math<span className="text-primary">Sight</span>
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
                  ? "bg-primary-light dark:bg-primary/15 text-primary dark:text-primary"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
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
