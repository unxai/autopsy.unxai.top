import { caseSeeds } from "./case-seeds";

export const allCases = caseSeeds;
export const featuredCases = caseSeeds.slice(0, 3);
export const detailCase = caseSeeds[0];
export const timeline = caseSeeds[0].timeline;
export const sources = caseSeeds[0].sources;

export type CaseItem = (typeof caseSeeds)[number];
