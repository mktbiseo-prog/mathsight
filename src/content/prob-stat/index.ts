import type { ConceptData } from "@/types/concept";
import { probability } from "./probability";
import { normalDist } from "./normal-dist";
import { combinations } from "./combinations";

export const probStatConcepts: ConceptData[] = [
  probability,
  normalDist,
  combinations,
];
