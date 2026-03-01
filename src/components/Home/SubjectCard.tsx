import { ChevronDown } from "lucide-react";
import type { Subject } from "@/types";
import { cn } from "@/utils/cn";

interface SubjectCardProps {
  subject: Subject;
  isExpanded: boolean;
  onToggle: () => void;
}

export function SubjectCard({ subject, isExpanded, onToggle }: SubjectCardProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-full text-left p-6 rounded-2xl transition-all duration-300 cursor-pointer",
        "bg-gradient-to-br",
        subject.gradient,
        "text-white shadow-lg",
        "hover:scale-[1.02] hover:shadow-xl",
        "border border-white/20"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{subject.icon}</span>
          <div>
            <h2 className="text-xl font-bold">{subject.name}</h2>
            <p className="text-sm text-white/70">{subject.subtitle}</p>
            <p className="text-sm text-white/60 mt-1">{subject.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
            {subject.units.length}개 단원
          </span>
          <ChevronDown
            className={cn(
              "w-5 h-5 transition-transform duration-300",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </div>
    </button>
  );
}
