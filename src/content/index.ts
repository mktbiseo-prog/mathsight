export { SUBJECTS, getSubject, getUnit } from "./subjects";
export { math2Concepts } from "./math2";
export { calculusConcepts } from "./calculus";
export { geometryConcepts } from "./geometry";

import type { ConceptData } from "@/types/concept";
import { math2Concepts } from "./math2";
import { calculusConcepts } from "./calculus";
import { geometryConcepts } from "./geometry";

const allConcepts: ConceptData[] = [
  ...math2Concepts,
  ...calculusConcepts,
  ...geometryConcepts,
];

export function getConceptData(unitId: string): ConceptData | undefined {
  return allConcepts.find((c) => c.unitId === unitId);
}
