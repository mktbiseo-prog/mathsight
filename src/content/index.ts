export { SUBJECTS, getSubject, getUnit } from "./subjects";
export { math2Concepts } from "./math2";
export { calculusConcepts } from "./calculus";
export { geometryConcepts } from "./geometry";
export { math1Concepts } from "./math1";
export { probStatConcepts } from "./prob-stat";
export { middleGeoConcepts } from "./middle-geo";

import type { ConceptData } from "@/types/concept";
import { math2Concepts } from "./math2";
import { calculusConcepts } from "./calculus";
import { geometryConcepts } from "./geometry";
import { math1Concepts } from "./math1";
import { probStatConcepts } from "./prob-stat";
import { middleGeoConcepts } from "./middle-geo";

const allConcepts: ConceptData[] = [
  ...math2Concepts,
  ...calculusConcepts,
  ...geometryConcepts,
  ...math1Concepts,
  ...probStatConcepts,
  ...middleGeoConcepts,
];

export function getConceptData(unitId: string): ConceptData | undefined {
  return allConcepts.find((c) => c.unitId === unitId);
}
