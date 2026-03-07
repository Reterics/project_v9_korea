import type { StudyItemRef } from "@/features/learn/games/_core/gameTypes";

export type ParticleRole = "topic" | "subject" | "object";

export type ParticleQuestion = {
  ref: StudyItemRef;
  prompt: string;
  english: string;
  hint: string;
  explanation: string;
  role: ParticleRole;
  choices: string[];
  correctParticle: string;
  shownAt: number;
};
