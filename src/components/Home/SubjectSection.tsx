import type { Subject } from "@/types";
import { SubjectCard } from "./SubjectCard";
import { UnitList } from "./UnitList";

interface SubjectSectionProps {
  subject: Subject;
  isExpanded: boolean;
  onToggle: () => void;
}

export function SubjectSection({ subject, isExpanded, onToggle }: SubjectSectionProps) {
  return (
    <div>
      <SubjectCard
        subject={subject}
        isExpanded={isExpanded}
        onToggle={onToggle}
      />
      <UnitList
        units={subject.units}
        subjectId={subject.id}
        isVisible={isExpanded}
      />
    </div>
  );
}
