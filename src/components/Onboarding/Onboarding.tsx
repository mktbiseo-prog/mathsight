import { useState, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

const STORAGE_KEY = "mathsight-onboarding-completed";

export function shouldShowOnboarding() {
  return !localStorage.getItem(STORAGE_KEY);
}

function completeOnboarding() {
  localStorage.setItem(STORAGE_KEY, "1");
}

interface OnboardingProps {
  onComplete: () => void;
}

const SCREENS = [
  {
    title: "수학, 눈으로 보면\n이해된다",
    desc: "공식을 외우는 대신\n직접 눈으로 확인하세요",
    svg: (
      <svg viewBox="0 0 200 160" className="w-48 h-auto">
        <defs>
          <linearGradient id="ob-g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1976D2" />
            <stop offset="100%" stopColor="#42A5F5" />
          </linearGradient>
        </defs>
        <rect x="20" y="20" width="60" height="60" rx="4" fill="url(#ob-g1)" opacity="0.3" />
        <rect x="20" y="20" width="60" height="60" rx="4" fill="none" stroke="#1976D2" strokeWidth="2" />
        <text x="50" y="55" textAnchor="middle" fontSize="16" fontWeight="700" fill="#1976D2">a²</text>
        <rect x="80" y="20" width="30" height="60" rx="4" fill="#7B1FA2" opacity="0.2" />
        <rect x="80" y="20" width="30" height="60" rx="4" fill="none" stroke="#7B1FA2" strokeWidth="2" />
        <text x="95" y="55" textAnchor="middle" fontSize="12" fontWeight="600" fill="#7B1FA2">ab</text>
        <rect x="20" y="80" width="60" height="30" rx="4" fill="#7B1FA2" opacity="0.2" />
        <text x="50" y="100" textAnchor="middle" fontSize="12" fontWeight="600" fill="#7B1FA2">ab</text>
        <rect x="80" y="80" width="30" height="30" rx="4" fill="#E69F00" opacity="0.3" />
        <text x="95" y="100" textAnchor="middle" fontSize="12" fontWeight="700" fill="#E69F00">b²</text>
        <text x="150" y="65" textAnchor="middle" fontSize="11" fontWeight="600" fill="#333">(a+b)²</text>
        <text x="150" y="85" textAnchor="middle" fontSize="10" fill="#666">= a²+2ab+b²</text>
      </svg>
    ),
  },
  {
    title: "끌어서 조작하고\n실시간으로 확인",
    desc: "슬라이더와 드래그로\n값을 바꾸며 직접 체험",
    svg: (
      <svg viewBox="0 0 200 160" className="w-48 h-auto">
        <rect x="30" y="70" width="140" height="6" rx="3" fill="#E0E0E0" />
        <rect x="30" y="70" width="80" height="6" rx="3" fill="#1976D2" />
        <circle cx="110" cy="73" r="12" fill="#1976D2" />
        <circle cx="110" cy="73" r="8" fill="#fff" />
        <path d="M100 73 L120 73" stroke="#1976D2" strokeWidth="2" />
        <path d="M70 30 Q90 10 110 40 Q130 70 150 20" fill="none" stroke="#D55E00" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="110" cy="40" r="5" fill="#D55E00" />
        <line x1="110" y1="40" x2="110" y2="73" stroke="#999" strokeWidth="1" strokeDasharray="4,3" />
        <text x="100" y="130" textAnchor="middle" fontSize="11" fill="#666">드래그하여 값 변경</text>
        <path d="M80 115 C85 110 90 112 92 108" fill="none" stroke="#999" strokeWidth="1" />
        <polygon points="92,108 94,114 88,112" fill="#999" />
      </svg>
    ),
  },
  {
    title: "지금 시작해보세요!",
    desc: "중등·고등 수학을\n시각적으로 마스터",
    svg: (
      <svg viewBox="0 0 200 160" className="w-48 h-auto">
        <circle cx="100" cy="60" r="45" fill="#1976D2" opacity="0.1" />
        <text x="100" y="50" textAnchor="middle" fontSize="40">🚀</text>
        <text x="100" y="80" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1976D2">MathSight</text>
        <g transform="translate(40,110)">
          <rect width="36" height="28" rx="6" fill="#E3F2FD" stroke="#1976D2" strokeWidth="1.5" />
          <text x="18" y="18" textAnchor="middle" fontSize="8" fill="#1976D2" fontWeight="600">중등</text>
        </g>
        <g transform="translate(82,110)">
          <rect width="36" height="28" rx="6" fill="#FCE4EC" stroke="#D32F2F" strokeWidth="1.5" />
          <text x="18" y="18" textAnchor="middle" fontSize="8" fill="#D32F2F" fontWeight="600">고등</text>
        </g>
        <g transform="translate(124,110)">
          <rect width="36" height="28" rx="6" fill="#E8F5E9" stroke="#2E7D32" strokeWidth="1.5" />
          <text x="18" y="18" textAnchor="middle" fontSize="8" fill="#2E7D32" fontWeight="600">탐구</text>
        </g>
      </svg>
    ),
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [page, setPage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  const finish = useCallback(() => {
    completeOnboarding();
    onComplete();
  }, [onComplete]);

  const next = () => {
    if (page < SCREENS.length - 1) setPage(page + 1);
    else finish();
  };

  const prev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) next();
      else prev();
    }
  };

  const screen = SCREENS[page];

  return (
    <div
      className="fixed inset-0 z-[100] bg-white dark:bg-surface-dark flex flex-col items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Skip */}
      <button
        onClick={finish}
        className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Content */}
      <div className="flex flex-col items-center text-center px-8 max-w-sm">
        <div className="mb-8">{screen.svg}</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white whitespace-pre-line leading-tight">
          {screen.title}
        </h2>
        <p className="mt-3 text-gray-500 dark:text-gray-400 whitespace-pre-line leading-relaxed">
          {screen.desc}
        </p>
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-10">
        {SCREENS.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all",
              i === page
                ? "bg-primary w-6"
                : "bg-gray-300 dark:bg-gray-600",
            )}
          />
        ))}
      </div>

      {/* Action */}
      <button
        onClick={next}
        className="mt-8 px-8 py-3 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
      >
        {page === SCREENS.length - 1 ? "시작하기" : "다음"}
      </button>
    </div>
  );
}
