import { useNavigate } from "react-router";
import { ChevronRight } from "lucide-react";
import type { Unit, SubjectId } from "@/types";
import { cn } from "@/utils/cn";

interface UnitListProps {
  units: Unit[];
  subjectId: SubjectId;
  isVisible: boolean;
}

export function UnitList({ units, subjectId, isVisible }: UnitListProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300",
        isVisible ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0",
      )}
    >
      <div className="rounded-xl border border-border-warm dark:border-white/6 bg-bg-card dark:bg-surface-card overflow-hidden divide-y divide-gray-100 dark:divide-white/5">
        {units.map((unit, index) => (
          <button
            key={unit.id}
            onClick={() => navigate(`/concept/${subjectId}/${unit.id}`)}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-primary-light/50 dark:hover:bg-surface-hover transition-colors text-left group"
          >
            <span className="text-sm text-gray-400 dark:text-gray-500 font-mono w-5 text-right">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={cn("text-xl w-8 text-center", unit.color)}>
              {unit.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {unit.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {unit.description}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
}
